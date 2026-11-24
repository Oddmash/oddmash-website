import type { Locale } from './content';

export const ecosystemCopy = {
  en: { title: 'Developer workflow', intro: 'Reusable guidance and specialized review agents support the tools we build.', skillsLink: 'Explore Oddmash Skills on GitHub', skills: 'Reusable guidance for planning, design, engineering, quality and release.', agents: 'Specialized advisory agents coordinate evidence-based reviews; maintainers retain release decisions.', agentDocs: 'Agent documentation' },
  ko: { title: '개발 워크플로 도구', intro: '재사용 가능한 작업 지침과 전문 검토 에이전트로 개발을 지원합니다.', skillsLink: 'GitHub에서 Oddmash Skills 살펴보기', skills: '기획, 디자인, 구현, 품질 검증, 릴리스를 위한 재사용 가능한 작업 지침입니다.', agents: '전문 에이전트들이 근거 기반 검토를 지원하며 배포 결정은 유지보수 담당자가 내립니다.', agentDocs: '에이전트 문서' },
  ja: { title: '開発ワークフローのツール', intro: '再利用可能なガイドと専門レビューエージェントで開発を支援します。', skillsLink: 'GitHubでOddmash Skillsを見る', skills: '企画、デザイン、実装、品質検証、リリースのための再利用可能なガイドです。', agents: '専門エージェントが根拠に基づくレビューを支援し、公開の判断はメンテナーが行います。', agentDocs: 'エージェントのドキュメント' },
  'zh-CN': { title: '开发工作流工具', intro: '可复用的工作指南和专业审查代理支持我们的开发过程。', skillsLink: '在 GitHub 上查看 Oddmash Skills', skills: '用于规划、设计、工程、质量验证和发布的可复用工作指南。', agents: '专业代理协助基于证据的审查，发布决策由维护者负责。', agentDocs: '代理文档' },
} satisfies Record<Locale, { title: string; intro: string; skillsLink: string; skills: string; agents: string; agentDocs: string }>;
