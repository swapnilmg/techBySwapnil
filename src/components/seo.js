import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

/**
 * Per-page document head.
 *
 * `canonical` and `image` accept either a path (`/blog/foo/`) or an absolute
 * URL; paths are resolved against `siteMetadata.siteUrl` because both
 * `rel=canonical` and `og:image` require absolute URLs.
 *
 * Pages without their own `image` fall back to `static/og-default.png`
 * (1200×630), so every shared link gets a preview card.
 */
const DEFAULT_IMAGE = '/og-default.png'
const DEFAULT_IMAGE_ALT = 'Swapnil Gaikwad: enterprise AI agents, engineering judgment, and the systems underneath'

const Seo = ({ title, description, canonical, image, imageAlt, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `)

  const { title: siteTitle, siteUrl } = data.site.siteMetadata
  const toAbsolute = url =>
    !url || /^https?:\/\//.test(url) ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`

  const canonicalUrl = toAbsolute(canonical)
  const imageUrl = toAbsolute(image || DEFAULT_IMAGE)
  const imageAltText = image ? imageAlt : DEFAULT_IMAGE_ALT
  const fullTitle = `${title} | ${siteTitle}`

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {!image && <meta property="og:image:width" content="1200" />}
      {!image && <meta property="og:image:height" content="630" />}
      {imageAltText && <meta property="og:image:alt" content={imageAltText} />}
      {imageAltText && <meta name="twitter:image:alt" content={imageAltText} />}

      {children}
    </>
  )
}

export default Seo
