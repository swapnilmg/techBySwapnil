import * as React from 'react'

/**
 * schema.org structured data (JSON-LD) for search engines.
 *
 * `PERSON` describes the site author. It is used on its own on the home and
 * About pages, and as the `author` of every BlogPosting. Keep it limited to
 * facts already public on the site or the linked profiles.
 */
const SITE_URL = 'https://swapnilgaikwad.me'

export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Swapnil Gaikwad',
  url: `${SITE_URL}/`,
  jobTitle: 'Senior Software Development Engineer',
  worksFor: { '@type': 'Organization', name: 'Amazon' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'San Jose State University' },
  knowsAbout: ['Enterprise AI', 'GenAI agents', 'Agentic AI', 'Distributed systems', 'Payments platforms'],
  sameAs: [
    'https://www.linkedin.com/in/gaikwadswapnil/',
    'https://github.com/swapnilmg',
    'https://dev.to/swapnilmg',
    'https://orcid.org/0009-0008-2914-782X',
  ],
}

export const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    // JSON.stringify output is safe here except for a literal "</script>",
    // which this escapes so content can never close the tag early.
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)

export const personSchema = () => ({
  '@context': 'https://schema.org',
  ...PERSON,
})

export const blogPostingSchema = ({ title, description, url, datePublished, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description,
  url,
  mainEntityOfPage: url,
  datePublished,
  ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
  author: PERSON,
  publisher: { '@id': PERSON['@id'] },
})
