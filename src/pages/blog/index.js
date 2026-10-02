import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import * as styles from './blog.module.css'

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <ul className={styles.postList}>
        {data.allMdx.nodes.map(node => {
          const readingTime = node.frontmatter.reading_time || node.timeToRead
          return (
            <li key={node.id} className={styles.postItem}>
              <h2 className={styles.postTitle}>
                <Link to={`/blog/${node.frontmatter.slug}`}>
                  {node.frontmatter.title}
                </Link>
              </h2>
              <p className={styles.postMeta}>
                Posted: {node.frontmatter.date}
                {readingTime ? ` · ${readingTime} min read` : ''}
              </p>
              {node.frontmatter.tags && node.frontmatter.tags.length > 0 && (
                <ul className={styles.tagList}>
                  {node.frontmatter.tags.map(tag => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC }}) {
      nodes {
        timeToRead
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
          tags
          reading_time
        }
        id
      }
    }
  }
`

export const Head = () => (
  <Seo
    title="My Blog Posts"
    description="Posts on engineering judgment, code reviews, distributed systems, and GenAI agents."
    canonical="/blog/"
  />
)

export default BlogPage
