require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Crucian Carp',
    description: 'This website is for posting articles about software engineering, politics and economy',
    author: '@aaronryu',
    deployBranch: process.env.NOW_GITHUB_COMMIT_REF,
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
