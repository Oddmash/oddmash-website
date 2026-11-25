import type { Locale, ProjectId } from './content';

type ProjectStory = {
  title: string;
  problem: string;
  steps: readonly [readonly [string, string], readonly [string, string], readonly [string, string]];
  outcome: readonly [string, string];
  scope: readonly [string, string];
};

export const projectStory: Record<Locale, Record<ProjectId, ProjectStory>> = {
  en: {
    juliya: {
      title: 'Let the sentence shape the line.',
      problem: 'A headline can look balanced on a desktop and awkward on a phone. Character counts and fixed breaks ignore the actual font, available width and rules of each language. Juliya considers those together instead of asking you to maintain a different line break for every screen.',
      steps: [
        ['Read the context', 'Determine whether the text is Korean, English, Japanese or Simplified Chinese, then measure the space in which it will be displayed.'],
        ['Choose break points', 'Apply language-specific boundaries and prefer balanced lines within the measured width. Recalculate when the container or font changes.'],
        ['Keep the original content', 'Preserve explicit line breaks and nested inline markup, including emphasis and links. Only the presentation of the text changes.'],
      ],
      outcome: ['Readable typography across layouts', 'A product localized into four languages can use the same headings and paragraphs at narrow and wide screen sizes instead of inserting manual breaks for each translation.'],
      scope: ['Where it fits', 'React, Next.js, Vue, Svelte and plain HTML are supported. The rules are heuristic rather than a full language analysis, and are best suited to headings and short passages. The live comparison below demonstrates actual wrapping.'],
    },
    'oddmash-ui': {
      title: 'Build a consistent interface without starting over.',
      problem: 'Small developer tools often need the same forms, dialogs, navigation and feedback. Implementing each one separately repeats styling and interaction work, and makes focus behavior and visual states inconsistent between products.',
      steps: [
        ['Compose a screen', 'Choose shared React controls for the job, from inputs and buttons to overlays, navigation and feedback. Products keep their own information hierarchy.'],
        ['Apply a theme', 'Use semantic JSON tokens for color, typography, spacing and motion. Light and dark themes can cover the whole app or a single subtree.'],
        ['Deliver consistent behavior', 'Components provide reusable keyboard interaction, focus handling and visual state patterns. The documentation and Interaction Lab show how the pieces work together.'],
      ],
      outcome: ['One foundation, different products', 'A settings screen and a debugging panel can use matching forms, focus states and feedback while keeping entirely different layouts. Designers and developers work from the same semantics.'],
      scope: ['Where it fits', 'Oddmash UI is a React component and token foundation, not a prebuilt dashboard or a product template. It is under active pre-1.0 development, and the consuming product still owns its layout, accessibility verification and business logic.'],
    },
    'interaction-inspector': {
      title: 'Understand the interaction behind the interface.',
      problem: 'A button can work with a mouse but lose focus when activated with the keyboard. Finding out what happened often requires switching between console output, DOM state and accessibility inspection. Interaction Inspector brings that evidence together on the page.',
      steps: [
        ['Select the element', 'Open the Chrome extension and identify the control to inspect. Its current focus, focus-visible, tabindex category and selected ARIA states appear in the panel.'],
        ['Reproduce the behavior', 'Interact with the page normally and examine up to 200 recent trusted click, keydown and focus events. Narrow the timeline by event type or selected element.'],
        ['Share focused evidence', 'Compare the recorded events with visible focus and the ARIA state, then copy a Markdown report containing the inspected state and filtered timeline.'],
      ],
      outcome: ['A more useful bug report', 'When a disclosure opens but focus or aria-expanded does not match the visible behavior, a developer receives concrete evidence of the interaction instead of only a screenshot or a general description.'],
      scope: ['Where it fits', 'This is a focused debugging extension, not an analytics or persistent recording tool. Sessions stay in page memory and clear on navigation, panel close or reset. It inspects the top-level document and does not record key values, input text or passwords.'],
    },
    boundra: {
      title: 'Keep architectural decisions true as the codebase grows.',
      problem: 'A domain-first TypeScript project can become tangled when client code imports a server implementation or one domain reaches into another domain’s private files. A diagram or team convention alone cannot detect every violation as changes accumulate.',
      steps: [
        ['Declare the boundary', 'Describe domains, public entry points and allowed dependencies in manifests. Client, shared and server layers have explicit import rules.'],
        ['Check changes', 'The Rust-powered CLI analyzes imports and reports boundary violations. Run it alongside existing type checks and tests before changes merge.'],
        ['Validate at runtime', 'Schema-backed TypeScript query, mutation and route contracts validate inputs and results when calls execute. The existing host owns transport, routing and authentication.'],
      ],
      outcome: ['Changes that respect the architecture', 'Billing can call the order domain through its declared public API without depending on order internals. A forbidden import becomes an actionable diagnostic during development or CI instead of an unnoticed architectural change.'],
      scope: ['Where it fits', 'Boundra complements existing TypeScript, Next.js, Vite and backend tooling. It checks declared boundaries and runtime contracts; it is not a replacement framework, a runtime isolation mechanism or a production security control.'],
    },
  },
  ko: {
    juliya: {
      title: '문장과 화면에 맞는 줄바꿈.',
      problem: '데스크톱에서 보기 좋았던 제목도 모바일에서는 어색하게 끊길 수 있습니다. 글자 수나 강제 개행만으로는 실제 글꼴과 화면 폭, 언어별 줄바꿈 규칙을 모두 고려하기 어렵습니다. 줄이야는 화면이 바뀔 때마다 문장을 다시 편집하는 문제를 줄입니다.',
      steps: [
        ['언어와 화면을 확인합니다', '한국어, 영어, 일본어, 중국어 간체 중 텍스트에 맞는 언어를 선택하고 문장이 렌더링될 실제 공간의 너비를 측정합니다.'],
        ['자연스러운 경계를 찾습니다', '언어마다 다른 줄바꿈 가능한 위치를 고려해 제한된 너비 안에서 균형 있는 줄을 만듭니다. 컨테이너나 글꼴이 바뀌면 다시 계산합니다.'],
        ['원래 콘텐츠를 유지합니다', '문장 안의 강조와 링크, 중첩된 인라인 마크업과 명시적인 개행을 보존합니다. 콘텐츠를 바꾸지 않고 화면에 읽히는 형태를 개선합니다.'],
      ],
      outcome: ['화면마다 문장을 따로 편집하지 않아도 됩니다', '여러 언어로 제공하는 제품에서 같은 제목과 짧은 설명을 좁은 화면과 넓은 화면에 자연스럽게 보여줄 수 있습니다. 문장마다 수동으로 개행을 지정하는 작업을 줄입니다.'],
      scope: ['이런 곳에 적합합니다', 'React, Next.js, Vue, Svelte와 일반 HTML에서 사용할 수 있습니다. 언어 규칙은 휴리스틱 기반이므로 모든 문장을 완벽하게 분석하는 것은 아니며 제목과 짧은 글에 적합합니다. 아래 비교에서 실제 줄바꿈을 직접 확인할 수 있습니다.'],
    },
    'oddmash-ui': {
      title: '같은 UI를 매번 다시 만들 필요가 없습니다.',
      problem: '작은 개발 도구에도 설정 폼과 대화 상자, 내비게이션과 피드백이 필요합니다. 프로젝트마다 이 요소들을 처음부터 구현하면 스타일 작업이 반복되고 키보드 포커스나 조작 상태가 제품마다 달라질 수 있습니다.',
      steps: [
        ['필요한 컴포넌트를 조합합니다', '입력, 버튼, 오버레이, 탐색과 피드백을 담당하는 공용 React 컴포넌트를 사용합니다. 화면 구성과 정보의 우선순위는 제품이 결정합니다.'],
        ['제품에 맞는 테마를 적용합니다', '색상, 타이포그래피, 여백, 모션을 의미 기반 JSON 디자인 토큰으로 관리합니다. 전체 앱이나 특정 UI 영역에 라이트·다크 테마를 적용할 수 있습니다.'],
        ['일관된 조작 경험을 제공합니다', '키보드 조작과 포커스 처리, 시각적인 상태를 공통 패턴으로 제공합니다. 문서와 Interaction Lab에서 여러 컴포넌트가 결합된 결과를 확인할 수 있습니다.'],
      ],
      outcome: ['하나의 기반으로 서로 다른 제품을 만듭니다', '설정 화면과 디버깅 패널은 서로 다른 레이아웃을 갖더라도 입력 방식, 포커스, 피드백에서 일관성을 유지할 수 있습니다. 개발자와 디자이너도 같은 기준으로 작업할 수 있습니다.'],
      scope: ['이런 곳에 적합합니다', 'Oddmash UI는 공용 React 컴포넌트와 토큰을 제공하는 기반이며 완성된 대시보드나 제품 템플릿이 아닙니다. 1.0 이전 개발 단계에서 발전하고 있으며 제품별 레이아웃과 접근성 검증, 비즈니스 로직은 사용하는 프로젝트가 담당합니다.'],
    },
    'interaction-inspector': {
      title: '화면에 보이는 현상 너머의 상호작용을 확인합니다.',
      problem: '마우스로는 잘 열리는 버튼이 키보드로 조작할 때 포커스를 잃기도 합니다. 원인을 파악하려면 콘솔, DOM 상태와 접근성 검사 화면을 오가야 할 수 있습니다. Interaction Inspector는 필요한 상호작용의 근거를 디버깅 중인 페이지에 모읍니다.',
      steps: [
        ['검사할 요소를 선택합니다', 'Chrome 확장 프로그램을 열고 확인하려는 컨트롤을 선택합니다. 현재 포커스와 focus-visible, tabindex 범주, 선택된 ARIA 상태를 패널에서 확인합니다.'],
        ['문제를 재현합니다', '평소처럼 조작하면서 최근 신뢰된 클릭, 키보드, 포커스 이벤트 최대 200개를 타임라인으로 살펴봅니다. 이벤트 종류나 선택 요소를 기준으로 좁혀 볼 수 있습니다.'],
        ['근거를 공유합니다', '기록된 이벤트와 시각적인 포커스, ARIA 상태를 비교한 뒤 검사 상태와 필터링한 타임라인을 Markdown 보고서로 복사합니다.'],
      ],
      outcome: ['재현에 필요한 정보를 갖춘 버그 보고서', '펼침 버튼을 눌렀는데 포커스 위치나 aria-expanded 값이 실제 화면과 일치하지 않는다면 개발자는 스크린샷이나 추상적인 설명뿐만 아니라 문제의 구체적인 조작 근거를 전달받을 수 있습니다.'],
      scope: ['이런 곳에 적합합니다', '특정 상호작용을 조사하는 디버깅 확장 프로그램이며 분석 서비스나 상시 기록 도구가 아닙니다. 세션은 페이지 메모리에만 남고 이동, 패널 종료, 초기화 시 삭제됩니다. 최상위 문서를 검사하며 입력값, 키의 값, 비밀번호를 기록하지 않습니다.'],
    },
    boundra: {
      title: '코드가 늘어나도 설계한 경계를 지킵니다.',
      problem: '도메인 중심으로 설계한 TypeScript 프로젝트에서도 클라이언트가 서버 구현을 가져오거나 한 도메인이 다른 도메인의 내부 파일을 참조하면 구조가 복잡해집니다. 다이어그램과 팀 규칙만으로는 변경이 쌓이는 동안 모든 위반을 찾아내기 어렵습니다.',
      steps: [
        ['아키텍처 경계를 정의합니다', '매니페스트에 도메인과 공개 진입점, 허용할 의존 관계를 선언합니다. 클라이언트, 공유, 서버 계층의 import 규칙도 명확히 지정합니다.'],
        ['코드 변경을 검사합니다', 'Rust 기반 CLI가 import 관계를 분석하여 경계 위반을 진단합니다. 기존 타입 검사와 애플리케이션 테스트에 더해 병합 전에 사용할 수 있습니다.'],
        ['실행 시 계약을 검증합니다', '스키마 기반 TypeScript 쿼리, 뮤테이션, 라우트 계약이 호출의 입력과 결과를 검증합니다. 전송 방식과 라우팅, 인증은 기존 호스트가 담당합니다.'],
      ],
      outcome: ['설계 의도에 맞는 변경', '결제 도메인이 선언된 주문 도메인의 공개 API를 이용하고 내부 구현에 의존하지 않도록 관리할 수 있습니다. 금지된 import는 개발과 CI에서 확인 가능한 진단으로 나타납니다.'],
      scope: ['이런 곳에 적합합니다', '기존 TypeScript, Next.js, Vite와 백엔드 도구를 유지하면서 설계 규칙을 검사하는 데 적합합니다. Boundra는 선언된 경계와 런타임 계약을 검사하며 프레임워크나 실행 환경의 격리, 운영 보안 체계를 대체하지 않습니다.'],
    },
  },
  ja: {
    juliya: {
      title: '文章と画面に合わせた改行。',
      problem: 'デスクトップで読みやすい見出しでも、スマートフォンでは不自然な位置で折り返すことがあります。文字数や固定改行だけでは、実際の書体、表示幅、言語ごとの改行規則を考慮できません。Juliya は画面ごとに文章を調整する手間を減らします。',
      steps: [
        ['言語と表示幅を確認', '韓国語、英語、日本語、簡体字中国語から対象の言語を選び、テキストが表示される実際の領域を測定します。'],
        ['適切な改行位置を選ぶ', '言語ごとの改行境界を使い、測定した幅に収まる行のバランスを考えます。コンテナや書体が変われば再計算します。'],
        ['元の内容を保つ', '強調やリンクなどの入れ子のインラインマークアップと、明示的な改行を維持します。内容ではなく表示方法を調整します。'],
      ],
      outcome: ['画面が変わっても読みやすく', '四つの言語で展開する製品でも、見出しや短い説明文を狭い画面から広い画面まで利用でき、翻訳ごとの手動改行を減らせます。'],
      scope: ['適した用途', 'React、Next.js、Vue、Svelte、通常の HTML に対応します。言語規則はヒューリスティックに基づくため、完全な自然言語解析ではなく見出しや短文に適しています。下の比較で実際の改行を確認できます。'],
    },
    'oddmash-ui': {
      title: '同じ UI を何度も作り直さない。',
      problem: '小規模な開発ツールにも、フォーム、ダイアログ、ナビゲーション、フィードバックが必要です。製品ごとに一から実装すると、スタイリングが重複し、キーボードの操作やフォーカスの挙動が不統一になりがちです。',
      steps: [
        ['画面に必要な部品を組み合わせる', '入力欄、ボタン、オーバーレイ、ナビゲーション、フィードバックのための共通 React コンポーネントを使います。情報設計は製品側が担当します。'],
        ['製品のテーマを適用', '色、書体、間隔、モーションをセマンティックな JSON トークンで管理し、アプリ全体または特定領域にライト・ダークテーマを適用できます。'],
        ['一貫した操作を提供', 'キーボード操作、フォーカス管理、表示状態の共通パターンを利用できます。ドキュメントと Interaction Lab で部品を組み合わせた動作を確認できます。'],
      ],
      outcome: ['一つの基盤から異なる製品を', '設定画面とデバッグパネルはレイアウトが異なっても、入力、フォーカス、フィードバックを一貫させられます。デザインと開発も同じ基準で進められます。'],
      scope: ['適した用途', 'Oddmash UI は React コンポーネントとデザイントークンの基盤であり、完成済みのダッシュボードや製品テンプレートではありません。1.0 以前の開発段階にあり、レイアウトとアクセシビリティの検証、業務ロジックは製品側が担当します。'],
    },
    'interaction-inspector': {
      title: '画面の裏側で起きた操作を調べる。',
      problem: 'マウスで開くボタンでも、キーボードで操作するとフォーカスが消えることがあります。原因を調べるにはコンソール、DOM、アクセシビリティの情報を行き来する必要があります。Interaction Inspector は操作の根拠をデバッグ中のページに集約します。',
      steps: [
        ['要素を選択', 'Chrome 拡張機能を開き、調べたいコントロールを選びます。現在のフォーカス、focus-visible、tabindex の分類、選択された ARIA 状態が表示されます。'],
        ['操作を再現', '通常の操作を行いながら、信頼されたクリック、キー押下、フォーカスイベントを直近 200 件までタイムラインで確認します。種類や選択要素で絞り込めます。'],
        ['根拠を共有', '記録と表示上のフォーカス、ARIA 状態を比較して、調査状態と絞り込んだタイムラインを Markdown の報告書としてコピーします。'],
      ],
      outcome: ['再現に役立つ不具合報告', '展開ボタンは反応するのにフォーカスや aria-expanded が表示状態と一致しない場合、スクリーンショットだけでなく操作の具体的な証拠を開発者に共有できます。'],
      scope: ['適した用途', '個々の操作の調査を目的とした拡張機能であり、分析サービスや継続的な記録ツールではありません。セッションはページのメモリに保持され、移動、パネルの終了、リセットで消去されます。最上位の文書を対象とし、キーの値や入力値、パスワードは記録しません。'],
    },
    boundra: {
      title: 'コードが増えても設計の境界を守る。',
      problem: 'ドメイン中心の TypeScript プロジェクトでも、クライアントがサーバーの実装を import したり、別ドメインの内部に依存したりすると構造は複雑になります。図面やチームの約束だけでは、変更が増える中で違反をすべて発見することは困難です。',
      steps: [
        ['境界を宣言', 'マニフェストにドメインと公開エントリーポイント、許可する依存関係を記述します。クライアント、共有、サーバー層の import 規則も定めます。'],
        ['変更を検査', 'Rust ベースの CLI が import を解析し、境界に違反する箇所を診断します。既存の型チェックとテストに加えてマージ前に実行できます。'],
        ['実行時の契約を検証', 'スキーマに基づく TypeScript のクエリ、ミューテーション、ルート契約が、呼び出しの入力と結果を検証します。通信、ルーティング、認証はホスト側が担当します。'],
      ],
      outcome: ['設計に沿った変更', '請求ドメインが注文ドメインの宣言済み公開 API にのみ依存するよう管理できます。禁止された import は開発時や CI の診断として確認できます。'],
      scope: ['適した用途', '既存の TypeScript、Next.js、Vite、バックエンドのツールに追加して使えます。宣言された境界と実行時の契約を検証するもので、フレームワーク、実行環境の分離、運用のセキュリティ管理を代替しません。'],
    },
  },
  'zh-CN': {
    juliya: {
      title: '让文字适应语言与屏幕。',
      problem: '在桌面端看起来均衡的标题，在手机上可能会在不自然的位置换行。固定字数或手动换行无法同时考虑实际字体、可用宽度和语言规则。Juliya 减少了为不同屏幕反复调整文案的工作。',
      steps: [
        ['识别语言与显示范围', '选择韩语、英语、日语或简体中文，并测量文字实际显示区域的宽度。'],
        ['选择合适的换行位置', '按照不同语言的换行边界，在实测宽度内平衡各行文字。容器或字体变化时重新计算。'],
        ['保留原始内容', '保留显式换行以及嵌套的行内标记，包括强调和链接。调整的是阅读呈现方式，而不是文字内容。'],
      ],
      outcome: ['不同布局中保持易读', '面向四种语言的产品可以在窄屏和宽屏之间复用标题及短文，减少为每种翻译手动添加换行的工作。'],
      scope: ['适用场景', '支持 React、Next.js、Vue、Svelte 和普通 HTML。语言规则采用启发式方法，不是完整的自然语言分析，适合标题与短文。下方的对比可直接体验实际换行。'],
    },
    'oddmash-ui': {
      title: '不再为每个产品重复构建相同的界面。',
      problem: '小型开发工具也离不开表单、对话框、导航和反馈。每个项目从头实现这些元素，会重复样式开发，也容易让键盘焦点与交互状态变得不一致。',
      steps: [
        ['组合所需的组件', '使用共享 React 组件构建输入、按钮、弹层、导航和反馈。产品仍然负责自身的信息层级和布局。'],
        ['应用产品主题', '通过语义化 JSON 令牌管理颜色、字体、间距和动效。浅色与深色主题可以应用于整个应用或局部区域。'],
        ['提供一致的交互', '复用键盘交互、焦点管理及视觉状态模式。文档与 Interaction Lab 展示多个组件如何协同工作。'],
      ],
      outcome: ['共享基础，保留产品差异', '设置页面与调试面板可以采用完全不同的布局，同时保持输入、焦点和反馈方式一致，使设计与开发遵循相同的语义。'],
      scope: ['适用场景', 'Oddmash UI 是 React 组件与设计令牌的基础，不是现成的仪表盘或产品模板。目前仍处于 1.0 之前的开发阶段，产品自行负责布局、无障碍验证及业务逻辑。'],
    },
    'interaction-inspector': {
      title: '弄清界面变化背后的交互。',
      problem: '鼠标操作正常的按钮，在使用键盘时却可能丢失焦点。为了查明原因，开发者往往需要在控制台、DOM 和无障碍检查之间切换。Interaction Inspector 将相关的交互证据汇总在正在调试的页面内。',
      steps: [
        ['选择目标元素', '打开 Chrome 扩展并选择需要检查的控件。面板会显示当前焦点、focus-visible、tabindex 分类以及选定的 ARIA 状态。'],
        ['复现交互问题', '正常操作页面并查看最近最多 200 条受信任的点击、按键与焦点事件。可以按事件类型或选定元素筛选时间线。'],
        ['共享具体证据', '对照事件记录、可见焦点和 ARIA 状态，再将检查状态与筛选后的时间线复制为 Markdown 报告。'],
      ],
      outcome: ['提供更有用的缺陷报告', '当展开按钮有反应，但焦点或 aria-expanded 与显示状态不符时，开发者可以收到具体的交互证据，而不只是截图和概括描述。'],
      scope: ['适用场景', '这是用于检查单次交互的调试扩展，并非分析服务或持续录制工具。会话留在页面内存中，导航、关闭面板或重置时清除。仅检查顶层文档，不记录按键值、输入值或密码。'],
    },
    boundra: {
      title: '让不断增长的代码遵守原有架构。',
      problem: '采用领域优先架构的 TypeScript 项目也可能因客户端导入服务端实现，或一个领域依赖另一个领域的内部文件而变得复杂。仅依赖架构图和团队约定，很难在持续变化的代码中发现所有违规。',
      steps: [
        ['声明架构边界', '在清单中声明领域、公开入口点与允许的依赖。客户端、共享层和服务端也遵循明确的导入规则。'],
        ['检查代码变更', '基于 Rust 的 CLI 分析导入关系并报告边界违规，可与现有类型检查和测试一起在合并前运行。'],
        ['验证运行时契约', '基于模式的 TypeScript 查询、变更和路由契约在调用时验证输入与结果。传输、路由和身份验证由现有宿主负责。'],
      ],
      outcome: ['变更符合架构设计', '通过已声明的公开 API，账单领域可以调用订单领域，而不依赖其内部实现。不允许的导入会在开发和 CI 中成为可处理的诊断。'],
      scope: ['适用场景', '可以与原有 TypeScript、Next.js、Vite 和后端工具一起使用。Boundra 检查已声明的边界和运行时契约，不替代应用框架、运行时隔离或生产环境安全控制。'],
    },
  },
};
