import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'

const NotFoundPage = () => (
  <Layout pageTitle="Page not found">
    <p>
      That page doesn't exist, or it has moved. Try the <Link to="/blog/">blog</Link>,
      or head back to the <Link to="/">home page</Link>.
    </p>
  </Layout>
)

export const Head = () => (
  <Seo title="Page not found" description="This page could not be found.">
    <meta name="robots" content="noindex" />
  </Seo>
)

export default NotFoundPage
