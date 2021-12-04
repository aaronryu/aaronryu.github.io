import { Link } from 'gatsby'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { DarkModeButton, DarkModeTheme } from './dark-mode-button'
import { css } from '@emotion/react'
import { motion } from 'framer-motion'
import Logo from './logo'

const styles = {
  header: css({
    padding: 0
  }),
  container: css({
    position: 'relative',
    zIndex: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  fixed: css({
    position: 'fixed',
    zIndex: 11,
    top: 0,
    right: 0,
    left: 0,
    padding: '0.5rem 1rem 0.5rem',
    borderBottom: '1px solid var(--hr)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background 0.1s ease-out',
    background: 'var(--bg-trans)',
    backdropFilter: 'blur(16px)',
  }),
  logo: css`
    width: 35px;
    height: 30px;
  `,
  buttonWrapper: css`
    display: flex;
    align-items: center;
  `,
  brand: css`
    position: absolute;
    z-index: 12;
    left: 60px;
    width: 150px;
    vertical-align: middle;
    font-size: 1.4rem;
    font-family: 'Questrial', sans-serif;
    transition: all 0.1s ease-out;

    .scrolled-a-bit & {
      opacity: 0;
      transform: translate3d(0, -2.5rem, 0);
    }
  `,
}

interface ThemeProps {
  theme: DarkModeTheme
  toggleTheme: (theme: string) => void
}

const Header = ({ siteTitle }: { siteTitle: string }) => (
  <ThemeToggler>
    {({ theme, toggleTheme }: ThemeProps) => (
      <header css={styles.header}>
        <div css={styles.container}>
          <motion.div css={styles.fixed}>
            <div css={styles.logo}>
              <Link to="/" onClick={close}>
                <Logo title={siteTitle} />
              </Link>
            </div>
            <div css={styles.brand}>
              <Link to="/" onClick={close}>
                {siteTitle}
              </Link>
            </div>

            <div css={styles.buttonWrapper}>
              <DarkModeButton
                theme={theme}
                onToggle={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
              />
            </div>
          </motion.div>
        </div>
      </header>
    )}
  </ThemeToggler>
)

export default Header
