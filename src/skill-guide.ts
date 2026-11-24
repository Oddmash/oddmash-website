import type { Locale } from './content';
const rows = [
  [
    "product-planning",
    "문제와 사용자, 제약을 정리한 뒤 최소 기능과 완료 조건을 이슈에 기록합니다.",
    "Define the user, problem and constraint, then record a minimal scope and acceptance criteria in an issue.",
    "利用者と課題、制約を整理し、最小範囲と完了条件を Issue に記録します。",
    "明确用户、问题与约束，将最小范围和验收条件记录到问题中。"
  ],
  [
    "ux-design",
    "첫 방문부터 핵심 작업까지의 흐름을 그린 뒤 빈 상태, 실패, 키보드 접근을 각각 확인합니다.",
    "Map the first-use journey, then verify empty, failure and keyboard paths.",
    "初回利用の流れを整理し、空状態、失敗、キーボード操作を確認します。",
    "梳理首次使用流程，检查空状态、失败和键盘路径。"
  ],
  [
    "brand-design",
    "실제 제품 화면과 로고에서 시각적 기준을 추출해 색상, 글꼴, 여백을 정하고 좁은 화면의 결과로 비교합니다.",
    "Derive color, type and spacing from the actual product and compare narrow-screen renders.",
    "実際の製品から色、文字、余白の基準を決め、狭い画面で比較します。",
    "从实际产品提取颜色、字体和间距，并比较窄屏效果。"
  ],
  [
    "motion-design",
    "무엇이 바뀌는지와 시작·종료 상태를 정한 뒤 모션 없는 상태에서도 같은 의미를 전달하는지 검사합니다.",
    "Specify what changes and the start/end states; check the equivalent static result.",
    "変化と開始・終了状態を定義し、静的な状態でも意味が伝わるか確認します。",
    "明确变化和起止状态，检查静态状态是否传达相同含义。"
  ],
  [
    "developer-documentation",
    "실제 설치 명령과 첫 번째 실행 예제를 검증하고 API, 설정, 제약을 사용자 사이트에 연결합니다.",
    "Verify installation and a first runnable example; connect API, configuration and limits in native docs.",
    "インストールと実行例を検証し、API、設定、制約を製品文書にまとめます。",
    "验证安装和首个可运行示例，在产品文档中说明 API、配置与限制。"
  ],
  [
    "motion-content-transition",
    "현재 장면과 다음 장면의 읽기 시간을 잡고, 자동 전환을 중지할 수 있는 상태와 정적 대안을 검증합니다.",
    "Set readable scene timing, then verify interruption and static alternatives.",
    "読み取れる場面の時間を決め、中断と静的な代替を確認します。",
    "为场景设置可读时长，并验证中断和静态替代。"
  ],
  [
    "motion-entrance-reveal",
    "중요한 콘텐츠는 처음부터 DOM에 두고 시각적 등장만 추가합니다. 움직임이 꺼져 있을 때도 동일한 내용을 확인합니다.",
    "Keep content in the DOM and enhance visual entry only; verify the static content.",
    "内容を最初から DOM に置き、表示の動きだけを追加して静的状態を確認します。",
    "始终保留 DOM 内容，仅增强入场效果，并检查静态内容。"
  ],
  [
    "motion-layout-transition",
    "변경 전후 실제 요소의 크기를 측정하고 중간 입력이 들어오면 최신 위치로 다시 계산합니다.",
    "Measure before/after geometry and retarget to the latest position on interruption.",
    "変更前後の寸法を測り、中断時は最新の位置に更新します。",
    "测量变化前后几何位置，中断时重新定位到最新目标。"
  ],
  [
    "motion-microinteraction",
    "버튼이나 카드의 조작 영역은 고정하고 아이콘, 색상, 테두리만 반응하게 합니다. hover와 focus를 함께 확인합니다.",
    "Keep the hit area stable; animate icon, color or border, and verify focus as well as hover.",
    "操作領域は固定し、アイコンや色と枠を変化させ、フォーカスも確認します。",
    "保持点击区域稳定，仅改变图标、颜色或边框，并验证焦点。"
  ],
  [
    "motion-feedback",
    "작업 상태를 기준으로 로딩, 성공, 실패 문구를 표시하고 오류 정보가 애니메이션에 의해 늦어지지 않도록 합니다.",
    "Map feedback to actual task state; never delay error information for motion.",
    "実際の状態に合わせて読み込み、成功、失敗を示し、エラーを遅らせません。",
    "根据真实任务状态显示加载、成功和失败，避免动效延迟错误信息。"
  ],
  [
    "technical-architecture",
    "모듈의 책임과 의존성 방향을 그린 뒤 공개 계약을 정하고 예외 및 실패 시나리오를 테스트로 확인합니다.",
    "Map module responsibilities and dependency boundaries; test the public contract and failure paths.",
    "モジュール責任と依存関係を整理し、公開契約と失敗経路をテストします。",
    "梳理模块职责和依赖边界，测试公开契约及失败路径。"
  ],
  [
    "web-delivery",
    "정적 또는 런타임 렌더링을 제품에 맞춰 선택하고 실제 공개 URL에서 빌드 결과와 자산 경로를 확인합니다.",
    "Choose rendering appropriate to the product and verify build assets on the actual public URL.",
    "製品に合う描画方式を選び、公開 URL でビルドと資産を確認します。",
    "选择合适的渲染方式，并在实际公开 URL 验证构建与资源。"
  ],
  [
    "motion-implementation",
    "상태와 애니메이션을 분리하고 최신 입력을 우선 처리합니다. 오프스크린, 중단, 모션 감소 조건을 검증합니다.",
    "Separate committed state from motion; verify interruption, offscreen pause and reduced motion.",
    "状態と動きを分離し、中断、画面外停止、低モーションを確認します。",
    "分离实际状态和动效，验证中断、离屏暂停与减少动效。"
  ],
  [
    "visual-clarity",
    "실제 화면을 넓은 해상도와 좁은 해상도에서 비교해 제목, 여백, 컨트롤의 위치와 불필요한 장식을 검토합니다.",
    "Compare real desktop and narrow renders for hierarchy, alignment and unnecessary decoration.",
    "広い画面と狭い画面を比較し、階層、配置、不要な装飾を確認します。",
    "比较桌面与窄屏效果，检查层级、对齐和多余装饰。"
  ],
  [
    "accessibility",
    "키보드만으로 핵심 작업을 완료하고, 접근 가능한 이름·포커스·대비·320px 리플로우를 실제 화면에서 확인합니다.",
    "Complete the main task with keyboard only and check names, focus, contrast and reflow.",
    "キーボードだけで主要操作を完了し、名前、フォーカス、対比、リフローを確認します。",
    "仅用键盘完成核心任务，检查名称、焦点、对比和重排。"
  ],
  [
    "copyright-licensing",
    "이미지, 글꼴, 코드 의존성의 출처와 라이선스를 목록화하고 배포에 필요한 고지 및 사용 조건을 검토합니다.",
    "Inventory sources and licenses of assets and dependencies, and retain required notices.",
    "素材と依存関係の出典・ライセンスを一覧化し、必要な表示を確認します。",
    "列出素材和依赖的来源与许可，保留必要声明。"
  ],
  [
    "security-privacy",
    "공개 범위와 데이터 흐름을 확인하고 최소 권한, 민감 정보 제외, 안전한 오류 처리를 검토합니다.",
    "Review data flow, least privilege, sensitive-data exclusion and safe error behavior.",
    "データの流れ、最小権限、機密情報の除外と安全なエラー処理を確認します。",
    "检查数据流、最小权限、敏感数据排除与安全错误处理。"
  ],
  [
    "sharing-distribution",
    "공개 공유 URL, 메타데이터와 미리보기 이미지를 준비하고 실제 경로가 열리는지 확인합니다.",
    "Prepare public share URLs, metadata and previews and verify their actual destinations.",
    "共有 URL、メタデータ、プレビューを準備し、実際の公開先を確認します。",
    "准备公开分享 URL、元数据和预览，并验证实际目标。"
  ],
  [
    "discoverability",
    "문서 탐색 구조와 검색용 메타데이터를 정하고 공개 사이트맵, 색인 허용 범위 및 링크를 확인합니다.",
    "Organize documentation navigation and verify metadata, sitemap and index scope.",
    "文書の導線を整理し、メタデータ、サイトマップ、索引範囲を確認します。",
    "组织文档导航，检查元数据、站点地图和索引范围。"
  ],
  [
    "service-operations",
    "실제로 필요한 상태·오류·비용 지표를 선택하고 장애 대응과 복구 방법을 문서화합니다.",
    "Choose meaningful health, error and cost signals, then document recovery.",
    "必要な稼働・エラー・コスト指標を選び、復旧方法を記録します。",
    "选择有意义的健康、错误与成本指标并记录恢复方法。"
  ],
  [
    "internationalization",
    "언어별 문구와 실제 경로를 확인하고 지원되는 줄바꿈 엔진과 글꼴을 사용해 좁고 넓은 화면을 검증합니다.",
    "Verify localized copy and routes, then test supported text wrapping and fonts at narrow and wide widths.",
    "言語別文言と経路を確認し、折り返しと字体を広い画面・狭い画面で検証します。",
    "检查本地化文案和路径，并在宽窄屏验证换行与字体。"
  ],
  [
    "monetization",
    "가격과 비용의 관계를 검토하고 사용자가 실제 결제 전 총액과 해지 조건을 알 수 있도록 설계합니다.",
    "Review pricing and costs and make totals and cancellation conditions clear before payment.",
    "価格と費用を検討し、支払い前に総額と解約条件を明確にします。",
    "评估定价和成本，确保付款前明确总额和取消条件。"
  ],
  [
    "platform-delivery",
    "대상 플랫폼의 지원 버전과 배포 제약을 확인하고 설치, 업데이트, 실패 시 복구를 실제 환경에서 검증합니다.",
    "Check platform constraints and verify installation, update and recovery in the target environment.",
    "対象環境で配布制約、インストール、更新、復旧を確認します。",
    "检查平台分发约束，并验证安装、更新和恢复。"
  ],
  [
    "git-workflow",
    "이슈를 작업 브랜치 및 PR에 연결하고 현재 커밋의 CI를 확인한 뒤 저장소의 병합 정책을 따릅니다.",
    "Connect an issue to its branch and PR, then verify current-head CI and the merge policy.",
    "Issue とブランチ、PR を連携し、最新 CI とマージ規則を確認します。",
    "连接问题、分支与 PR，验证当前 CI 和合并规则。"
  ],
  [
    "code-review-collaboration",
    "지적마다 실제 코드와 테스트를 비교해 반영하거나 반영하지 않는 이유를 원래 스레드에 기록하고 확인합니다.",
    "Compare findings with source and tests, record the disposition in the original thread, and verify it.",
    "指摘をコードとテストで確認し、対応や不採用理由を元のスレッドに記録します。",
    "结合代码和测试验证意见，在原线程记录修复或不采纳原因。"
  ],
  [
    "quality-assurance",
    "핵심 기능과 이전에 실패했던 동작을 회귀 테스트로 실행하고 실제 화면, 접근성, 실패 조건을 기록합니다.",
    "Run regressions for the core behavior and known failures, and record rendered and accessibility evidence.",
    "主要機能と既知の不具合を回帰テストし、画面とアクセシビリティの根拠を記録します。",
    "执行核心行为和已知故障的回归测试，记录画面与无障碍证据。"
  ],
  [
    "release-management",
    "릴리스 범위, 호환성, 변경 기록과 승인된 리비전을 확인하고 배포 후 실제 공개 결과를 검증합니다.",
    "Verify release scope, compatibility, notes and approved revision; confirm the deployed result.",
    "公開範囲、互換性、変更記録、承認済みリビジョンを確認し、公開結果を検証します。",
    "检查发布范围、兼容性、说明与获批修订，验证实际结果。"
  ],
  [
    "product-marketing",
    "제품이 해결하는 문제를 실제 화면과 사용 예제로 설명하고 방문자가 첫 행동을 쉽게 선택하게 합니다.",
    "Explain the real problem with actual product evidence and make the first action clear.",
    "実際の製品と例で解決する課題を示し、最初の行動を明確にします。",
    "用真实产品和示例说明问题，并明确首次操作。"
  ],
  [
    "product-growth",
    "관찰된 피드백에서 가설을 만들고 작은 개선의 성공 기준을 정한 뒤 결과를 비교합니다.",
    "Turn observed feedback into a small hypothesis with measurable success criteria.",
    "観察した意見から小さな仮説と測定可能な成功基準を作ります。",
    "根据观察到的反馈制定小型假设和可衡量成功标准。"
  ],
  [
    "community-management",
    "기여 요청에 필요한 맥락과 범위를 명확히 제안하고 재현 가능한 이슈와 존중하는 응답을 남깁니다.",
    "Clarify contribution scope and leave reproducible issues and respectful responses.",
    "貢献範囲を明確にし、再現可能な Issue と敬意ある応答を維持します。",
    "明确贡献范围，维护可复现问题和尊重的反馈。"
  ]
];
export const guideFor = (id: string, locale: Locale) => { const row = rows.find(item => item[0]===id); return row?.[locale==='ko'?1:locale==='ja'?3:locale==='zh-CN'?4:2] ?? ''; };
export const skillStages = [
  {
    "id": "planning",
    "ko": "기획",
    "en": "Planning",
    "ja": "企画",
    "zh-CN": "规划",
    "skills": [
      "product-planning",
      "product-marketing"
    ]
  },
  {
    "id": "design",
    "ko": "디자인",
    "en": "Design",
    "ja": "デザイン",
    "zh-CN": "设计",
    "skills": [
      "ux-design",
      "brand-design",
      "motion-design",
      "motion-content-transition",
      "motion-entrance-reveal",
      "motion-layout-transition",
      "motion-microinteraction",
      "motion-feedback"
    ]
  },
  {
    "id": "engineering",
    "ko": "구현",
    "en": "Build",
    "ja": "実装",
    "zh-CN": "实现",
    "skills": [
      "technical-architecture",
      "web-delivery",
      "motion-implementation",
      "developer-documentation",
      "internationalization"
    ]
  },
  {
    "id": "quality",
    "ko": "검증",
    "en": "Verify",
    "ja": "検証",
    "zh-CN": "验证",
    "skills": [
      "visual-clarity",
      "accessibility",
      "copyright-licensing",
      "security-privacy",
      "quality-assurance"
    ]
  },
  {
    "id": "review",
    "ko": "리뷰",
    "en": "Review",
    "ja": "レビュー",
    "zh-CN": "审查",
    "skills": [
      "git-workflow",
      "code-review-collaboration"
    ]
  },
  {
    "id": "delivery",
    "ko": "배포",
    "en": "Release",
    "ja": "公開",
    "zh-CN": "发布",
    "skills": [
      "sharing-distribution",
      "discoverability",
      "platform-delivery",
      "release-management"
    ]
  },
  {
    "id": "operations",
    "ko": "운영",
    "en": "Operate",
    "ja": "運用",
    "zh-CN": "运维",
    "skills": [
      "service-operations",
      "monetization",
      "product-growth",
      "community-management"
    ]
  }
];
