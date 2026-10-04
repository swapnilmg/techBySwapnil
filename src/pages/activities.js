import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import activities from '../data/activities'
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

const getActivitySortDate = activity =>
  parseEventDate(activity.date?.end) ?? parseEventDate(activity.date?.start)

const sortActivitiesNewestFirst = activityList =>
  activityList
    .map((activity, index) => ({
      activity,
      index,
      sortDate: getActivitySortDate(activity)
    }))
    .sort((first, second) => {
      if (first.sortDate === null && second.sortDate === null) {
        return first.index - second.index
      }

      if (first.sortDate === null) {
        return 1
      }

      if (second.sortDate === null) {
        return -1
      }

      return second.sortDate - first.sortDate || first.index - second.index
    })
    .map(({ activity }) => activity)

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
  const sortedActivities = sortActivitiesNewestFirst(activities)

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

      <div className={styles.activityList}>
        {sortedActivities.map(activity => {
          const roles = activity.roles || []
          const roleTitles = roles.map(role => role.title)
          const typeLabel =
            activity.type === 'hackathon'
              ? `Hackathon · ${roleTitles.join(' & ')}`
              : 'Conference'
          const meta = [
            activity.date?.label,
            activity.location || activity.format
          ].filter(Boolean)
          const roleListClassName = [
            styles.roleList,
            roles.length === 1 ? styles.roleListSingle : '',
            roles.length === 2 ? styles.roleListTwo : ''
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <article key={activity.id} className={styles.activityCard}>
              <header className={styles.activityHeader}>
                <span className={styles.typeLabel}>{typeLabel}</span>
                <div className={styles.activityTitleLine}>
                  <h2 className={styles.activityName}>
                    {activity.shortName || activity.name}
                  </h2>
                  {!activity.shortName && activity.edition && (
                    <span className={styles.activityEdition}>
                      {activity.edition}
                    </span>
                  )}
                </div>
                {activity.shortName && (
                  <p className={styles.activityFullName}>{activity.name}</p>
                )}
                {meta.length > 0 && (
                  <p className={styles.activityMeta}>
                    <span>{meta.join(' · ')}</span>
                  </p>
                )}
                {(activity.description || activity.url) && (
                  <div className={styles.activityDescriptionRow}>
                    {activity.description && (
                      <p className={styles.activityDescription}>
                        {activity.description}
                      </p>
                    )}
                    {activity.url && (
                      <a
                        className={styles.activityLink}
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {activity.linkLabel || 'Website'}
                        <span aria-hidden="true"> ↗</span>
                        <span className={styles.srOnly}>
                          {' '}
                          (opens in a new tab)
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </header>

              {roles.length > 0 && (
                <div className={roleListClassName}>
                  {roles.map(role => (
                    <section
                      key={`${activity.id}-${role.title}`}
                      className={`${styles.role} ${
                        roles.length === 1 ? styles.roleSingle : ''
                      }`}
                    >
                      <div className={styles.roleDetails}>
                        <h3 className={styles.roleTitle}>{role.title}</h3>
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
                      </div>
                      <RoleMedia role={role} onOpen={openMedia} />
                    </section>
                  ))}
                </div>
              )}
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
    description="Professional conference service, advising, invited speaking, and hackathon judging activities by Swapnil Gaikwad."
    canonical="/activities/"
  />
)

export default ActivitiesPage
