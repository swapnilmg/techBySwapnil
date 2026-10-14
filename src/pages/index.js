import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { JsonLd, personSchema } from '../components/structured-data'
import UpcomingActivities from '../components/upcoming-activities'
import * as styles from './index.module.css'

const IndexPage = ({ data }) => {
  return (
    <Layout pageTitle="Notes on building AI for the enterprise">
      <p className={styles.intro}>
        I'm Swapnil Gaikwad, a Senior Software Development Engineer at Amazon,
        building GenAI agents for enterprise workflows. I write about AI agents,
        engineering judgment, code reviews, and the distributed systems
        underneath it all. <Link to="/about">More about me →</Link>
      </p>

      <UpcomingActivities />

      <section aria-labelledby="recent-posts-heading">
        <h2 id="recent-posts-heading" className={styles.sectionHeading}>
          Recent posts
        </h2>
        <ul className={styles.postList}>
          {data.allMdx.nodes.map(node => (
            <li key={node.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>
                <Link to={`/blog/${node.frontmatter.slug}`}>
                  {node.frontmatter.title}
                </Link>
              </h3>
              <p className={styles.postMeta}>{node.frontmatter.date}</p>
              <p className={styles.postExcerpt}>
                {node.frontmatter.description || node.excerpt}
              </p>
            </li>
          ))}
        </ul>
        <Link to="/blog" className={styles.viewAll}>
          View all posts →
        </Link>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }, limit: 3) {
      nodes {
        id
        excerpt(pruneLength: 140)
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
          description
        }
      }
    }
  }
`

export const Head = () => (
  <Seo
    title="Home"
    description="Tech by Swapnil: notes on building enterprise AI agents, engineering judgment, code reviews, and distributed systems, by Swapnil Gaikwad."
    canonical="/"
  >
    <JsonLd data={personSchema()} />
  </Seo>
)

export default IndexPage
