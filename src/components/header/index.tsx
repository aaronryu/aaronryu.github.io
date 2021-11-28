import * as React from 'react'
import { Link } from 'gatsby'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

interface ThemeProps {
  theme: string
  toggleTheme: (theme: string) => void
}

const Header = ({ siteTitle }: { siteTitle: string }) => (
  <ThemeToggler>
    {({ theme, toggleTheme }: ThemeProps) => (
      <label>
        <input
          type="checkbox"
          onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
          checked={theme === 'dark'}
        />{' '}
        Dark mode
      </label>
    )}
  </ThemeToggler>
)

export default Header
