import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const Seo = ({ title, description, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <title>{title} | {data.site.siteMetadata.title}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </>
  )
}

export default Seo