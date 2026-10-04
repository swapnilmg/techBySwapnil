import * as React from 'react'

// Sets data-theme on <html> before first paint, so the page never flashes
// the wrong theme while React hydrates. Falls back to system preference
// when the visitor has no saved choice.
const setInitialTheme = `
(function() {
  try {
    var stored = window.localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{ __html: setInitialTheme }}
    />,
  ])
}
