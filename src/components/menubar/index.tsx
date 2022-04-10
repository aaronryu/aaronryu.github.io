import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { css } from "@emotion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"
import Navigator, { Menu } from './navigator'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

const SIDEBAR_WIDTH = 230

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
}

interface Props {
  location: string
  menu: Array<Menu>
  visible: boolean
  onClose?: () => void
  currentWidth: number
  links: {
    github: string
    facebook: string
    twitter: string
  }
}

const LeftSideMenuBar = ({ location, menu, visible, onClose, currentWidth, links }: Props) => {
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
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faGithub as IconProp} onClick={() => window.open(links.github, '_blank')} />
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faFacebook as IconProp} onClick={() => window.open(links.facebook, '_blank')} />
                <FontAwesomeIcon css={{ cursor: 'pointer'}} size={"lg"} icon={faTwitter as IconProp} onClick={() => window.open(links.twitter, '_blank')} />
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
            <Navigator current={location} menu={menu} onClose={onClose}/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    max-height: 600px;
    overflow: scroll;
    transition: background-color 0.1s ease-out;
    background-color: var(--bg);
    // box-shadow: var(--shadow-small);
  `,
}

export default LeftSideMenuBar