require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Crucian Carp',
    description: 'This website is for posting articles about software engineering, politics and economy',
    author: '@aaronryu',
    deployBranch: process.env.NOW_GITHUB_COMMIT_REF,
    linkGithub: 'https://github.com/aaronryu',
    linkFacebook: 'https://www.facebook.com/chungmo.ryu',
    linkTwitter: 'https://twitter.com/AaronRyu_',
  },
  plugins: [
    'gatsby-plugin-dark-mode',
    {
      resolve: "gatsby-source-contentful",
      options: {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
      },
    },
    {
      resolve: 'gatsby-plugin-react-helmet-canonical-urls',
      options: {
        siteUrl: process.env.SITE_URL,
      },
    },
    'gatsby-plugin-sitemap',
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    // {
    //   resolve: 'gatsby-plugin-gtag',
    //   options: {
    //     trackingId: process.env.GA_TRACKING_ID,
    //     head: true,
    //   },
    // },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `aaron.ryu`,
        short_name: `aaron`,
        start_url: `/`,
        background_color: `#2b2836`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#2b2836`,
        display: `minimal-ui`,
        icon: `src/images/aaron-icon-lined-static.svg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`${__dirname}/src/components/layout.tsx`),
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        // defaultLayouts: {
        //   // File System 별 name 에 따라 이렇게 default 달리 설정해줄수있나봄
        //   blog: require.resolve(`${__dirname}/src/components/layout.tsx`),
        //   default: require.resolve(`${__dirname}/src/components/layout.tsx`),
        // },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-code-titles',
            options: {
              className: 'your-custom-class-name',
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              className: 'anchor-header', // 이 class명으로 현재 어떤 헤더의 글에 있는지에 따른 하이라이팅 구현
              maintainCase: false, // 이 부분은 반드시 false로 하자. url이 대소문자를 구분하기 때문에 링크가 작동하지 않을 수 있다.
              removeAccents: true,
              elements: ['h1', 'h2', 'h3', 'h4'], // 링크를 추가할 Header 종류 선택
              // h2, h3 등에 CSS 'scroll-margin-top: 5rem;' 을 주입하여 링크 클릭하여 스크롤 이동 시 위에 헤더랑 어느 정도 거리를 두게끔 한다. (헤더에 가려지는것 방지)
            },
          },
          // { resolve: 'gatsby-remark-images' },
          {
            resolve: 'gatsby-remark-prismjs',
          },
        ],
        // plugins: [{ resolve: 'gatsby-remark-images' }],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/blog`,
      },
    },
  ],
}
