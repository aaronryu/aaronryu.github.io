import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { css } from "@emotion/react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { NestedListIndicator } from "./navigator"

const SIDEBAR_WIDTH = 230
const NAV_ITEMS: Array<MenuProps> = [
  { to: '/dev', label: 'Development',
    submenu: [
      { to: '/home', label: 'Home' }
    ]
  },
  { to: '/topiclog', label: 'Politics' },
  { to: '/journal', label: 'Economics' },
  { to: '/about', label: 'About' },
  { to: '/homo', label: 'Homo Sapience',
    submenu: [
      { to: '/js', label: 'Javascript' },
      { to: '/css', label: 'CSS' },
      { to: '/spring', label: 'Spring' },
    ]
  },
]

const subMenuMotion = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
  closed: {
    display: 'none',
    opacity: 0,
    y: -35 + 'px',
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
  exit: {
    display: 'none',
    opacity: 0,
    y: -35 + 'px',
    transition: {
      type: 'tween',
      duration: 0.25,
    },
  },
}

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
                      <MenuList
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        submenu={item.submenu}
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
  submenu?: Array<MenuProps>
  close?: () => void
}

const MenuList = ({ to, label, submenu }: MenuProps) => {
  const hasSubNav = submenu && (submenu.length > 0);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <motion.div key={label} css={styles.listItem}>
        {hasSubNav
          ?
          <div css={styles.listItemLink} onClick={() => setIsOpen(!isOpen)}>
            {label} <NestedListIndicator isOpen={isOpen} />
          </div>
          :
          <Link css={styles.listItemLink} to={to} activeClassName="active">
            {label}
          </Link>
        }
      </motion.div>
      <SubMenuList isOpen={isOpen} subMenu={submenu} />
    </>
  )
}

const SubMenuList = ({ isOpen, subMenu }: { isOpen: boolean, subMenu?: Array<MenuProps> }) => {
  const hasSubMenu = subMenu && (subMenu.length > 0);
  return (
    hasSubMenu ? (
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={{ open: { transition: { staggerChildren: 0.1, delayChildren: 0.01 } } }}
      >
        {subMenu.map(eachSubmenu => (
          <motion.div css={styles.listItem} variants={subMenuMotion}>
            <Link
              css={styles.subItemLink}
              to={eachSubmenu.to}
              activeClassName="active"
              onClick={() => setTimeout(close)}
            >
              {eachSubmenu.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    ) : <></>
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
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    border-bottom: 1px solid var(--hr);
  `,
  listItemLink: css`
    display: flex;
    justify-content: space-between;
    padding: 1.1rem 1rem 1.1rem 1.1rem;
    font-size: 0.95rem;
    color: var(--text-auxiliary);
    fill: var(--text-auxiliary);
    transition: all 0.15s ease-out;

    :hover {
      color: var(--text0);
      fill: var(--text0);
      background-color: var(--bg-accents);
    }

    &.active {
      text-decoration: underline;
      color: var(--text);
      fill: var(--text);
    }
  `,

  subItemLink: css`
    display: block;
    padding: 1.1rem 1.4rem 1.1rem 2.2rem;
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