import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { conferences, hackathons } from '../data/activities'
import * as styles from './activities.module.css'

const fullDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

const parseEventDate = date => {
  if (typeof date !== 'string') {
    return null
  }

  const match = date.match(fullDatePattern)
  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const timestamp = Date.UTC(year, month - 1, day)
  const parsedDate = new Date(timestamp)

  if (
    year === 0 ||
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null
  }

  return timestamp
}

const sortNewestFirst = (first, second) => {
  const firstDate =
    parseEventDate(first.date?.start) ?? Number.NEGATIVE_INFINITY
  const secondDate =
    parseEventDate(second.date?.start) ?? Number.NEGATIVE_INFINITY

  return firstDate === secondDate ? 0 : secondDate - firstDate
}

const MediaDialog = ({ media, onClose, triggerRef }) => {
  const dialogRef = React.useRef(null)
  const closeButtonRef = React.useRef(null)

  React.useEffect(() => {
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [onClose, triggerRef])

  return (
    <div className={styles.dialogBackdrop}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-dialog-title"
        ref={dialogRef}
      >
        <div className={styles.dialogHeader}>
          <h2 id="media-dialog-title" className={styles.dialogTitle}>
            {media.alt}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close enlarged image"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={styles.dialogImageFrame}>
          <img className={styles.dialogImage} src={media.src} alt={media.alt} />
        </div>
        <a
          className={styles.originalLink}
          href={media.src}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open original in a new tab
        </a>
      </div>
    </div>
  )
}

const ImageThumbnail = ({ media, label, onOpen }) => (
  <button
    type="button"
    className={styles.thumbnailButton}
    onClick={event => onOpen(media, event.currentTarget)}
    aria-label={`${label}: ${media.alt}. Enlarge image`}
  >
    <img
      className={`${styles.thumbnailImage} ${
        media.fit === 'contain' ? styles.thumbnailContain : ''
      }`}
      src={media.thumbnail || media.src}
      alt=""
      loading="lazy"
      decoding="async"
    />
    <span className={styles.mediaBadge} aria-hidden="true">
      Enlarge
    </span>
  </button>
)

const PdfCertificate = ({ certificate }) => (
  <a
    className={styles.pdfCertificate}
    href={certificate.src}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Open ${certificate.alt} (PDF opens in a new tab)`}
  >
    {certificate.thumbnail ? (
      <img
        className={`${styles.thumbnailImage} ${
          certificate.fit === 'contain' ? styles.thumbnailContain : ''
        }`}
        src={certificate.thumbnail}
        alt=""
        loading="lazy"
        decoding="async"
      />
    ) : (
      <span className={styles.pdfIcon} aria-hidden="true">
        PDF
      </span>
    )}
    <span className={styles.mediaBadge} aria-hidden="true">
      PDF ↗
    </span>
  </a>
)

const RoleMedia = ({ role, onOpen }) => {
  const photos = role.photos || []
  const certificates = role.certificates || []

  if (photos.length === 0 && certificates.length === 0) {
    return null
  }

  return (
    <div className={styles.roleMedia}>
      {photos.map(photo => (
        <ImageThumbnail
          key={photo.src}
          media={photo}
          label="Photo"
          onOpen={onOpen}
        />
      ))}
      {certificates.map(certificate =>
        certificate.type === 'pdf' ? (
          <PdfCertificate key={certificate.src} certificate={certificate} />
        ) : (
          <ImageThumbnail
            key={certificate.src}
            media={certificate}
            label="Certificate"
            onOpen={onOpen}
          />
        )
      )}
    </div>
  )
}

const ActivitiesPage = () => {
  const [activeMedia, setActiveMedia] = React.useState(null)
  const triggerRef = React.useRef(null)
  const sortedConferences = [...conferences].sort(sortNewestFirst)
  const sortedHackathons = [...hackathons].sort(sortNewestFirst)

  const openMedia = (media, trigger) => {
    triggerRef.current = trigger
    setActiveMedia(media)
  }

  const closeMedia = React.useCallback(() => {
    setActiveMedia(null)
  }, [])

  return (
    <Layout pageTitle="Activities">
      <p className={styles.intro}>
        Professional conference service, advising, invited speaking, and
        hackathon judging.
      </p>

      <section
        className={styles.activitySection}
        aria-labelledby="conferences-heading"
      >
        <h2 id="conferences-heading" className={styles.sectionHeading}>
          Conferences
        </h2>

        <div className={styles.conferenceList}>
          {sortedConferences.map(conference => {
            const meta = [conference.date?.label, conference.location].filter(
              Boolean
            )

            return (
              <article key={conference.id} className={styles.conferenceCard}>
                <header className={styles.conferenceHeader}>
                  <h3 className={styles.conferenceName}>
                    {conference.shortName || conference.name}
                  </h3>
                  {conference.shortName && (
                    <p className={styles.conferenceFullName}>
                      {conference.name}
                    </p>
                  )}
                  {meta.length > 0 && (
                    <p className={styles.conferenceMeta}>
                      <span>{meta.join(' · ')}</span>
                      {conference.url && (
                        <a
                          className={styles.conferenceLink}
                          href={conference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Conference website
                          <span aria-hidden="true"> ↗</span>
                          <span className={styles.srOnly}>
                            {' '}
                            (opens in a new tab)
                          </span>
                        </a>
                      )}
                    </p>
                  )}
                  {conference.description && (
                    <p className={styles.conferenceDescription}>
                      {conference.description}
                    </p>
                  )}
                  {conference.url && meta.length === 0 && (
                    <a
                      className={styles.conferenceLink}
                      href={conference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Conference website
                      <span aria-hidden="true"> ↗</span>
                      <span className={styles.srOnly}>
                        {' '}
                        (opens in a new tab)
                      </span>
                    </a>
                  )}
                </header>

                <div className={styles.roleList}>
                  {(conference.roles || []).map(role => (
                    <section
                      key={`${conference.id}-${role.title}`}
                      className={styles.role}
                    >
                      <h4 className={styles.roleTitle}>{role.title}</h4>
                      {role.url && (
                        <a
                          className={styles.roleLink}
                          href={role.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View listing
                          <span aria-hidden="true"> ↗</span>
                          <span className={styles.srOnly}>
                            {' '}
                            (opens in a new tab)
                          </span>
                        </a>
                      )}
                      <RoleMedia role={role} onOpen={openMedia} />
                    </section>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section
        className={styles.activitySection}
        aria-labelledby="hackathons-heading"
      >
        <h2 id="hackathons-heading" className={styles.sectionHeading}>
          Hackathon judging
        </h2>

        <div className={styles.hackathonGrid}>
          {sortedHackathons.map(hackathon => {
            const meta = [hackathon.date?.label, hackathon.format].filter(
              Boolean
            )

            return (
              <article key={hackathon.id} className={styles.hackathonCard}>
                <header>
                  <div className={styles.hackathonTitleLine}>
                    <h3 className={styles.hackathonName}>{hackathon.name}</h3>
                    {hackathon.edition && (
                      <span className={styles.hackathonEdition}>
                        {hackathon.edition}
                      </span>
                    )}
                  </div>
                  {meta.length > 0 && (
                    <p className={styles.hackathonMeta}>{meta.join(' · ')}</p>
                  )}
                  {hackathon.description && (
                    <p className={styles.hackathonDescription}>
                      {hackathon.description}
                    </p>
                  )}
                </header>

                <div className={styles.hackathonActivity}>
                  <div className={styles.hackathonRoleLine}>
                    <strong className={styles.hackathonRole}>
                      {hackathon.role.title}
                    </strong>
                    {hackathon.url && (
                      <a
                        className={styles.hackathonLink}
                        href={hackathon.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {hackathon.linkLabel || 'Website'}
                        <span aria-hidden="true"> ↗</span>
                        <span className={styles.srOnly}>
                          {' '}
                          (opens in a new tab)
                        </span>
                      </a>
                    )}
                  </div>
                  <RoleMedia role={hackathon.role} onOpen={openMedia} />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {activeMedia && (
        <MediaDialog
          media={activeMedia}
          onClose={closeMedia}
          triggerRef={triggerRef}
        />
      )}
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Activities"
    description="Professional conference service, advising, invited speaking, and hackathon judging activities by Swapnil Gaikwad."
    canonical="/activities/"
  />
)

export default ActivitiesPage
