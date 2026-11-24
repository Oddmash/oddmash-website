import { projects, type Locale, type ProjectId } from './content';

const github = 'https://github.com/Oddmash';

export const organizationContribution = (locale: Locale) =>
  `${github}/.github/blob/main/${locale === 'en' ? 'CONTRIBUTING.md' : `docs/${locale}/CONTRIBUTING.md`}`;

export const projectLinks = (projectId: ProjectId, locale: Locale) => {
  const project = projects.find(item => item.id === projectId)!;
  const contribute = `${project.repo}/issues`;

  if (projectId === 'kowrap') {
    const path = locale === 'ko' ? '' : locale === 'zh-CN' ? 'zh/' : locale + '/';
    const live = 'https://oddmash.github.io/kowrap/' + path;
    return { readme: project.repo, docs: live + 'docs/', contribute, live };
  }

  if (projectId === 'boundra') {
    const readmeSuffix = locale === 'en' ? '' : `.${locale}`;
    const guideSuffix = locale === 'en' ? '' : `.${locale.toLowerCase()}`;
    return {
      readme: `${project.repo}/blob/main/README${readmeSuffix}.md`,
      docs: `${project.repo}/blob/main/docs/user-guide${guideSuffix}.md`,
      contribute,
      live: `https://oddmash.github.io/boundra/docs/user-guide${guideSuffix}/`,
    };
  }

  const readme = `${project.repo}/blob/main/${locale === 'en' ? 'README.md' : `docs/${locale}/README.md`}`;
  return {
    readme,
    docs: readme,
    contribute,
    live: project.live,
  };
};

type Editorial = {
  aboutTitle: string;
  aboutLead: string;
  aboutProjects: string;
  aboutContribution: string;
  contributeAction: string;
  projectExternal: string;
  overview: string;
  exampleHeading: string;
  exampleDescription?: string;
  examples: Record<ProjectId, string>;
};

export const editorial: Record<Locale, Editorial> = {
  en: {
    aboutTitle: 'Better tools for everyday development.',
    aboutLead: 'Oddmash builds open-source developer tools around recurring problems in real projects: readable text, consistent interfaces, inspectable interactions, and clear architectural boundaries.',
    aboutProjects: 'Our projects',
    aboutContribution: 'Found a reproducible bug or a concrete improvement? Visit the relevant repository to report it or discuss a contribution.',
    contributeAction: 'Contribute on GitHub',
    projectExternal: 'Explore on GitHub',
    overview: 'Overview',
    exampleHeading: 'Example in practice',
    examples: {
      kowrap: 'Compare how the Korean sentence “팀의 모든 문서를 한곳에서 관리하세요” wraps at different widths. The pinned comparison uses the earlier Korean engine; the current Juliya product supports multiple languages.',
      'oddmash-ui': 'Build a settings form with shared Button and Input components. Switch between light and dark themes while keeping keyboard focus and visual feedback consistent.',
      'interaction-inspector': 'Select a disclosure button, start recording, then activate it with the keyboard. Compare the event timeline, visible focus, and aria-expanded state before copying a Markdown bug report.',
      boundra: 'Before merging a change to billing and order domains, run pnpm exec boundra check-boundaries --format json. Check that billing imports only the declared public API of order.',
    },
  },
  ko: {
    aboutTitle: '개발의 일상을 더 편하게.',
    aboutLead: 'Oddmash는 실제 프로젝트에서 반복해서 마주치는 문제를 오픈소스로 해결합니다. 읽기 좋은 텍스트, 일관된 UI, 확인 가능한 상호작용, 명확한 아키텍처 경계를 위한 개발 도구를 만듭니다.',
    aboutProjects: '우리가 만드는 도구',
    aboutContribution: '재현 가능한 버그나 구체적인 개선점이 있나요? 해당 프로젝트 저장소에서 문제를 공유하거나 기여를 논의해 주세요.',
    contributeAction: 'GitHub에서 기여하기',
    projectExternal: 'GitHub에서 프로젝트 자세히 보기',
    overview: '개요',
    exampleHeading: '실제 사용 예제',
    examples: {
      kowrap: '“팀의 모든 문서를 한곳에서 관리하세요”라는 한국어 문장이 화면 너비에 따라 어떻게 줄바꿈되는지 비교합니다. 이 사이트에서 사용하는 이전 한국어 엔진의 비교 예제입니다. 현재 Juliya는 여러 언어를 지원합니다.',
      'oddmash-ui': '공용 Button과 Input으로 설정 폼을 구성합니다. 라이트·다크 테마를 바꿔도 키보드 포커스와 조작 피드백이 일관되도록 구현할 수 있습니다.',
      'interaction-inspector': '펼침 버튼을 선택하고 기록을 시작한 뒤 키보드로 조작합니다. 이벤트 타임라인과 시각적 포커스, aria-expanded 상태를 비교한 후 Markdown으로 버그 보고서를 복사합니다.',
      boundra: '결제와 주문 도메인의 변경을 병합하기 전에 pnpm exec boundra check-boundaries --format json을 실행합니다. 결제 도메인이 주문 도메인의 선언된 공개 API만 가져오는지 확인합니다.',
    },
  },
  ja: {
    aboutTitle: '開発の日常を、もっと快適に。',
    aboutLead: 'Oddmash は実際の開発で繰り返し直面する課題に取り組みます。読みやすいテキスト、一貫したUI、確認可能な操作、明確な設計境界のための開発ツールをオープンソースで公開します。',
    aboutProjects: '公開プロジェクト',
    aboutContribution: '再現可能な不具合や具体的な改善案があれば、該当するリポジトリで報告や貢献について相談してください。',
    contributeAction: 'GitHubで貢献する',
    projectExternal: 'GitHubでプロジェクトの詳細を見る',
    overview: '概要',
    exampleHeading: '実際の利用例',
    examples: {
      kowrap: '韓国語の文「팀의 모든 문서를 한곳에서 관리하세요」が画面の幅に応じてどう改行されるかを比較します。このサイトには以前の韓国語エンジンを固定して使用しています。現在の Juliya は複数の言語をサポートします。',
      'oddmash-ui': '共通の Button と Input で設定フォームを作成します。ライトとダークを切り替えても、キーボードフォーカスと操作のフィードバックを一貫させられます。',
      'interaction-inspector': '展開ボタンを選択し、記録を開始してからキーボードで操作します。イベントタイムライン、視覚的なフォーカス、aria-expanded を比較し、Markdown で不具合報告をコピーします。',
      boundra: '請求と注文ドメインの変更を統合する前に pnpm exec boundra check-boundaries --format json を実行します。請求側が注文側の宣言済み公開 API のみを参照することを確認します。',
    },
  },
  'zh-CN': {
    aboutTitle: '让日常开发更轻松。',
    aboutLead: 'Oddmash 聚焦实际开发中反复出现的问题，为易读文本、一致的界面、可检查的交互以及清晰的架构边界打造开源开发工具。',
    aboutProjects: '开源项目',
    aboutContribution: '发现可复现的问题或具体的改进建议？请在对应项目的仓库中报告问题或讨论贡献。',
    contributeAction: '在 GitHub 上贡献',
    projectExternal: '在 GitHub 上查看项目详情',
    overview: '概览',
    exampleHeading: '实际使用示例',
    examples: {
      kowrap: '比较韩语句子“팀의 모든 문서를 한곳에서 관리하세요”在不同屏幕宽度下的换行效果。本网站的对比固定使用旧版韩语引擎。当前 Juliya 支持多种语言。',
      'oddmash-ui': '使用共享的 Button 和 Input 构建设置表单。切换浅色和深色主题时，保持键盘焦点与操作反馈的一致性。',
      'interaction-inspector': '选择展开按钮，开始记录，然后通过键盘操作。比较事件时间线、可见焦点和 aria-expanded 状态，再将问题报告复制为 Markdown。',
      boundra: '合并账单域和订单域的更改前，运行 pnpm exec boundra check-boundaries --format json。检查账单域是否仅依赖订单域已声明的公开 API。',
    },
  },
};
