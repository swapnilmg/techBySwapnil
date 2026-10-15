import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { JsonLd, personSchema } from '../components/structured-data'
import * as styles from './about.module.css'

// Data structures
const experiences = [
  {
    company: "Amazon",
    title: "Senior Software Development Engineer",
    period: "2020 — Present",
    description: [
      "Technical leader driving architectural vision for Amazon Currency Converter for Sellers (ACCS), leading cross-functional initiatives that rearchitected and expanded the product across international markets",
      "Leading a GenAI agent-based initiative for enterprise accounting onboarding, using narrow, bounded agents and designed-in human checkpoints to compress a process of up to six months toward three weeks",
      "Architected and delivered a generic monetization framework supporting end-to-end fee lifecycle, establishing technical standards that reduced launch times by 83% and KTLO costs by 64%",
      "Led system architecture redesign for ACCS payment product enabling rapid international expansion, reducing time to market by 80% through scalable, reusable design patterns",
      "Provide technical leadership and mentorship across 3 teams with 18 engineers and 3 managers, fostering engineering excellence and developing 7 engineers to next-level roles"
    ],
    technologies: ["Generative AI", "Java", "AWS", "Spring Boot", "DynamoDB", "PostgreSQL"]
  },
  {
    company: "NASA Ames Research Center",
    title: "Senior Research Associate",
    period: "2017 — 2020",
    description: [
      "Architected and built live tracking software for Tailored Arrival Manager (TAM), designing simulation capabilities for 10+ maneuvers and conflict avoidance features",
      "Developed secure and scalable autonomous trajectory-based solution for tailored arrival management, establishing architectural patterns for real-time aviation systems",
      "Designed and implemented high-velocity data integration architecture enabling seamless collaboration with Boeing and FAA stakeholders"
    ],
    technologies: ["Java", "JUnit", "ActiveMQ", "WebSockets", "Spring Boot", "Machine Learning"]
  },
  {
    company: "Comptel (Nokia Networks)",
    title: "Solution Specialist",
    period: "2015 — 2016",
    description: [
      "Designed and implemented highly scalable services for integrating billing and CRM systems with network devices",
      "Led solution meetings with multiple stakeholders and supervised three software engineers",
      "Developed solutions using Java, REST web services, Oracle DB, and Linux"
    ],
    technologies: ["Java", "REST", "Oracle DB", "Linux", "IBM AIX"]
  },
  {
    company: "Amdocs",
    title: "Advanced Software Engineer",
    period: "2011 — 2015",
    description: [
      "Led cross-functional discussions as SME for 4G provisioning projects and developed network orchestration",
      "Achieved zero-defect integration of two high-volume, high-velocity heterogeneous network systems in 4 months",
      "Successfully upgraded provisioning systems for more than 40 million customers"
    ],
    technologies: ["Java", "Network Provisioning", "System Integration"]
  }
]

const publications = [
  {
    title: "Agentic AI for Autonomous Decision Systems",
    venue: "CISCom 2026 (Second International Conference on Computational Intelligence and Soft Computing), Track 15, Paper ID 37",
    date: null,
    status: "In Press",
    url: null,
    description: "Co-authored with Rajkumar Kuppuswami (primary), Swapnil Gaikwad, and others. Camera-ready version in progress."
  },
  {
    title: "Data Structure for Efficient Line of Sight Queries",
    venue: "CIKM 2018",
    date: "October 2018",
    url: "/papers/2018-cikm-large-scale-optimization-wireless-emergency-networks.pdf",
    description: "Develops and compares methods for fast line-of-sight queries over large-scale 3D city data to support wireless network planning."
  },
  {
    title: "Optimal Constrained Wireless Emergency Network Antenna Placement",
    venue: "IEEE",
    date: "May 2017",
    url: "/papers/2017-optimal-constrained-wireless-emergency-network-antenna-placement.pdf",
    description: "Communication is paramount during emergencies. This research proposes a framework for identifying optimal placement of wireless network antennas within a city, given multiple criteria constraints."
  }
]

const skills = [
  {
    category: "AI Applications",
    skills: ["GenAI Agents", "Agentic Workflows", "Human-in-the-Loop Design", "Agent Evaluation", "Prompt & Context Engineering"]
  },
  {
    category: "Architecture & Leadership",
    skills: ["Distributed Systems", "System Design", "Technical Strategy", "Cross-Team Leadership", "Mentorship"]
  },
  {
    category: "Programming Languages",
    skills: ["Java", "JavaScript", "Python", "TypeScript"]
  },
  {
    category: "Platforms & Tools",
    skills: ["AWS", "GCP", "Docker", "DynamoDB", "PostgreSQL", "Spring", "Guice"]
  },
  {
    category: "Web Technologies",
    skills: ["React.js", "Express.js", "Node.js", "Gatsby", "Google Maps API"]
  }
]

const focusAreas = [
  {
    title: "Enterprise AI agents",
    description: "GenAI agents for judgment-heavy business workflows, with human checkpoints designed in rather than bolted on."
  },
  {
    title: "Payments & monetization platforms",
    description: "Large-scale distributed systems for payments and fees, built to launch fast and stay reliable."
  },
  {
    title: "Research & community",
    description: "Published work on optimization and agentic AI, plus conference talks, committees, and hackathon judging."
  }
]

const AboutPage = ({ data }) => {
  const writingPosts = data.allDevToArticle.nodes
  return (
    <Layout pageTitle="About Me">
      <>
      {/* Bio Section */}
      <section className={styles.section} aria-labelledby="bio-heading">
        <h2 id="bio-heading" className={styles.srOnly}>About</h2>
        <p className={styles.lead}>
          I'm Swapnil Gaikwad, a Senior Software Development Engineer at Amazon. I build AI
          applications for the enterprise: GenAI agents that take on judgment-heavy business
          workflows, running on the kind of large-scale payment and monetization systems I've
          spent years designing and leading.
        </p>

        <h3 id="focus-heading" className={styles.focusHeading}>What I work on</h3>
        <ul className={styles.focusGrid} aria-labelledby="focus-heading">
          {focusAreas.map(area => (
            <li key={area.title} className={styles.focusCard}>
              <h4 className={styles.focusTitle}>{area.title}</h4>
              <p className={styles.focusDescription}>{area.description}</p>
            </li>
          ))}
        </ul>

        <div className={styles.bio}>
          <p>
            I'm the technical lead for Amazon Currency Converter for Sellers (ACCS), a global payments
            and monetization platform. My current focus is a GenAI agent-based initiative for enterprise
            accounting onboarding, a process that can take up to six months. Instead of one large agent,
            it uses narrow, bounded agents and deliberately placed human checkpoints, aiming to bring
            that time down toward three weeks. The idea behind it applies well beyond accounting: map
            where the judgment in a workflow actually lives, automate around it, and keep people where
            a wrong call is expensive to undo.
          </p>
          <p>
            The thread goes back further. At NASA Ames Research Center I built software for the
            Tailored Arrival Manager, an autonomous, trajectory-based air traffic system developed with
            Boeing and the FAA. My Master's research in Computer Science at San Jose State University,
            on large-scale optimization for emergency wireless networks, led to papers at IEEE and ACM
            CIKM, and I recently co-authored <em>Agentic AI for Autonomous Decision Systems</em> (CISCom 2026).
          </p>
          <p>
            I believe the only way to build fast is to build right, so I care as much about the
            architecture, evaluation, and review practices around an AI system as about the model inside
            it. Beyond my day job, I write about engineering judgment and GenAI agents, speak and serve on
            committees at technical conferences, judge hackathons, and mentor engineers. Away from the
            keyboard, you'll usually find me outdoors.
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section className={styles.section} aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        {experiences.map((experience, index) => (
          <div key={index} className={styles.experienceItem}>
            <div className={styles.experienceHeader}>
              <div>
                <div className={styles.company}>{experience.company}</div>
                <div className={styles.title}>{experience.title}</div>
              </div>
              <div className={styles.period}>{experience.period}</div>
            </div>
            <ul className={styles.description}>
              {experience.description.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Publications Section */}
      <section className={styles.section} aria-labelledby="publications-heading">
        <h2 id="publications-heading">Publications</h2>
        {publications.map((publication, index) => (
          <div key={index} className={styles.publicationItem}>
            <div className={styles.publicationTitleRow}>
              {publication.url ? (
                <a
                  href={publication.url}
                  className={styles.publicationTitle}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${publication.title} (opens in new tab)`}
                >
                  {publication.title}
                </a>
              ) : (
                <span className={styles.publicationTitle}>{publication.title}</span>
              )}
              {publication.status && (
                <span className={styles.statusBadge}>{publication.status}</span>
              )}
            </div>
            <div className={styles.publicationMeta}>
              {publication.venue}{publication.date ? ` • ${publication.date}` : ''}
            </div>
            <p className={styles.publicationDescription}>
              {publication.description}
            </p>
          </div>
        ))}
      </section>

      {/* Writing Section */}
      {writingPosts.length > 0 && (
        <section className={styles.section} aria-labelledby="writing-heading">
          <h2 id="writing-heading">Writing</h2>
          <ul className={styles.writingList}>
            {writingPosts.map(post => (
              <li key={post.id} className={styles.writingItem}>
                <a
                  href={post.url}
                  className={styles.writingTitle}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${post.title} (opens in new tab on Dev.to)`}
                >
                  {post.title}
                </a>
                <div className={styles.publicationMeta}>{post.publishedAt}</div>
                {post.tags.length > 0 && (
                  <div className={styles.writingTags}>
                    {post.tags.map(tag => (
                      <span key={tag} className={styles.writingTag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills Section */}
      <section className={styles.section} aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <div className={styles.skillsGrid}>
          {skills.map((skillGroup, index) => (
            <div key={index}>
              <h3 className={styles.skillCategory}>{skillGroup.category}</h3>
              <ul className={styles.skillList}>
                {skillGroup.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="connect" className={styles.section} aria-labelledby="connect-heading">
        <h2 id="connect-heading">Connect</h2>
        <div className={styles.contactLinks}>
          <a 
            href="https://www.linkedin.com/in/gaikwadswapnil/" 
            className={styles.contactLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
          >
            <svg className={styles.linkIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </section>
      </>
    </Layout>
  )
}

export const query = graphql`
  query {
    allDevToArticle(sort: { publishedAt: DESC }, limit: 6) {
      nodes {
        id
        title
        url
        publishedAt(formatString: "MMMM D, YYYY")
        tags
      }
    }
  }
`

export const Head = () => (
  <Seo
    title="About Me"
    description="Swapnil Gaikwad is a Senior Software Development Engineer at Amazon, building enterprise GenAI agents on large-scale payment and monetization systems."
    canonical="/about/"
  >
    <JsonLd data={personSchema()} />
  </Seo>
)

export default AboutPage
