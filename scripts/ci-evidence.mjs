const sha = /^[a-f0-9]{40}$/;
const workflow = '.github/workflows/ci.yml';
const successful = item => item?.status === 'completed' && item.conclusion === 'success';
const validId = id => Number.isSafeInteger(id) && id > 0;

export async function findMergedTreeEvidence(api, { repository, repositoryId, revision, before, currentRun }) {
  if (!sha.test(revision) || !sha.test(before) || !validId(repositoryId) || !validId(currentRun)) return null;

  const root = `/repos/${repository}`;
  try {
    const commit = await api(`${root}/commits/${revision}`);
    const tree = commit.commit?.tree?.sha;
    const parents = commit.parents ?? [];
    if (commit.sha !== revision || !sha.test(tree) || parents.length !== 2 || parents[0].sha !== before || !sha.test(parents[1].sha)) return null;
    const head = parents[1].sha;

    const associated = await api(`${root}/commits/${revision}/pulls?per_page=10`);
    const matches = associated.filter(pr => pr.merge_commit_sha === revision && pr.merged_at && pr.base?.ref === 'main' &&
      pr.base.repo?.id === repositoryId && pr.head?.sha === head && typeof pr.head.ref === 'string' && validId(pr.head.repo?.id));
    if (matches.length !== 1) return null;
    const pr = matches[0];
    const mergedAt = Date.parse(pr.merged_at);
    if (!Number.isFinite(mergedAt)) return null;

    const query = new URLSearchParams({event:'pull_request',branch:pr.head.ref,head_sha:head,per_page:'10'});
    const {workflow_runs:runs} = await api(`${root}/actions/workflows/ci.yml/runs?${query}`);
    const candidates = runs.filter(run => run.path === workflow && run.event === 'pull_request' && run.head_sha === head && run.head_branch === pr.head.ref);
    if (candidates.some(run => !validId(run.head_repository?.id) || !validId(run.id) || !validId(run.run_number))) return null;
    const applicable = candidates.filter(run => run.head_repository.id === pr.head.repo.id && run.id !== currentRun);
    const latest = applicable.sort((a,b) => b.run_number-a.run_number)[0];
    if (!successful(latest) || !validId(latest.run_attempt)) return null;

    const {jobs} = await api(`${root}/actions/runs/${latest.id}/attempts/${latest.run_attempt}/jobs?per_page=30`);
    const tests = jobs.find(job => job.name === 'website-tests');
    const verify = jobs.find(job => job.name === 'verify');
    if (![tests,verify].every(job => successful(job) && Number.isFinite(Date.parse(job.completed_at)) && Date.parse(job.completed_at) <= mergedAt)) return null;
    const steps = ['Run pnpm run check','Run pnpm run test:browser',`Record tested tree ${tree}`];
    return steps.every(name => tests.steps?.some(step => step.name === name && successful(step))) ? latest.id : null;
  } catch {
    return null;
  }
}
