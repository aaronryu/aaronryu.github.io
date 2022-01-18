import React, { useState } from "react"
import { motion } from "framer-motion"
import { css } from "@emotion/react"
import { Link } from "gatsby"
import { isNonEmpty } from "../../utils/array"

const NAV_ITEMS: Array<Menu> = [
  { to: '/dev', label: 'Development',
    subMenu: [
      { to: '/home', label: 'Home' }
    ]
  },
  { to: '/topiclog', label: 'Politics' },
  { to: '/journal', label: 'Economics' },
  { to: '/homo', label: 'Homo Sapience',
    subMenu: [
      { to: '/js', label: 'Javascript' },
      { to: '/css', label: 'CSS' },
      { to: '/spring', label: 'Spring' },
    ]
  },
  { to: '/about', label: 'About' },
]

const subMenuDisplay = {
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

export interface Menu {
  to: string
  label: string
  subMenu?: Array<Menu>
}

export interface MenuProps extends Menu {
  onClose?: () => void
}

interface Props {
  onClose?: () => void
}

const Navigator = ({ onClose }: Props) => {
  return (
    <div style={{ overflow: 'scroll' }}>
      <motion.div css={styles.list} key={'navigator'}>
        {NAV_ITEMS.map(item => (
              <MenuNavigator
                key={item.label}
                to={item.to}
                label={item.label}
                subMenu={item.subMenu}
                onClose={onClose}
              />
        ))}
      </motion.div>
    </div>
  )
}

const MenuNavigator = ({ to, label, subMenu, onClose }: MenuProps) => {
  const hasSubMenu = isNonEmpty(subMenu);
  const [isOpenSubMenu, setOpenSubMenu] = useState<boolean>(false)
  return (
    <>
      <motion.div css={styles.listItem} key={label}>
        {hasSubMenu
          ?
          <div css={styles.listItemLink} onClick={() => setOpenSubMenu(!isOpenSubMenu)}>
            {label} <NestedListIndicator isOpen={isOpenSubMenu} />
          </div>
          :
          <Link css={styles.listItemLink} to={to} activeClassName="active" onClick={() => onClose && onClose()}>
            {label}
          </Link>
        }
      </motion.div>
      <SubMenuNavigator isOpen={isOpenSubMenu} subMenu={subMenu} />
    </>
  )
}

const SubMenuNavigator = ({ isOpen, subMenu, onClose }: { isOpen: boolean, subMenu?: Array<MenuProps>, onClose?: () => void }) => {
  const hasSubMenu = isNonEmpty(subMenu);
  return (
    hasSubMenu ? (
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={{ open: { transition: { staggerChildren: 0.1, delayChildren: 0.01 } } }}
      >
        {subMenu!.map(eachSubmenu => (
          <motion.div css={styles.listItem} variants={subMenuDisplay} key={eachSubmenu.label}>
            <Link
              css={[styles.listItemLink, styles.subItemIndent]}
              to={eachSubmenu.to}
              activeClassName="active"
              onClick={() => onClose && onClose()}
            >
              {eachSubmenu.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    ) : <></>
  )
}

const Path = (props: any) => (
  <motion.path
    strokeWidth="2"
    stroke="var(--text-auxiliary)"
    strokeLinecap="round"
    {...props}
  />
);

export const NestedListIndicator = ({ isOpen }: { isOpen: boolean }) => (
  <motion.div
    initial={"closed"}
    animate={isOpen ? "open" : "closed"}
  >
    <svg height="12px" viewBox="0 0 16 16" width="12px">
      <Path
        variants={{
          closed: { d: "M 3 9 L 9 4" },
          open: { d: "M 4 9 L 9 15" },
        }}
      />
      <Path
        variants={{
          closed: { d: "M 3 9 L 9 14" },
          open: { d: "M 14 9 L 9 15" }
        }}
      />
    </svg>
  </motion.div>
)

const styles = {
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

  subItemIndent: css`
    display: block;
    padding: 1.1rem 1.4rem 1.1rem 2.2rem;
  `,
}

export default Navigator