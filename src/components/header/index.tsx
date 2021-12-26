import { Link } from 'gatsby'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { DarkModeButton, DarkModeTheme } from './dark-mode-button'
import { css } from '@emotion/react'
import { motion } from 'framer-motion'

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
    padding-top: 4px;
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
  hidden: css`
    position: absolute !important;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0 !important;
    border: 0 !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden;
  `,
  switchContainer: css`
    position: relative;
    z-index: 12;
    display: flex;
    width: 27px;
    height: 27px;
    align-items: center;
    justify-content: center;
    outline: none;
    margin: 0.3rem 0 0 0.5rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  `,
}

interface ThemeProps {
  theme: DarkModeTheme
  toggleTheme: (theme: string) => void
}

const Header = ({ siteTitle, showMenu, toggleShowMenu }: { siteTitle: string, showMenu: boolean, toggleShowMenu: () => void }) => (
  <ThemeToggler>
    {({ theme, toggleTheme }: ThemeProps) => (
      <header css={styles.header}>
        <div css={styles.container}>
          <motion.div css={styles.fixed}>
            <div css={styles.logo}>  
              <Switch showMenu={showMenu} toggleShowMenu={toggleShowMenu} />
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

const Switch = ({ showMenu, toggleShowMenu }: { showMenu: boolean, toggleShowMenu: () => void }) => (
  <button
    css={styles.switchContainer}
    onClick={toggleShowMenu}
    aria-label="Toggle Menu"
  >
    <span css={styles.hidden}>Munu Button</span>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        initial="closed"
        animate={showMenu ? 'open' : 'closed'}
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        initial="closed"
        animate={showMenu ? 'open' : 'closed'}
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        initial="closed"
        animate={showMenu ? 'open' : 'closed'}
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
)

const Path = (props: any) => (
  <motion.path
    css={css`
      stroke: var(--text);
    `}
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
)

export default Header
