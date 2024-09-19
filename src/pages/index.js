import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'
import Seo from '../components/seo'

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      <main>
        <p>Site under construction!</p>
        <StaticImage
          alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
          src="https://i.pinimg.com/originals/f4/84/c8/f484c84c96d1258efd45b586e7dda74a.jpg"
        />
      </main>
    </Layout>
  )
}

export const Head = () => <Seo title="Home Page" />

export default IndexPage