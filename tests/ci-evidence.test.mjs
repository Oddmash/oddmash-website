import test from 'node:test';
import assert from 'node:assert/strict';
import { findMergedTreeEvidence } from '../scripts/ci-evidence.mjs';

const hash = character => character.repeat(40);
const revision = hash('a');
const before = hash('b');
const head = hash('c');
const tree = hash('d');
const input = { repository:'Oddmash/example',repositoryId:42,revision,before,currentRun:300 };
const success = { status:'completed',conclusion:'success' };
const testedStep = name => ({ ...success,name });
const fixture = () => ({
  commit:{ sha:revision,commit:{tree:{sha:tree}},parents:[{sha:before},{sha:head}] },
  associated:[{ merge_commit_sha:revision,merged_at:'2026-01-02T12:00:00Z',base:{ref:'main',repo:{id:42}},head:{ref:'feature',sha:head,repo:{id:43}} }],
  runs:[{ ...success,id:100,run_number:7,run_attempt:2,path:'.github/workflows/ci.yml',event:'pull_request',head_sha:head,head_branch:'feature',head_repository:{id:43} }],
  jobs:[
    {...success,name:'website-tests',completed_at:'2026-01-02T11:58:00Z',steps:[testedStep('Run pnpm run check'),testedStep('Run pnpm run test:browser'),testedStep(`Record tested tree ${tree}`)]},
    {...success,name:'verify',completed_at:'2026-01-02T11:59:00Z'},
  ],
});

const mockedApi = (data, calls=[]) => async path => {
  calls.push(path);
  if(path.endsWith(`/commits/${revision}`)) return data.commit;
  if(path.endsWith(`/commits/${revision}/pulls?per_page=10`)) return data.associated;
  if(path.includes('/actions/workflows/ci.yml/runs?')) return {workflow_runs:data.runs};
  if(path.endsWith('/actions/runs/100/attempts/2/jobs?per_page=30')) return {jobs:data.jobs};
  throw new Error('Unexpected evidence request');
};

test('reuses successful PR static and browser tests for the exact normally merged tree', async()=>{
  const calls=[];
  assert.equal(await findMergedTreeEvidence(mockedApi(fixture(),calls),input),100);
  assert.equal(calls.length,4);
  const query=new URLSearchParams(calls[2].split('?')[1]);
  assert.deepEqual(Object.fromEntries(query),{event:'pull_request',branch:'feature',head_sha:head,per_page:'10'});
});

test('falls back for direct, multi-commit, octopus and unrelated pushes', async()=>{
  for(const parents of [[{sha:before}],[{sha:hash('e')},{sha:head}],[{sha:before},{sha:head},{sha:hash('e')}],[]]){
    const data=fixture();
    data.commit.parents=parents;
    assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
  }
  for(const modify of [data=>data.associated=[],data=>data.associated.push(data.associated[0]),data=>data.associated[0].merge_commit_sha=head,data=>data.associated[0].base.ref='feature',data=>data.associated[0].base.repo.id=99,data=>data.associated[0].head.sha=before]){
    const data=fixture(); modify(data);
    assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
  }
});

test('falls back for changed or absent tree proof, skipped tests and failed aggregate verification', async()=>{
  const modifications=[
    data=>data.commit.commit.tree.sha=hash('e'),
    data=>data.jobs[0].steps.pop(),
    data=>data.jobs[0].steps[2].conclusion='skipped',
    data=>data.jobs[0].steps[1].conclusion='failure',
    data=>data.jobs[0].steps[0].conclusion='skipped',
    data=>data.jobs[0].conclusion='skipped',
    data=>data.jobs[1].conclusion='failure',
    data=>data.jobs[1].completed_at='2026-01-02T12:00:01Z',
    data=>data.jobs[1].completed_at=undefined,
    data=>data.jobs[0].completed_at='2026-01-02T12:00:01Z',
  ];
  for(const modify of modifications){
    const data=fixture(); modify(data);
    assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
  }
});

test('does not reuse an older success when the latest applicable PR run is failed or pending', async()=>{
  for(const run of [{status:'completed',conclusion:'failure'},{status:'in_progress',conclusion:null},{status:'completed',conclusion:'cancelled'}]){
    const data=fixture();
    data.runs.push({...data.runs[0],...run,id:101,run_number:8});
    assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
  }
  const data=fixture();
  data.runs.push({...data.runs[0],status:'in_progress',conclusion:null,id:101,run_number:8,head_repository:{id:99}});
  assert.equal(await findMergedTreeEvidence(mockedApi(data),input),100);
  data.runs[1].head_repository=undefined;
  assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
});

test('missing access, invalid identifiers and missing evidence require full verification', async()=>{
  assert.equal(await findMergedTreeEvidence(async()=>{throw new Error('GitHub API denied');},input),null);
  for(const invalid of [{revision:'bad'},{before:''},{repositoryId:0},{currentRun:0}]){
    assert.equal(await findMergedTreeEvidence(async()=>assert.fail('Invalid evidence lookup'),{...input,...invalid}),null);
  }
  const data=fixture(); data.runs=[];
  assert.equal(await findMergedTreeEvidence(mockedApi(data),input),null);
});
