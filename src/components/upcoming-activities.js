import * as React from 'react'
import { Link } from 'gatsby'
import activities from '../data/activities'
import * as styles from './upcoming-activities.module.css'

const fullDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

const toUtcDay = date => {
  if (typeof date !== 'string') {
    return null
  }
  const match = date.match(fullDatePattern)
  if (!match) {
    return null
  }
  const [, year, month, day] = match.map(Number)
  return Date.UTC(year, month - 1, day)
}

const todayUtc = () => {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

// An activity is upcoming until its last day has passed. Entries whose dates
// haven't been announced yet set `date.pending: true` and stay listed until
// real dates are filled in.
const getUpcoming = (list, today) =>
  list
    .map(activity => {
      const start = toUtcDay(activity.date?.start)
      const end = toUtcDay(activity.date?.end) ?? start
      return { activity, start, end }
    })
    .filter(
      ({ activity, end }) =>
        activity.date?.pending || (end !== null && end >= today)
    )
    .sort((a, b) => {
      // Soonest first; entries without announced dates go last.
      if (a.activity.date?.pending !== b.activity.date?.pending) {
        return a.activity.date?.pending ? 1 : -1
      }
      return (a.start ?? 0) - (b.start ?? 0)
    })
    .map(({ activity }) => activity)

const siteDomain = url => {
  try {
    return new URL(url).hostname
  } catch (e) {
    return null
  }
}

const Logo = ({ logo, url, title }) => {
  const [tier, setTier] = React.useState(0)
  const domain = siteDomain(url)
  const sources = [
    logo,
    domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null
  ].filter(Boolean)
  const src = sources[tier]

  // If every image source fails, show the event's initial rather than an
  // empty tile.
  if (!src) {
    return (
      <span
        className={`${styles.logoFrame} ${styles.logoInitial}`}
        aria-hidden="true"
      >
        {(title || '?').charAt(0)}
      </span>
    )
  }

  return (
    <span className={styles.logoFrame} aria-hidden="true">
      <img
        className={styles.logo}
        src={src}
        alt=""
        loading="lazy"
        onError={() => setTier(current => current + 1)}
      />
    </span>
  )
}

const MAX_ITEMS = 4

const UpcomingActivities = () => {
  // The site is statically built, so "today" can't be computed the same way
  // on the server and in the client's first render (the server's build-time
  // "now" and the visitor's real "now" are different instants) - doing so
  // caused a hydration mismatch that could leave a stale, build-time list on
  // screen. Render nothing until mounted, matching null on both the server
  // and the client's first render; the effect then sets the visitor's real
  // date and triggers an ordinary client-side re-render.
  const [today, setToday] = React.useState(null)

  React.useEffect(() => {
    setToday(todayUtc())
  }, [])

  if (today === null) {
    return null
  }

  const upcoming = getUpcoming(activities, today).slice(0, MAX_ITEMS)

  if (upcoming.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="upcoming-activities-heading"
      className={styles.section}
    >
      <h2 id="upcoming-activities-heading" className={styles.heading}>
        Upcoming
      </h2>
      <ul className={styles.list}>
        {upcoming.map(activity => {
          const typeLabel =
            activity.type === 'hackathon' ? 'Hackathon' : 'Conference'
          const where = activity.location || activity.format
          const title = activity.shortName
            ? activity.shortName
            : [activity.name, activity.edition].filter(Boolean).join(' ')

          return (
            <li key={activity.id} className={styles.item}>
              <Logo logo={activity.logo} url={activity.url} title={title} />
              <div className={styles.body}>
                <p className={styles.meta}>
                  <span className={styles.date}>
                    {activity.date?.label}
                  </span>
                  <span className={styles.dot} aria-hidden="true">
                    ·
                  </span>
                  <span>{typeLabel}</span>
                  {where && (
                    <>
                      <span className={styles.dot} aria-hidden="true">
                        ·
                      </span>
                      <span>{where}</span>
                    </>
                  )}
                </p>
                <h3 className={styles.title}>
                  {activity.url ? (
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {title}
                      <span className={styles.srOnly}>
                        {' '}
                        (opens in a new tab)
                      </span>
                    </a>
                  ) : (
                    title
                  )}
                </h3>
                <ul className={styles.roles} aria-label="Roles">
                  {(activity.roles || []).map(role => (
                    <li key={role.title} className={styles.role}>
                      {role.title}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ul>
      <Link to="/activities" className={styles.viewAll}>
        View all activities →
      </Link>
    </section>
  )
}

export default UpcomingActivities
