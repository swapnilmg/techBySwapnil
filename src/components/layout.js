import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import * as styles from './layout.module.css'

const Layout = ({ pageTitle, children }) => {
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
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <Link to="/" className={styles.siteTitle}>
                    {data.site.siteMetadata.title}
                </Link>
                <p className={styles.tagline}>Distributed systems & scale</p>
                <nav>
                    <ul className={styles.navLinks}>
                        <li>
                            <Link
                                to="/"
                                className={styles.navLink}
                                activeClassName={styles.navLinkActive}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={styles.navLink}
                                activeClassName={styles.navLinkActive}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/blog"
                                className={styles.navLink}
                                activeClassName={styles.navLinkActive}
                                partiallyActive={true}
                            >
                                Blog
                            </Link>
                        </li>
                    </ul>
                </nav>
                <ul className={styles.socialLinks}>
                    <li>
                        <a
                            href="https://www.linkedin.com/in/gaikwadswapnil/"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn profile (opens in new tab)"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </aside>
            <main className={styles.main}>
                <h1 className={styles.heading}>{pageTitle}</h1>
                {children}
            </main>
        </div>
    )
}

export default Layout
