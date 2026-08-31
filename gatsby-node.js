/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type DevToArticle implements Node {
      title: String!
      url: String!
      publishedAt: Date! @dateformat
      tags: [String!]!
    }
  `)
}

/**
 * @type {import('gatsby').GatsbyNode['sourceNodes']}
 */
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions

  let articles
  try {
    const response = await fetch('https://dev.to/api/articles?username=swapnilmg')
    if (!response.ok) {
      reporter.warn(`Dev.to API responded with ${response.status}; skipping Writing section for this build.`)
      return
    }
    articles = await response.json()
  } catch (error) {
    reporter.warn(`Could not fetch Dev.to articles, skipping Writing section for this build: ${error.message}`)
    return
  }

  articles.forEach(article => {
    createNode({
      id: createNodeId(`dev-to-article-${article.id}`),
      title: article.title,
      url: article.url,
      publishedAt: article.published_at,
      tags: article.tag_list,
      internal: {
        type: 'DevToArticle',
        contentDigest: createContentDigest(article),
      },
    })
  })
}
