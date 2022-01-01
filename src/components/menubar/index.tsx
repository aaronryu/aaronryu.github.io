import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { css } from "@emotion/react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"

const SIDEBAR_WIDTH = 230
const NAV_ITEMS = [
  { to: '/', label: 'Articles' },
  { to: '/devlog/', label: 'Dev Log' },
  { to: '/topiclog/', label: 'Topic Log' },
  { to: '/journal/', label: 'Journal' },
  { to: '/crafts/', label: 'Crafts' },
  { to: '/now/', label: 'Now' },
  { to: '/about/', label: 'About' },
]

const variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
  closed: {
    opacity: 1,
    x: -SIDEBAR_WIDTH + -35 + 'px',
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
  exit: {
    opacity: 1,
    x: -SIDEBAR_WIDTH + -35 + 'px',
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
}

const variants2 = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const variants3 = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
  exit: {
    opacity: 0,
  },
}

interface Props {
  visible: boolean
  close: () => void
  currentWidth: number
  links: {
    github: string
    facebook: string
    twitter: string
  }
}

const LeftSideMenuBar = ({ visible, close, currentWidth, links }: Props) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div css={styles.container}>
          <motion.div
            css={[styles.profileContainer, ((currentWidth < 1278) && { border: '1px solid var(--brand)' })]}
            variants={variants}
            initial="closed"
            animate={visible ? 'open' : 'closed'}
            exit="closed"
          >
            <div css={{ padding: "0.5rem 1rem 1rem", textAlign: "center" }}>
              <section css={{ fontSize: "1.4rem", paddingBottom: "0.4rem" }}>Aaron Ryu</section>
              <section css={{ fontSize: "0.9rem" }}>Software Developer</section>
              <div css={{ margin: '16px auto 0 auto', width: 156, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faGithub} onClick={() => window.open(links.github, '_blank')} />
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faFacebook} onClick={() => window.open(links.facebook, '_blank')} />
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faTwitter} onClick={() => window.open(links.twitter, '_blank')} />
              </div>
            </div>
          </motion.div>
          <motion.div
            css={[styles.menuContainer, ((currentWidth < 1278) && { border: '1px solid var(--brand)' })]}
            variants={variants}
            initial="closed"
            animate={visible ? 'open' : 'closed'}
            exit="closed"
          >
            <div style={{ overflow: 'scroll' }}>
              <motion.div css={styles.list} key="a" variants={variants2}>
                {NAV_ITEMS.map(item => (
                  <MenuItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    close={close}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface MenuProps {
  to: string
  label: string
  close: () => void
}

interface SubMenuProps {
  visible: boolean
  close: () => void
}

const MenuItem = ({ to, label, close }: MenuProps) => {
  return (
    <motion.div
      css={styles.listItem}
      key={to + label}
      variants={variants3}
      // whileHover={{ scale: 1.1 }}
      // whileTap={{ scale: 0.95 }}
      exit={{ opacity: 0 }}
    >
      <Link
        css={styles.listItemLink}
        to={to}
        activeClassName="active"
        onClick={() => setTimeout(close)}
      >
        {label}
      </Link>
    </motion.div>
  )
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 10;
    top: 64px; // 55px;
    left: 12px; // 15px;
    width: 100%;
    max-width: ${SIDEBAR_WIDTH}px;
  `,
  profileContainer: css`
    border-radius: 7px;
    width: 100%;
    max-width: ${SIDEBAR_WIDTH}px;
    background-color: var(--bg);
    // box-shadow: var(--shadow-extra-small);
  `,
  menuContainer: css`
    margin: 1rem 0;
    border-radius: 7px;
    width: 100%;
    max-width: ${SIDEBAR_WIDTH}px;
    max-height: 700px;
    overflow: scroll;
    transition: background-color 0.1s ease-out;
    background-color: var(--bg);
    // box-shadow: var(--shadow-small);
  `,
  list: css`
    flex: 1;
    padding: 10px;
  `,
  listItem: css`
    border-bottom: 1px solid var(--hr);
  `,
  listItemLink: css`
    display: block;
    padding: 1.1rem 1.4rem;
    font-size: 0.95rem;
    color: var(--text-auxiliary);
    transition: all 0.15s ease-out;

    :hover {
      color: var(--text0);
      background-color: var(--bg-accents);
    }

    &.active {
      text-decoration: underline;
      color: var(--text);
    }
  `,
}

export default LeftSideMenuBar