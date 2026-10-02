const fs = require('fs')

const WORDS_PER_MINUTE = 200

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

    type MdxFrontmatter {
      tags: [String!]
      description: String
      reading_time: Int
      canonical_url: String
      original_url: String
      hero_image_alt: String
      hero_image_credit_text: String
      hero_image_credit_link: String
    }
  `)
}

/**
 * Reading time for MDX posts, so the templates do not depend on every post
 * carrying a hand-written `reading_time` in its frontmatter. A frontmatter
 * value still wins when present (see the blog templates).
 *
 * @type {import('gatsby').GatsbyNode['createResolvers']}
 */
exports.createResolvers = ({ createResolvers, reporter }) => {
  createResolvers({
    Mdx: {
      timeToRead: {
        type: 'Int',
        resolve(source) {
          const filePath = source.internal && source.internal.contentFilePath
          if (!filePath) return null
          let raw
          try {
            raw = fs.readFileSync(filePath, 'utf8')
          } catch (error) {
            reporter.warn(`Could not read ${filePath} for reading time: ${error.message}`)
            return null
          }
          // Drop the frontmatter block before counting words.
          const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
          const words = body.split(/\s+/).filter(Boolean).length
          return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
        },
      },
    },
  })
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
