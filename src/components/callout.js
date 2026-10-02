import * as React from 'react'
import * as styles from './callout.module.css'

const Callout = ({ children }) => (
  <aside className={styles.callout}>{children}</aside>
)

export default Callout
