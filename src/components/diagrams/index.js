// Diagram design system for blog posts. See "Diagram design system" in
// CLAUDE.md / AGENTS.md for the rules. Every component here is available in
// MDX posts without an import (registered in the post template's shortcodes).
//
// Diagrams are built from real HTML text, not images, so they inherit the
// site's fonts and theme tokens, switch with light/dark mode, reflow on phones,
// and are read by screen readers. Colour is never the only signal: every kind
// also has a shape cue, and a legend appears whenever more than one kind is
// shown.
import * as React from 'react'
import * as styles from './diagrams.module.css'

// The fixed visual vocabulary. Posts give these roles a local meaning through
// the `legend` prop (e.g. focus -> "Judgment-heavy"); they never invent colours.
export const KINDS = ['step', 'focus', 'agent', 'human', 'risk', 'muted']

const DEFAULT_LEGEND = {
  step: 'Step',
  focus: 'Focus',
  agent: 'AI agent',
  human: 'Human decision',
  risk: 'Risk / failure',
  muted: 'Out of scope'
}

const normalizeKind = kind => (KINDS.includes(kind) ? kind : 'step')

const kindClass = kind => styles[`kind_${normalizeKind(kind)}`]

// Shown automatically when a figure uses two or more kinds. Pass
// legend={false} when the labels already carry the meaning (e.g. Bars).
const Legend = ({ kinds, legend }) => {
  const unique = KINDS.filter(kind => kinds.includes(kind))
  if (legend === false || unique.length < 2) {
    return null
  }
  return (
    <ul className={styles.legend} aria-label="Legend">
      {unique.map(kind => (
        <li key={kind} className={styles.legendItem}>
          <span
            className={`${styles.swatch} ${kindClass(kind)}`}
            aria-hidden="true"
          />
          {(legend && legend[kind]) || DEFAULT_LEGEND[kind]}
        </li>
      ))}
    </ul>
  )
}

// Shared frame: every diagram is a <figure> with an optional short title and a
// required caption that states the takeaway in one sentence.
export const Figure = ({ title, caption, children, wide = false }) => (
  <figure className={`${styles.figure} ${wide ? styles.figureWide : ''}`}>
    {title && <p className={styles.figureTitle}>{title}</p>}
    <div className={styles.canvas}>{children}</div>
    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
)

const Node = ({ step, as: Tag = 'div' }) => {
  const kind = normalizeKind(step.kind)
  return (
    <Tag className={`${styles.node} ${kindClass(kind)}`}>
      {step.tag && <span className={styles.nodeTag}>{step.tag}</span>}
      <span className={styles.nodeLabel}>{step.label}</span>
      {step.note && <span className={styles.nodeNote}>{step.note}</span>}
    </Tag>
  )
}

// A left-to-right sequence of steps that stacks vertically on narrow screens.
// steps: [{ label, note?, tag?, kind? }]
export const Flow = ({ title, caption, steps = [], legend, loop }) => {
  const kinds = steps.map(step => normalizeKind(step.kind))
  return (
    <Figure title={title} caption={caption}>
      <ol className={styles.flow}>
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className={styles.flowItem}>
            <Node step={step} />
            {index < steps.length - 1 && (
              <span className={styles.arrow} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      {loop && (
        <p className={styles.loop}>
          <span aria-hidden="true">↺ </span>
          {loop}
        </p>
      )}
      <Legend kinds={kinds} legend={legend} />
    </Figure>
  )
}

// Two options side by side (before/after, rejected/chosen). Each side is a
// short vertical flow plus a one-line verdict.
// left/right: { title, kind?, steps: [{ label, note?, kind? }], verdict? }
const Panel = ({ panel }) => {
  const kind = normalizeKind(panel.kind)
  return (
    <section className={`${styles.panel} ${kindClass(kind)}`}>
      <h4 className={styles.panelTitle}>{panel.title}</h4>
      <ol className={styles.stack}>
        {(panel.steps || []).map((step, index) => (
          <li key={`${step.label}-${index}`} className={styles.stackItem}>
            <Node step={step} />
          </li>
        ))}
      </ol>
      {panel.verdict && (
        <p className={styles.verdict}>
          <span className={styles.verdictMark} aria-hidden="true">
            {kind === 'risk' ? '✕' : kind === 'focus' ? '✓' : '•'}
          </span>
          {panel.verdict}
        </p>
      )}
    </section>
  )
}

export const Compare = ({ title, caption, left, right, legend }) => {
  const kinds = [left, right]
    .filter(Boolean)
    .flatMap(panel => (panel.steps || []).map(step => normalizeKind(step.kind)))
  return (
    <Figure title={title} caption={caption}>
      <div className={styles.compare}>
        {left && <Panel panel={left} />}
        <span className={styles.versus} aria-hidden="true">
          vs
        </span>
        {right && <Panel panel={right} />}
      </div>
      <Legend kinds={kinds} legend={legend} />
    </Figure>
  )
}

// A 2x2 matrix. cells[row][col]; highlight is [row, col] of the cell the
// figure is about, drawn with `highlightKind` (default "risk").
export const Matrix = ({
  title,
  caption,
  rows = [],
  cols = [],
  cells = [],
  rowLabel,
  colLabel,
  highlight,
  highlightKind = 'risk'
}) => {
  const isHighlight = (r, c) =>
    Array.isArray(highlight) && highlight[0] === r && highlight[1] === c
  return (
    <Figure title={title} caption={caption}>
      <div className={styles.matrixWrap}>
        {colLabel && <p className={styles.axisCol}>{colLabel}</p>}
        <div className={styles.matrixBody}>
          {rowLabel && (
            <p className={styles.axisRow}>
              <span>{rowLabel}</span>
            </p>
          )}
          <table className={styles.matrix}>
            <thead>
              <tr>
                <td />
                {cols.map(col => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {cols.map((col, c) => (
                    <td
                      key={col}
                      className={`${styles.cell} ${
                        isHighlight(r, c) ? kindClass(highlightKind) : ''
                      } ${isHighlight(r, c) ? styles.cellHighlight : ''}`}
                    >
                      {cells[r] && cells[r][c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Figure>
  )
}

// Horizontal bars for comparing a few magnitudes (durations, counts).
// items: [{ label, value, display?, kind? }]; bars scale to the largest value.
export const Bars = ({ title, caption, items = [], legend }) => {
  const max = Math.max(...items.map(item => item.value || 0), 1)
  const kinds = items.map(item => normalizeKind(item.kind))
  return (
    <Figure title={title} caption={caption}>
      <ul className={styles.bars}>
        {items.map(item => (
          <li key={item.label} className={styles.barRow}>
            <span className={styles.barLabel}>{item.label}</span>
            <span className={styles.barTrack}>
              <span
                className={`${styles.bar} ${kindClass(item.kind)}`}
                style={{
                  width: `${Math.max(((item.value || 0) / max) * 100, 2)}%`
                }}
              />
            </span>
            <span className={styles.barValue}>
              {item.display || item.value}
            </span>
          </li>
        ))}
      </ul>
      <Legend kinds={kinds} legend={legend} />
    </Figure>
  )
}

const diagrams = { Figure, Flow, Compare, Matrix, Bars }

export default diagrams
