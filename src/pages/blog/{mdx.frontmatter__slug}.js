import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import Callout from '../../components/callout'
import * as styles from './blog.module.css'

// Components available to every MDX post without an import in the content file.
const shortcodes = { Callout }

const BlogPost = ({ data, children }) => {
  const { frontmatter, timeToRead } = data.mdx
  const image = getImage(frontmatter.hero_image)
  const readingTime = frontmatter.reading_time || timeToRead
  const hasCredit = Boolean(frontmatter.hero_image_credit_text)

  return (
    <Layout pageTitle={frontmatter.title}>
      <p className={styles.postDate}>
        {frontmatter.date}
        {readingTime ? ` · ${readingTime} min read` : ''}
      </p>
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <ul className={styles.tagList}>
          {frontmatter.tags.map(tag => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      {image && (
        <>
          <div className={styles.heroImage}>
            <GatsbyImage image={image} alt={frontmatter.hero_image_alt || ''} />
          </div>
          {hasCredit && (
            <p className={styles.photoCredit}>
              Photo Credit:{" "}
              <a href={frontmatter.hero_image_credit_link}>
                {frontmatter.hero_image_credit_text}
              </a>
            </p>
          )}
        </>
      )}
      <div className="mdxContent">
        <MDXProvider components={shortcodes}>{children}</MDXProvider>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String) {
    mdx(id: {eq: $id}) {
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
        description
        tags
        reading_time
        canonical_url
        hero_image_alt
        hero_image_credit_link
        hero_image_credit_text
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
          publicURL
        }
      }
    }
  }
`

export const Head = ({ data }) => {
  const { frontmatter } = data.mdx
  return (
    <Seo
      title={frontmatter.title}
      description={frontmatter.description}
      // Posts are canonical here by default; dev.to cross-posts should point back.
      canonical={frontmatter.canonical_url || `/blog/${frontmatter.slug}/`}
      image={frontmatter.hero_image && frontmatter.hero_image.publicURL}
      imageAlt={frontmatter.hero_image_alt}
    />
  )
}

export default BlogPost
