import * as React from 'react'
import * as styles from './theme-toggle.module.css'

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState(null)

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'light')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      window.localStorage.setItem('theme', next)
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) - theme just won't persist
    }
  }

  // Avoid rendering an icon that could mismatch the theme gatsby-ssr.js
  // already applied, until we've read it back on mount.
  if (!theme) {
    return <span className={styles.placeholder} aria-hidden="true" />
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
