export const sectionMap = {
  categories: {
    title: "Categories",
    shorten: {
      ko: "카테고리",
      en: "Categories",
      ja: "カテゴリー",
    },
    description: {
      ko: "원하는 글을 쉽게 찾을 수 있게 도움을 드립니다",
      en: "Helping you find the posts\nyou want easily",
      ja: "ご希望の記事を容易に\n見つけるお手伝いをします",
    },
    url: "/categories",
  },
  posts: {
    title: "Posts",
    shorten: {
      ko: "글",
      en: "Posts",
      ja: "投稿",
    },
    description: {
      ko: "다양한 주제의 글들을 게시해놓았습니다",
      en: "A collection of posts\non various topics",
      ja: "様々なトピックの\n記事を掲載しています",
    },
    url: "/posts",
  },
  // Posts 세부 카테고리
  politics: {
    title: "Politics",
    shorten: {
      ko: "정치·사회",
      en: "Politics & Society",
      ja: "政治・社会",
    },
    description: {
      ko: "이상적인 사회는 어떤 모습일지 이를 위해선\n 어떤 법과 문화가 필요한지 고민합니다",
      en: "Reflecting on an ideal society\nand the laws/culture it needs",
      ja: "理想的な社会の姿と、そのために\n必要な法や文化を考えます",
    },
    url: "/posts/politics",
  },
  leadership: {
    title: "Leadership",
    shorten: {
      ko: "조직·리더",
      en: "Organization & Leader",
      ja: "組織・リーダー",
    },
    description: {
      ko: "성공을 위해 리더는 어떤 자질을 갖추어야하는가\n 조직은 어때야하는가를 고민합니다",
      en: "What qualities a leader needs\nand how an organization should be",
      ja: "成功のためにリーダーの資質と\n組織の在り方を考えます",
    },
    url: "/posts/leadership",
  },
  economy: {
    title: "Economy",
    shorten: {
      ko: "경제·자본",
      en: "Economy & Capital",
      ja: "経済・資本",
    },
    description: {
      ko: "다양한 경제적 주체 사이에서 돈이 어떻게 흐르는지를 이해합니다",
      en: "Understanding how money flows\namong economic agents",
      ja: "様々な経済主体の間で\nお金の流れを理解します",
    },
    url: "/posts/economy",
  },
  education: {
    title: "Education",
    shorten: {
      ko: "교육·학습",
      en: "Education & Learning",
      ja: "教育・学習",
    },
    description: {
      ko: "어떻게, 어떤것들을 교육해야할까 같은 고민이나\n 학생들에 갖는 생각들을 나열합니다",
      en: "Thoughts on what to teach\nand reflections on students",
      ja: "何をどう教育すべきかという悩みや\n学生への思いを綴ります",
    },
    url: "/posts/education",
  },
  engineering: {
    title: "Engineering",
    shorten: {
      ko: "기술·개발",
      en: "Tech & Dev",
      ja: "技術・開発",
    },
    description: {
      ko: "웹 프론트엔드 및 백엔드 개발에 관련된 내용들을 주로 다룹니다",
      en: "Focusing on web frontend\nand backend development",
      ja: "ウェブフロントエンドと\nバックエンド開発を扱います",
    },
    url: "/posts/engineering",
  },
  opinion: {
    title: "Opinion",
    shorten: {
      ko: "사유·개인",
      en: "Opinion & Personal",
      ja: "思索・個人",
    },
    description: {
      ko: "그 외 넓고 다양한 주제에 대해 제 작은 생각들을 나열합니다",
      en: "Listing my personal thoughts\non a wide range of topics",
      ja: "その他、広く多様な主題について\n私の考えを綴ります",
    },
    url: "/posts/opinion",
  },
  // Hobby
  hobby: {
    title: "Hobby",
    shorten: {
      ko: "취미",
      en: "Hobby",
      ja: "趣味",
    },
    description: {
      ko: "공부 외적으로 제가 즐기고 좋아했던것들에 대해 나열해봅니다",
      en: "Listing things I enjoy and love\noutside of my studies",
      ja: "勉強以外で私が楽しみ、\n好きだったことを並べてみます",
    },
    url: "/hobby",
  },
  // Thoughts
  thoughts: {
    title: "Thoughts",
    shorten: {
      ko: "짧은 생각들",
      en: "Short Thoughts",
      ja: "短い考え",
    },
    description: {
      ko: "버스안에서나 산책할때, 가만히 있을때 등\n 문득 드는 짧은 생각들을 메모합니다",
      en: "Notes on thoughts that come to mind\nwhile walking or resting",
      ja: "バスの中や散歩中など、\nふと浮かぶ考えをメモします",
    },
    url: "/thoughts",
  },
  // About
  about: {
    title: "About",
    shorten: {
      ko: "블로그를 만든 주인에 대해",
      en: "About Author",
      ja: "筆者紹介",
    },
    description: {
      ko: "블로그를 만든 주인은 어떤 사람인지 간략하게 설명합니다",
      en: "A brief introduction to the person behind this blog",
      ja: "このブログの作者がどのような人物か、簡潔に説明します",
    },
    url: "/about",
  },
  // 블로그 주인 관련된 외부 링크
  facebook: {
    title: "Facebook",
    shorten: {
      ko: "페이스북",
      en: "Facebook",
      ja: "Facebook",
    },
    description: {
      ko: "블로그 주인의 다양한 생각들을 짧은 글들로 알 수 있는 페이스북",
      en: "Author's various thoughts\nshared in short Facebook posts",
      ja: "筆者の様々な考えを\n短文で伝えるFacebook",
    },
    url: "https://www.facebook.com/chungmo.ryu",
  },
  linkedin: {
    title: "LinkedIn",
    shorten: {
      ko: "링크드인",
      en: "LinkedIn",
      ja: "LinkedIn",
    },
    description: {
      ko: "블로그 주인의 업무활동이나 업무에 대한 생각들을 알 수 있는 링크드인",
      en: "LinkedIn showcasing work\nactivities and professional views",
      ja: "筆者の業務活動や\n仕事への考えを伝えるLinkedIn",
    },
    url: "https://www.linkedin.com/in/aaron-ryu/",
  },
  twitter: {
    title: "X - Twitter",
    shorten: {
      ko: "트위터",
      en: "Twitter",
      ja: "Twitter",
    },
    description: {
      ko: "블로그 주인의 취미활동 등을 알 수 있는 트위터",
      en: "Twitter showcasing the author's\nhobbies and activities",
      ja: "筆者の趣味活動などを\n知ることができるTwitter",
    },
    url: "https://x.com/aaronryudev",
  },
};
