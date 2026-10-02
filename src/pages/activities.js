import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import conferences from '../data/activities'
import * as styles from './activities.module.css'

const fullDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

const parseConferenceDate = date => {
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
    parseConferenceDate(first.date?.start) ?? Number.NEGATIVE_INFINITY
  const secondDate =
    parseConferenceDate(second.date?.start) ?? Number.NEGATIVE_INFINITY

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
      className={styles.thumbnailImage}
      src={media.thumbnail || media.src}
      alt={media.alt}
      loading="lazy"
      decoding="async"
    />
    <span className={styles.thumbnailAction}>Enlarge</span>
  </button>
)

const PdfCertificate = ({ certificate }) => (
  <a
    className={styles.pdfCertificate}
    href={certificate.src}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${certificate.alt} (PDF opens in a new tab)`}
  >
    {certificate.thumbnail ? (
      <img
        className={styles.thumbnailImage}
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
    <span className={styles.thumbnailAction}>Open PDF</span>
  </a>
)

const RoleMedia = ({ conferenceId, role, roleIndex, onOpen }) => {
  const photos = role.photos || []
  const certificates = role.certificates || []

  if (photos.length === 0 && certificates.length === 0) {
    return null
  }

  const sectionId = `${conferenceId}-role-${roleIndex}`

  return (
    <div className={styles.mediaSections}>
      {photos.length > 0 && (
        <section aria-labelledby={`${sectionId}-photos`}>
          <h4 id={`${sectionId}-photos`} className={styles.mediaHeading}>
            Photos
          </h4>
          <div className={styles.mediaGrid}>
            {photos.map(photo => (
              <ImageThumbnail
                key={photo.src}
                media={photo}
                label="Photo"
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section aria-labelledby={`${sectionId}-certificates`}>
          <h4 id={`${sectionId}-certificates`} className={styles.mediaHeading}>
            Certificates
          </h4>
          <div className={styles.mediaGrid}>
            {certificates.map(certificate =>
              certificate.type === 'pdf' ? (
                <PdfCertificate
                  key={certificate.src}
                  certificate={certificate}
                />
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
        </section>
      )}
    </div>
  )
}

const ActivitiesPage = () => {
  const [activeMedia, setActiveMedia] = React.useState(null)
  const triggerRef = React.useRef(null)
  const sortedConferences = [...conferences].sort(sortNewestFirst)

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
        Professional conference service, advising, and invited speaking.
      </p>

      <div className={styles.conferenceList}>
        {sortedConferences.map(conference => {
          const meta = [conference.date?.label, conference.location].filter(
            Boolean
          )

          return (
            <article key={conference.id} className={styles.conferenceCard}>
              <header className={styles.conferenceHeader}>
                <h2 className={styles.conferenceName}>{conference.name}</h2>
                {meta.length > 0 && (
                  <p className={styles.conferenceMeta}>{meta.join(' · ')}</p>
                )}
                {conference.description && (
                  <p className={styles.conferenceDescription}>
                    {conference.description}
                  </p>
                )}
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
              </header>

              <div className={styles.roleList}>
                {(conference.roles || []).map((role, roleIndex) => (
                  <section
                    key={`${conference.id}-${role.title}`}
                    className={styles.role}
                  >
                    <h3 className={styles.roleTitle}>{role.title}</h3>
                    {role.url && (
                      <a
                        className={styles.roleLink}
                        href={role.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View role listing
                        <span aria-hidden="true"> ↗</span>
                        <span className={styles.srOnly}>
                          {' '}
                          (opens in a new tab)
                        </span>
                      </a>
                    )}
                    <RoleMedia
                      conferenceId={conference.id}
                      role={role}
                      roleIndex={roleIndex}
                      onOpen={openMedia}
                    />
                  </section>
                ))}
              </div>
            </article>
          )
        })}
      </div>

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
    description="Professional conference service, advising, and invited speaking activities by Swapnil Gaikwad."
    canonical="/activities/"
  />
)

export default ActivitiesPage
