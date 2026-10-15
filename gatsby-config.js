/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: "Swapnil Gaikwad",
    description:
      "Notes on building enterprise AI agents, engineering judgment, code reviews, and distributed systems, written by Swapnil Gaikwad.",
    siteUrl: "https://swapnilgaikwad.me",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      }
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
    {
      // Writes /sitemap-index.xml (and /sitemap-0.xml), referenced from
      // static/robots.txt. The 404 page is excluded so it is never indexed.
      resolve: "gatsby-plugin-sitemap",
      options: {
        excludes: ["/404/", "/404.html", "/dev-404-page/"],
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            title: "Swapnil Gaikwad",
            output: "/rss.xml",
            query: `
              {
                allMdx(sort: { frontmatter: { date: DESC } }) {
                  nodes {
                    excerpt
                    frontmatter {
                      title
                      date
                      slug
                      description
                    }
                  }
                }
              }
            `,
            serialize: ({ query: { site, allMdx } }) =>
              allMdx.nodes.map(node => ({
                title: node.frontmatter.title,
                description: node.frontmatter.description || node.excerpt,
                date: node.frontmatter.date,
                url: `${site.siteMetadata.siteUrl}/blog/${node.frontmatter.slug}/`,
                guid: `${site.siteMetadata.siteUrl}/blog/${node.frontmatter.slug}/`,
              })),
          },
        ],
      },
    },
  ],
}
