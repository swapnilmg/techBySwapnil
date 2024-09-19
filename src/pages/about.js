import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'

const AboutPage = () => {
  return (
    <Layout pageTitle="About Me">
      <p>Senior Software Engineer @ Amazon</p>
    </Layout>
  )
}

// Rest of the component...

export const Head = () => <Seo title="About Me" />

export default AboutPage