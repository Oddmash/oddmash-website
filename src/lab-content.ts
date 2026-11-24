import type { Locale } from './content';

export const agents = [
  { id: 'lead', name: 'Lead', color: '#9ad9ff' },
  { id: 'impact', name: 'Impact', color: '#ffb67b' },
  { id: 'triage', name: 'Triage', color: '#d5b8ff' },
  { id: 'qa', name: 'QA', color: '#a7e0ac' },
  { id: 'docs', name: 'Docs', color: '#95ded8' },
  { id: 'architect', name: 'Architect', color: '#c8c9ff' },
  { id: 'release', name: 'Release', color: '#ffd27e' },
] as const;

export type AgentId = typeof agents[number]['id'];
type MethodItem = { title: string; body: string };
type FilmStep = { title: string; body: string; artifact: string; signal: string };
type LabCopy = {
  methodNav: string;
  projectTitle: string;
  projectLead: string;
  methodTitle: string;
  methodLead: string;
  methods: readonly MethodItem[];
  agentsTitle: string;
  agentsLead: string;
  reviewMode: string;
  advisoryMode: string;
  issueMode: string;
  agentDescriptions: Record<AgentId, string>;
  workflowTitle: string;
  workflowLead: string;
  exampleLabel: string;
  developer: string;
  maintainer: string;
  checks: string;
  steps: readonly FilmStep[];
};

export const scenes = [
  { id: 'issue', left: 'triage', right: 'impact', color: '#d5b8ff', glyph: '?' },
  { id: 'build', left: null, right: 'architect', color: '#c8c9ff', glyph: '<>' },
  { id: 'checks', left: 'qa', right: null, color: '#a7e0ac', glyph: 'PR' },
  { id: 'review', left: 'lead', right: 'docs', color: '#9ad9ff', glyph: '◎' },
  { id: 'decision', left: 'release', right: null, color: '#ffd27e', glyph: '✓' },
  { id: 'deploy', left: null, right: null, color: '#95ded8', glyph: '↗' },
] as const satisfies readonly { id: string; left: AgentId | null; right: AgentId | null; color: string; glyph: string }[];

export const labCopy: Record<Locale, LabCopy> = {
  en: {
    methodNav: 'How we build',
    projectTitle: 'Tools for everyday development.',
    projectLead: 'Small, focused tools for the problems that keep showing up in software.',
    methodTitle: 'How we build.',
    methodLead: 'Reusable development skills turn our principles into working guides, from the first idea to the last check. Each product has its own constraints, but we make consistent choices.',
    methods: [
      { title: 'Decide what matters', body: 'Start with the developer problem. Define the smallest useful change and what success looks like.' },
      { title: 'Design with intent', body: 'Use shared design tokens, accessible controls and purposeful motion. Keep the interaction as simple as the task allows.' },
      { title: 'Build to a contract', body: 'Respect the public API and project conventions. Keep changes focused, maintainable and easy to review.' },
      { title: 'Verify before shipping', body: 'Test real behavior, review accessibility and document changes. Use evidence to decide whether the work is ready.' },
    ],
    agentsTitle: 'Different perspectives. One review.',
    agentsLead: 'Our role-based agents provide focused support. Lead handles the formal review; other specialists provide relevant advice when requested or selected. Not every pull request needs every role.',
    reviewMode: 'Formal review',
    advisoryMode: 'Specialist advice',
    issueMode: 'Issue advice',
    agentDescriptions: {
      lead: 'Coordinates review and identifies concrete regressions.',
      impact: 'Evaluates usefulness, necessity and trade-offs.',
      triage: 'Helps classify issues and prioritize work.',
      qa: 'Examines test coverage and verification evidence.',
      docs: 'Checks that examples and documentation match the code.',
      architect: 'Assesses design and maintainability.',
      release: 'Helps prepare release notes and change summaries.',
    },
    workflowTitle: 'From pull request to production.',
    workflowLead: 'A change moves through the people, checks and guidance that make it reliable. Scroll through an illustrative journey, from the first issue to a verified public release.',
    exampleLabel: 'Illustrative workflow',
    developer: 'Developer',
    maintainer: 'Maintainer',
    checks: 'CI checks',
    steps: [
      { title: 'Start with a real problem.', body: 'Describe the issue and its expected behavior. Triage and Impact can help refine the scope when needed.', artifact: 'Issue', signal: 'Scope defined' },
      { title: 'Make a focused change.', body: 'Developers and coding assistants implement the change using project-specific guidance. Architect can advise on structural choices.', artifact: 'Code change', signal: 'Ready to review' },
      { title: 'Open a pull request.', body: 'The change has a clear description and linked issue. CI runs the applicable checks; QA can help identify missing verification.', artifact: 'Pull request', signal: 'Checks & evidence' },
      { title: 'Review, refine, repeat.', body: 'Lead reviews the change. Relevant specialists can provide advice, and developers address concrete findings before the next check.', artifact: 'Review', signal: 'Findings addressed' },
      { title: 'Decide what can ship.', body: 'Passing checks and review evidence support the maintainer’s decision. Release can help prepare the notes; agents do not authorize deployment.', artifact: 'Merge decision', signal: 'Maintainer decision' },
      { title: 'Publish and verify.', body: 'When authorized, the release workflow builds and publishes the product. The maintainer verifies the public result.', artifact: 'Public release', signal: 'Published & verified' },
    ],
  },
  ko: {
    methodNav: '개발 방식',
    projectTitle: '개발의 일상을 위한 도구.',
    projectLead: '소프트웨어 개발에서 반복해서 마주치는 문제를 작고 집중된 도구로 해결합니다.',
    methodTitle: '우리가 만드는 방식.',
    methodLead: '재사용 가능한 개발 스킬을 작업 지침으로 활용해 첫 아이디어부터 마지막 검증까지 일관된 판단을 내립니다. 제품마다 제약은 다르지만 공통 원칙을 지킵니다.',
    methods: [
      { title: '중요한 문제부터', body: '개발자가 겪는 문제에서 시작합니다. 가장 작은 유용한 변경과 성공 기준을 정합니다.' },
      { title: '의도 있는 디자인', body: '공용 디자인 토큰, 접근 가능한 조작 요소, 목적에 맞는 모션을 활용합니다. 필요한 만큼만 인터페이스를 복잡하게 만듭니다.' },
      { title: '약속을 지키는 구현', body: '공개 API와 프로젝트 규칙을 준수합니다. 변경 범위를 명확히 하고 유지보수와 검토가 쉽도록 구현합니다.' },
      { title: '배포 전 검증', body: '실제 동작과 접근성을 확인하고 변경 사항을 문서화합니다. 검증 근거로 작업의 준비 상태를 판단합니다.' },
    ],
    agentsTitle: '다른 관점, 하나의 검토.',
    agentsLead: '역할별 에이전트가 필요한 부분을 지원합니다. Lead가 정식 리뷰를 맡고 다른 전문가들은 요청되거나 선택된 경우 조언합니다. 모든 PR에 모든 에이전트가 필요한 것은 아닙니다.',
    reviewMode: '정식 리뷰',
    advisoryMode: '전문 검토',
    issueMode: '이슈 검토',
    agentDescriptions: {
      lead: '리뷰를 조율하고 구체적인 회귀 문제를 확인합니다.',
      impact: '제품 가치와 필요성, 트레이드오프를 검토합니다.',
      triage: '이슈를 분류하고 우선순위를 정하는 데 도움을 줍니다.',
      qa: '테스트 범위와 검증 근거를 확인합니다.',
      docs: '예제와 문서가 실제 코드와 일치하는지 살펴봅니다.',
      architect: '설계와 유지보수성을 검토합니다.',
      release: '릴리스 노트와 변경 사항 요약을 준비하도록 돕습니다.',
    },
    workflowTitle: 'PR에서 배포까지.',
    workflowLead: '하나의 변경에는 개발자, 검증 과정, 작업 지침이 함께합니다. 이슈부터 공개 배포 확인까지 이어지는 예시 과정을 스크롤하며 살펴보세요.',
    exampleLabel: '작업 과정 예시',
    developer: '개발자',
    maintainer: '유지보수 담당자',
    checks: '자동 검증',
    steps: [
      { title: '실제 문제에서 시작합니다.', body: '이슈와 기대 동작을 정의합니다. 필요한 경우 Triage와 Impact의 조언으로 변경 범위를 구체화합니다.', artifact: '이슈', signal: '범위 정의' },
      { title: '집중된 변경을 구현합니다.', body: '개발자와 코딩 도우미가 프로젝트 지침에 맞춰 구현합니다. 구조적인 선택에는 Architect의 조언을 활용할 수 있습니다.', artifact: '코드 변경', signal: '검토 준비' },
      { title: 'Pull Request를 엽니다.', body: '변경 목적과 연결된 이슈를 기록합니다. CI가 필요한 검증을 실행하고 QA는 누락된 검증을 찾도록 도울 수 있습니다.', artifact: 'Pull Request', signal: '검증과 근거' },
      { title: '검토하고 개선합니다.', body: 'Lead가 변경을 리뷰하고 관련 전문 에이전트가 조언할 수 있습니다. 개발자는 구체적인 문제를 해결한 뒤 다시 검증합니다.', artifact: '코드 리뷰', signal: '발견 사항 처리' },
      { title: '배포할 변경을 결정합니다.', body: '검증 결과와 리뷰 근거로 유지보수 담당자가 판단합니다. Release는 노트 준비를 지원하지만 배포 권한을 부여하지 않습니다.', artifact: '병합 결정', signal: '담당자 판단' },
      { title: '공개하고 확인합니다.', body: '승인된 배포 과정에서 제품을 빌드하고 공개합니다. 유지보수 담당자가 실제 공개 결과를 확인합니다.', artifact: '공개 배포', signal: '공개 결과 확인' },
    ],
  },
  ja: {
    methodNav: '開発の進め方',
    projectTitle: '開発の日常を支えるツール。',
    projectLead: 'ソフトウェア開発で繰り返し発生する課題を、小さく目的の明確なツールで解決します。',
    methodTitle: '開発の進め方。',
    methodLead: '再利用できる開発スキルを作業指針として、最初のアイデアから最後の検証まで活用します。各製品には異なる制約がありますが、共通の原則で判断します。',
    methods: [
      { title: '重要な課題を見極める', body: '開発者が直面する課題から始め、必要最小限の変更と成功の基準を定めます。' },
      { title: '意図を持ってデザインする', body: '共通のデザイントークン、アクセシブルな操作、目的に合ったモーションを使います。' },
      { title: '契約に沿って実装する', body: '公開APIとプロジェクトの規約を尊重し、レビューと保守がしやすい変更にします。' },
      { title: '公開前に検証する', body: '実際の動作とアクセシビリティを確認し、変更を文書化します。根拠に基づいて公開準備を判断します。' },
    ],
    agentsTitle: '異なる視点で、一つのレビューを。',
    agentsLead: '役割ごとのエージェントが作業を支援します。Lead が正式なレビューを担当し、他の専門家は必要に応じて助言します。すべてのPRに全員が参加するわけではありません。',
    reviewMode: '正式レビュー',
    advisoryMode: '専門的な助言',
    issueMode: '課題への助言',
    agentDescriptions: {
      lead: 'レビューを調整し、具体的な回帰問題を確認します。',
      impact: '製品価値、必要性、トレードオフを評価します。',
      triage: '課題の分類と優先順位付けを支援します。',
      qa: 'テスト範囲と検証の根拠を確認します。',
      docs: '例とドキュメントがコードと一致するかを確認します。',
      architect: '設計と保守性を評価します。',
      release: 'リリースノートと変更の要約を準備します。',
    },
    workflowTitle: 'PRからデプロイまで。',
    workflowLead: '一つの変更は開発者、検証、作業指針を通して進みます。課題から公開結果の確認までの例をスクロールしてご覧ください。',
    exampleLabel: 'ワークフローの例',
    developer: '開発者',
    maintainer: 'メンテナー',
    checks: 'CI 検証',
    steps: [
      { title: '実際の課題から始める。', body: '課題と期待する動作を定義します。必要な場合は Triage と Impact の助言で範囲を明確にします。', artifact: '課題', signal: '範囲の定義' },
      { title: '変更を実装する。', body: '開発者とコーディング支援ツールがプロジェクトの指針に従って実装します。Architect は構造の選択を助言できます。', artifact: 'コード変更', signal: 'レビュー準備' },
      { title: 'Pull Requestを開く。', body: '変更の目的と関連課題を記録します。CIが必要な検証を実行し、QA は不足する検証の発見を支援します。', artifact: 'Pull Request', signal: '検証と根拠' },
      { title: 'レビューして改善する。', body: 'Lead が変更をレビューし、必要な専門家は助言できます。開発者は具体的な指摘を解消して再検証します。', artifact: 'レビュー', signal: '指摘への対応' },
      { title: '公開できる変更を判断する。', body: '検証とレビューの根拠に基づきメンテナーが判断します。Release はノートの準備を支援しますが公開を承認しません。', artifact: 'マージ判断', signal: 'メンテナー判断' },
      { title: '公開して確認する。', body: '承認された公開手順が製品をビルドして公開します。メンテナーが実際の公開結果を確認します。', artifact: '公開リリース', signal: '公開結果の確認' },
    ],
  },
  'zh-CN': {
    methodNav: '开发方式',
    projectTitle: '面向日常开发的工具。',
    projectLead: '用小而专注的工具解决软件开发中反复遇到的问题。',
    methodTitle: '我们的开发方式。',
    methodLead: '将可复用的开发技能转化为工作指南，从最初的想法到最后的验证都贯彻其中。不同产品有各自的约束，但我们遵循共享原则。',
    methods: [
      { title: '明确重要的问题', body: '从开发者遇到的问题出发，定义有价值的最小改动和成功标准。' },
      { title: '有目的地设计', body: '使用共享设计令牌、无障碍控件和有意义的动效，让界面保持简洁。' },
      { title: '遵循约定实现', body: '遵守公开 API 和项目规范，使改动聚焦、易维护、易审查。' },
      { title: '发布前验证', body: '检查真实行为和无障碍体验，记录改动。根据验证证据判断是否可以发布。' },
    ],
    agentsTitle: '不同视角，一次审查。',
    agentsLead: '按角色分工的智能体提供有针对性的支持。Lead 负责正式审查，其他专家在被请求或选中时提供建议。并非每个 PR 都需要所有角色。',
    reviewMode: '正式审查',
    advisoryMode: '专项建议',
    issueMode: '问题建议',
    agentDescriptions: {
      lead: '协调审查并发现具体的回归问题。',
      impact: '评估产品价值、必要性和取舍。',
      triage: '帮助分类问题并确定优先级。',
      qa: '检查测试覆盖范围和验证证据。',
      docs: '确认示例和文档与实际代码一致。',
      architect: '评估设计和可维护性。',
      release: '协助准备发布说明和改动摘要。',
    },
    workflowTitle: '从拉取请求到部署。',
    workflowLead: '每次改动都经过开发者、验证和工作指南的协作。滚动查看从提出问题到验证公开结果的示例过程。',
    exampleLabel: '工作流程示例',
    developer: '开发者',
    maintainer: '维护者',
    checks: '持续集成',
    steps: [
      { title: '从实际问题开始。', body: '定义问题和预期行为。需要时借助 Triage 和 Impact 的建议明确范围。', artifact: '问题', signal: '范围明确' },
      { title: '实现聚焦的改动。', body: '开发者和编码助手依据项目指南实现改动。Architect 可以针对结构选择提供建议。', artifact: '代码改动', signal: '准备审查' },
      { title: '创建拉取请求。', body: '记录改动目的并关联问题。CI 运行适用的检查，QA 可帮助发现缺失的验证。', artifact: 'Pull Request', signal: '检查与证据' },
      { title: '审查、改进、再验证。', body: 'Lead 审查改动，相关专家可以提供建议。开发者解决具体问题后再次验证。', artifact: '代码审查', signal: '问题已处理' },
      { title: '决定可以发布的内容。', body: '维护者根据检查和审查证据做出决定。Release 协助准备说明，但不授权部署。', artifact: '合并决策', signal: '维护者决策' },
      { title: '发布并确认结果。', body: '经过授权的发布流程构建并公开产品，维护者确认实际公开结果。', artifact: '公开发布', signal: '发布结果已确认' },
    ],
  },
};
