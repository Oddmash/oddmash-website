import type { Locale } from './content';
import { agents, type AgentId } from './lab-content';

const roleOptions = {
  lead: { command: '/review', target: 'pr' },
  impact: { command: '/impact', target: 'pr' },
  triage: { command: '/triage', target: 'issue' },
  qa: { command: '/qa', target: 'pr' },
  docs: { command: '/docs', target: 'pr' },
  architect: { command: '/architect', target: 'pr' },
  release: { command: '/release', target: 'pr' },
} as const satisfies Record<AgentId, { command: string; target: 'pr' | 'issue' }>;

export const agentRoles = agents.map(agent => ({ ...agent, ...roleOptions[agent.id] }));
export const agentPaths = ['agents', ...agentRoles.map(role => 'agents/' + role.id)];
export const findAgentRole = (path: string) => agentRoles.find(role => path === 'agents/' + role.id);

type RoleCopy = {
  focus: string;
  checks: readonly string[];
  output: string;
  example: string;
  boundary: string;
};

type DocsCopy = {
  title: string;
  nav: string;
  intro: string;
  rosterTitle: string;
  rosterLead: string;
  explore: string;
  back: string;
  rolesTitle: string;
  invocation: string;
  invocationBody: string;
  context: string;
  pr: string;
  issue: string;
  command: string;
  auto: string;
  request: string;
  focus: string;
  checks: string;
  output: string;
  example: string;
  boundary: string;
  commandBody: string;
  repository: string;
  repositoryDocs: string;
  skills: string;
  guardrailTitle: string;
  guardrail: string;
  roles: Record<AgentId, RoleCopy>;
};

export const agentDocsCopy: Record<Locale, DocsCopy> = {
  en: {
    title: 'Oddmash Agents',
    nav: 'Agents',
    intro: 'Meet seven focused roles that help us identify useful work, verify changes and prepare releases with evidence.',
    rosterTitle: 'Meet the agents.',
    rosterLead: 'Seven voices, each with a specific responsibility. Explore how they work.',
    explore: 'Explore all agent roles',
    back: 'All agents',
    rolesTitle: 'Choose a role',
    invocation: 'Working with agents',
    invocationBody: 'Maintainers can request a relevant role with a slash command in an open issue or pull request. Lead is the automatic formal reviewer. Lead can select relevant specialists when coordinated advice is enabled.',
    context: 'Context',
    pr: 'Open pull request',
    issue: 'Open issue',
    command: 'Command',
    auto: 'Automatic review',
    request: 'Advisory on request',
    focus: 'When to use it',
    checks: 'What it examines',
    output: 'What you receive',
    example: 'Example in practice',
    boundary: 'Responsibility boundary',
    commandBody: 'Place one slash command on the first non-empty line of a comment in the context shown above. Add optional context on following lines. An explicit mention of the corresponding configured and authorized agent can also be used. Request only the roles relevant to the change.',
    repository: 'Agent repository',
    repositoryDocs: 'Agent family reference',
    skills: 'Shared development skills',
    guardrailTitle: 'Evidence before decisions.',
    guardrail: 'Agents support review and planning. Specialists publish advice rather than approvals. Lead issues the formal review based on the current change and required verification. Maintainers and applicable workflows retain responsibility for merge and release decisions.',
    roles: {
      lead: { focus: 'A pull request is ready for a formal quality review.', checks: ['Concrete regressions and required project conventions', 'Current verification results and relevant evidence', 'Specialist findings without duplicate reporting'], output: 'An evidence-based formal review with actionable findings or an explanation of incomplete evidence.', example: 'For a new form component, Lead checks that focus and keyboard interaction still work and that required checks cover the current change.', boundary: 'Lead reviews. The review itself does not authorize deployment.' },
      impact: { focus: 'A proposed feature or refactor needs a clear case beyond its implementation.', checks: ['Product value and fit with the developer problem', 'Necessity, scope and alternatives', 'Trade-offs and ongoing maintenance cost'], output: 'Advice on whether the change is worth making and which trade-offs deserve a decision.', example: 'For a request to add a new component, Impact compares the need with existing reusable controls before expanding the API.', boundary: 'Impact advises on value and scope. It does not approve or prioritize work on its own.' },
      triage: { focus: 'An open issue needs classification, clarification or a next step.', checks: ['Whether the report is actionable and sufficiently described', 'Related issues, duplicates and priority considerations', 'A bounded next step for the maintainer'], output: 'An advisory classification with suggested priority and follow-up.', example: 'For a reported mobile layout defect, Triage identifies missing reproduction details and related reports.', boundary: 'Triage handles issues rather than pull request reviews and does not independently change issue state.' },
      qa: { focus: 'A pull request needs a second look at verification and coverage.', checks: ['Observed CI and test results', 'Missing regression cases and edge conditions', 'Whether the evidence supports the documented behavior'], output: 'A verification assessment with missing scenarios or gaps in evidence.', example: 'For a language menu change, QA looks for keyboard operation, mobile widths and locale navigation tests.', boundary: 'QA assesses verification. It does not mark unobserved tests as passing or replace CI.' },
      docs: { focus: 'A code or behavior change affects how developers learn or use a product.', checks: ['Whether examples match the implementation', 'Missing usage, API or compatibility information', 'Consistency of user-facing descriptions'], output: 'Documentation recommendations and concrete gaps to address.', example: 'After an API change, Docs checks whether the installation example and public usage guide still describe valid behavior.', boundary: 'Docs identifies documentation gaps. It does not establish release or compatibility guarantees.' },
      architect: { focus: 'A structural change raises design or maintainability questions.', checks: ['Module boundaries and coupling', 'Alternatives and implementation trade-offs', 'Compatibility and long-term maintainability'], output: 'A scoped design assessment with trade-offs and recommendations.', example: 'For a proposed shared module, Architect considers whether its responsibility belongs in a common library or the product itself.', boundary: 'Architect advises on design choices. Developers and maintainers decide what to implement.' },
      release: { focus: 'A change needs clear release communication or a version-impact assessment.', checks: ['User-visible changes and compatibility implications', 'Evidence for changelog and release note claims', 'Whether a version-impact recommendation is justified'], output: 'A release note draft and version-impact guidance.', example: 'For a completed API improvement, Release summarizes the behavior change and explains relevant compatibility considerations.', boundary: 'Release prepares information. It does not publish a release or authorize deployment.' },
    },
  },
  ko: {
    title: 'Oddmash 에이전트',
    nav: '에이전트',
    intro: '가치 있는 작업을 찾고 변경 사항을 검증하며 근거에 기반한 릴리스를 준비하도록 돕는 일곱 역할을 소개합니다.',
    rosterTitle: '에이전트 소개',
    rosterLead: '일곱 에이전트는 각자의 책임을 갖고 협업합니다. 역할별 자세한 내용을 확인해 보세요.',
    explore: '전체 에이전트 알아보기',
    back: '전체 에이전트',
    rolesTitle: '역할 둘러보기',
    invocation: '에이전트와 함께 작업하기',
    invocationBody: '유지보수 담당자는 열린 이슈나 PR에서 슬래시 명령으로 필요한 역할에 검토를 요청할 수 있습니다. Lead는 자동 정식 리뷰를 담당하며, 협업 검토가 활성화된 경우 관련 전문가를 선택할 수 있습니다.',
    context: '요청 대상',
    pr: '열린 Pull Request',
    issue: '열린 이슈',
    command: '명령어',
    auto: '자동 정식 리뷰',
    request: '요청 기반 전문 검토',
    focus: '언제 활용하나요?',
    checks: '검토하는 항목',
    output: '제공하는 결과',
    example: '활용 예시',
    boundary: '책임 범위',
    commandBody: '위에 표시된 대상의 댓글에서 첫 공백이 아닌 줄에 슬래시 명령 하나를 입력합니다. 추가 설명은 다음 줄에 작성할 수 있습니다. 해당 에이전트가 설정되었고 권한이 있는 경우 직접 멘션할 수도 있습니다. 변경 사항에 필요한 역할만 요청합니다.',
    repository: '에이전트 저장소',
    repositoryDocs: '에이전트 공식 참고 문서',
    skills: '공통 개발 스킬',
    guardrailTitle: '의사 결정은 근거를 바탕으로.',
    guardrail: '에이전트는 검토와 계획을 지원합니다. 전문 에이전트는 승인 대신 조언을 제공하며, Lead는 현재 변경 사항과 필수 검증 결과를 바탕으로 정식 리뷰를 수행합니다. 병합과 배포에는 유지보수 담당자의 결정과 적용되는 워크플로가 필요합니다.',
    roles: {
      lead: { focus: 'PR이 정식 품질 리뷰를 받을 준비가 되었을 때 활용합니다.', checks: ['구체적인 회귀 문제와 필수 프로젝트 규칙', '현재 검증 결과 및 관련 근거', '중복되지 않는 전문 에이전트의 발견 사항'], output: '실제 근거로 확인한 문제와 조치 사항을 정식 리뷰로 제공합니다. 근거가 부족한 경우 그 이유를 설명합니다.', example: '새로운 폼 컴포넌트에서 포커스와 키보드 상호작용이 정상인지, 필수 검사 결과가 현재 변경 사항을 충분히 검증하는지 확인합니다.', boundary: 'Lead는 리뷰를 담당합니다. 리뷰 자체가 배포 권한을 부여하지는 않습니다.' },
      impact: { focus: '새로운 기능이나 리팩터링에 구현 이상의 명확한 필요성이 있는지 판단할 때 활용합니다.', checks: ['개발 문제와 제품 가치의 관련성', '필요성, 변경 범위와 대안', '트레이드오프와 유지보수 비용'], output: '변경할 가치가 있는지, 어떤 트레이드오프를 결정해야 하는지 조언합니다.', example: '새 컴포넌트 도입 요청에서 기존 공용 컨트롤로 해결할 수 있는지 검토하고 API 확장 필요성을 확인합니다.', boundary: '제품 가치와 범위를 조언합니다. 독자적으로 작업을 승인하거나 우선순위를 결정하지 않습니다.' },
      triage: { focus: '열린 이슈의 분류, 설명 보완이나 다음 단계가 필요할 때 활용합니다.', checks: ['보고 내용의 구체성과 작업 가능성', '관련 이슈, 중복 여부와 우선순위 고려 사항', '유지보수 담당자가 진행할 다음 단계'], output: '분류, 권장 우선순위, 후속 작업에 대한 조언을 제공합니다.', example: '모바일 레이아웃 오류가 보고되면 부족한 재현 정보와 유사한 이슈를 파악합니다.', boundary: 'PR 대신 이슈를 대상으로 검토합니다. 독자적으로 이슈 상태를 변경하지 않습니다.' },
      qa: { focus: 'PR의 검증 결과와 테스트 범위를 추가로 검토할 때 활용합니다.', checks: ['관찰된 CI 및 테스트 결과', '누락된 회귀 테스트와 예외 상황', '동작 설명을 검증 근거가 뒷받침하는지 여부'], output: '검증 상태를 평가하고 추가할 시나리오나 근거의 공백을 알려 줍니다.', example: '언어 메뉴의 변경에서 키보드 조작, 모바일 화면 너비, 언어별 이동 테스트를 확인합니다.', boundary: '검증 여부를 평가합니다. 실행되지 않은 테스트를 성공으로 기록하거나 CI를 대체하지 않습니다.' },
      docs: { focus: '코드나 동작의 변경이 개발자의 제품 사용 방법에 영향을 줄 때 활용합니다.', checks: ['예시와 실제 구현의 일치 여부', '누락된 사용 방법, API 및 호환성 정보', '사용자에게 보여 주는 설명의 일관성'], output: '문서 개선 제안과 보완해야 할 구체적인 항목을 제공합니다.', example: 'API가 변경되면 설치 예시와 공개 사용 가이드가 여전히 유효한 동작을 설명하는지 확인합니다.', boundary: '문서가 부족한 부분을 찾아냅니다. 릴리스 여부나 호환성을 보장하지 않습니다.' },
      architect: { focus: '구조적인 변경에서 설계와 유지보수성을 판단할 때 활용합니다.', checks: ['모듈 간 경계와 결합도', '설계 대안과 구현의 트레이드오프', '호환성과 장기 유지보수성'], output: '변경 범위에 맞는 설계 평가와 대안, 트레이드오프를 제공합니다.', example: '공용 모듈을 제안하면 공용 라이브러리에서 관리할 책임인지 제품 내부에서 관리할 책임인지 검토합니다.', boundary: '설계 판단을 조언합니다. 실제 구현 여부는 개발자와 유지보수 담당자가 결정합니다.' },
      release: { focus: '변경 사항에 필요한 릴리스 안내나 버전 영향을 검토할 때 활용합니다.', checks: ['사용자에게 영향을 주는 변경과 호환성', '변경 기록이나 릴리스 노트의 근거', '버전 영향 제안의 타당성'], output: '릴리스 노트 초안과 버전 영향에 관한 조언을 제공합니다.', example: 'API 개선의 동작 변화를 요약하고 관련 호환성 고려 사항을 릴리스 노트로 정리합니다.', boundary: '릴리스 준비를 지원합니다. 직접 릴리스를 발행하거나 배포를 승인하지 않습니다.' },
    },
  },
  ja: {
    title: 'Oddmash エージェント',
    nav: 'エージェント',
    intro: '価値のある作業の発見、変更の検証、根拠に基づくリリース準備を支援する七つの役割を紹介します。',
    rosterTitle: 'エージェントの紹介',
    rosterLead: '七つの役割がそれぞれの責任を持って連携します。各役割の詳細を確認できます。',
    explore: 'すべての役割を見る',
    back: '全エージェント',
    rolesTitle: '役割を選ぶ',
    invocation: 'エージェントと作業する',
    invocationBody: 'メンテナーは公開中の Issue または PR でスラッシュコマンドを使い、必要な役割に依頼できます。Lead は自動の正式レビューを担当し、連携による助言が有効な場合は関連する専門家を選択できます。',
    context: '対象',
    pr: '開いている Pull Request',
    issue: '開いている Issue',
    command: 'コマンド',
    auto: '自動レビュー',
    request: '依頼による助言',
    focus: '利用する場面',
    checks: '確認する項目',
    output: '得られる結果',
    example: '利用例',
    boundary: '責任の範囲',
    commandBody: '上記の対象のコメントで、最初の空白でない行にスラッシュコマンドを一つ入力します。補足は次の行に記入できます。該当するエージェントが設定済みで権限を持つ場合は、直接メンションすることもできます。変更に必要な役割だけに依頼します。',
    repository: 'エージェントのリポジトリ',
    repositoryDocs: 'エージェント公式リファレンス',
    skills: '共通の開発スキル',
    guardrailTitle: '根拠に基づく判断。',
    guardrail: 'エージェントはレビューと計画を支援します。専門家は承認ではなく助言を提供し、Lead は現在の変更と必須の検証を根拠に正式レビューを行います。マージと公開の責任はメンテナーと適用されるワークフローにあります。',
    roles: {
      lead: { focus: 'PR が正式な品質レビューを受ける準備ができた場面です。', checks: ['具体的な回帰と必須のプロジェクト規約', '現在の検証結果と関連する根拠', '重複しない専門家の指摘'], output: '実際の根拠に基づく正式レビューを提供し、根拠が不足している場合は理由を説明します。', example: 'フォームの変更でフォーカスとキーボード操作が維持され、必須の検証が現在の変更を網羅しているか確認します。', boundary: 'Lead はレビューを担当します。レビュー自体はデプロイを承認しません。' },
      impact: { focus: '機能追加やリファクタリングの必要性を実装とは別に判断する場面です。', checks: ['開発者の課題との関連性と製品価値', '必要性、範囲、代替案', 'トレードオフと将来の保守コスト'], output: '変更の価値と判断すべきトレードオフについて助言します。', example: '新しいコンポーネントを追加する前に、既存の共通コントロールで解決できるか評価します。', boundary: '価値と範囲を助言します。単独で変更を承認したり優先順位を確定したりしません。' },
      triage: { focus: '開いている Issue の分類、明確化、次の手順が必要な場面です。', checks: ['報告が具体的で対応可能か', '関連 Issue、重複、優先順位の考慮事項', 'メンテナーが進める次の手順'], output: '分類、推奨優先順位、フォローアップについて助言します。', example: 'モバイル表示の不具合報告から、不足している再現情報と関連する報告を特定します。', boundary: 'PR レビューではなく Issue を対象とします。単独で Issue の状態は変更しません。' },
      qa: { focus: 'PR の検証結果とテスト範囲を再確認する場面です。', checks: ['観測された CI とテスト結果', '不足する回帰テストと境界条件', '検証の根拠が記載された動作を裏付けるか'], output: '検証状況を評価し、不足するシナリオや根拠を示します。', example: '言語メニューの変更でキーボード操作、モバイル幅、言語別ナビゲーションのテストを確認します。', boundary: '検証を評価する役割です。未確認のテストを成功としたり CI を代替したりしません。' },
      docs: { focus: 'コードや動作の変更が製品の使い方に影響する場面です。', checks: ['例と実装の一致', '不足する利用方法、API、互換性情報', '利用者向けの説明の一貫性'], output: 'ドキュメントの改善案と具体的な不足箇所を提示します。', example: 'API の変更後にインストール例と公開ガイドが有効な動作を示しているか確認します。', boundary: 'ドキュメントの不足を指摘します。リリースや互換性を保証する役割ではありません。' },
      architect: { focus: '構造の変更で設計と保守性について判断する場面です。', checks: ['モジュール間の境界と結合', '代替案と実装のトレードオフ', '互換性と長期的な保守性'], output: '範囲を絞った設計評価、代替案、トレードオフを示します。', example: '共通モジュールの提案が共有ライブラリの責任か、製品内の責任かを評価します。', boundary: '設計判断を助言します。実装するかは開発者とメンテナーが決めます。' },
      release: { focus: '変更のリリース案内やバージョンへの影響を検討する場面です。', checks: ['利用者に見える変更と互換性への影響', '変更履歴やリリースノートの根拠', 'バージョンへの影響の提案が妥当か'], output: 'リリースノートの下書きとバージョンへの影響の助言を提供します。', example: 'API 改善による動作の変更と関連する互換性の注意点をリリースノートにまとめます。', boundary: 'リリース準備を支援します。リリースの公開やデプロイの承認は行いません。' },
    },
  },
  'zh-CN': {
    title: 'Oddmash 智能体',
    nav: '智能体',
    intro: '认识七个专注的角色，它们帮助我们发现有价值的工作、验证改动，并依据证据准备发布。',
    rosterTitle: '认识智能体',
    rosterLead: '七个角色各司其职，共同协作。查看各角色的详细说明。',
    explore: '探索全部智能体',
    back: '全部智能体',
    rolesTitle: '选择角色',
    invocation: '与智能体协作',
    invocationBody: '维护者可以在开放的问题或 PR 中使用斜杠命令请求所需角色。Lead 负责自动正式审查；启用协同建议时，Lead 可以选择相关专家。',
    context: '适用对象',
    pr: '开放的 Pull Request',
    issue: '开放的问题',
    command: '命令',
    auto: '自动正式审查',
    request: '按需提供建议',
    focus: '何时使用',
    checks: '检查内容',
    output: '提供的结果',
    example: '实际示例',
    boundary: '职责边界',
    commandBody: '在上方指定对象的评论中，在第一个非空行输入一个斜杠命令。可在后续行补充说明。对应智能体已配置并获得授权时，也可直接提及它。只请求与改动相关的角色。',
    repository: '智能体仓库',
    repositoryDocs: '智能体官方参考文档',
    skills: '共享开发技能',
    guardrailTitle: '依据证据做决定。',
    guardrail: '智能体协助审查和规划。专家提供建议而非批准，Lead 根据当前改动和必需的验证执行正式审查。维护者与适用的工作流程仍负责合并和发布决定。',
    roles: {
      lead: { focus: 'PR 已准备好接受正式质量审查。', checks: ['具体回归问题和必需的项目规范', '当前验证结果与相关证据', '专业角色发现且不重复的问题'], output: '提供基于证据的正式审查和可执行的问题；证据不足时说明原因。', example: '检查新表单的焦点和键盘操作是否正常，以及必需检查是否覆盖当前改动。', boundary: 'Lead 负责审查。审查本身并不授权部署。' },
      impact: { focus: '判断新增功能或重构在实现之外的必要性。', checks: ['产品价值与开发者问题的关联', '必要性、范围及替代方案', '取舍和长期维护成本'], output: '就改动的价值和需要决策的取舍提供建议。', example: '添加新组件前，先评估现有共享控件是否足以解决问题。', boundary: '提供价值与范围方面的建议，不独立批准改动或决定优先级。' },
      triage: { focus: '开放的问题需要分类、补充说明或后续步骤。', checks: ['报告是否具体且可执行', '相关问题、重复项和优先级因素', '维护者可执行的下一步'], output: '提供分类、建议优先级和后续行动的建议。', example: '移动端布局故障发生时，识别缺失的复现信息和相关报告。', boundary: '处理问题而非 PR 审查，不独立改变问题状态。' },
      qa: { focus: '需要进一步核查 PR 的验证结果与测试覆盖。', checks: ['观察到的 CI 和测试结果', '缺失的回归测试和边界情况', '验证证据是否支持所描述的行为'], output: '评估验证状态并指出缺失的场景或证据。', example: '语言菜单改动时，检查键盘操作、移动端宽度和语言导航测试。', boundary: '评估验证，不把未观察到的测试标记为成功，也不替代 CI。' },
      docs: { focus: '代码或行为变化影响开发者学习和使用产品。', checks: ['示例与实现是否一致', '缺失的使用方法、API 或兼容性信息', '面向用户的描述是否一致'], output: '提供文档改进建议和具体缺失项。', example: 'API 改动后，检查安装示例和公开使用指南是否仍然描述有效行为。', boundary: '识别文档缺失项，不保证发布或兼容性。' },
      architect: { focus: '结构改动引发设计和可维护性方面的问题。', checks: ['模块边界与耦合', '替代方案和实现取舍', '兼容性及长期可维护性'], output: '提供范围明确的设计评估、取舍和建议。', example: '评估拟议的共享模块应由共用库负责，还是留在产品内部。', boundary: '就设计决策提供建议，开发者与维护者决定实际实现。' },
      release: { focus: '需要说明改动的发布内容或评估版本影响。', checks: ['用户可见的变化与兼容性影响', '变更记录和发布说明的依据', '版本影响建议是否合理'], output: '提供发布说明草稿和版本影响建议。', example: 'API 改进完成后，总结行为变化及相关兼容性注意事项。', boundary: '协助发布准备，不直接发布版本或授权部署。' },
    },
  },
};
