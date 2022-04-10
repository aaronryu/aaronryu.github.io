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
  current: string
  onClose?: () => void
}

interface Props {
  current: string
  menu: Array<Menu>
  onClose?: () => void
}

const Navigator = ({ current, menu, onClose }: Props) => {
  return (
    <div style={{ overflow: 'scroll' }}>
      <motion.div css={styles.list} key={'navigator'}>
        {menu.map(item => (
              <MenuNavigator
                current={current}
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

const MenuNavigator = ({ current, to, label, subMenu, onClose }: MenuProps) => {
  const hasSubMenu = isNonEmpty(subMenu);
  const isOpenedSubMenu: boolean = hasSubMenu && !!(subMenu!.find(eachSubMenu => current.startsWith(eachSubMenu.to)))
  const [isOpenSubMenu, setOpenSubMenu] = useState<boolean>(isOpenedSubMenu)
  return (
    <>
      <motion.div css={styles.listItem} key={label}>
        {hasSubMenu
          ?
          <div css={styles.listItemLink} onClick={() => setOpenSubMenu(!isOpenSubMenu)}>
            {label} <NestedListIndicator isOpen={isOpenSubMenu} />
          </div>
          :
          <Link css={[styles.listItemLink, (current.startsWith(to) && styles.currentHighlight)]} to={to} onClick={() => onClose && onClose()}>
            {label}
          </Link>
        }
      </motion.div>
      <SubMenuNavigator current={current} isOpen={isOpenSubMenu} subMenu={subMenu} onClose={onClose} />
    </>
  )
}

const SubMenuNavigator = ({ current, isOpen, subMenu, onClose }: { current: string, isOpen: boolean, subMenu?: Array<Menu>, onClose?: () => void }) => {
  const hasSubMenu = isNonEmpty(subMenu);
  return (
    hasSubMenu ? (
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={{ open: { transition: { staggerChildren: 0.1, delayChildren: 0.01 } } }}
      >
        {subMenu!.map(eachSubMenu =>
          <SubMenu isCurrent={current.startsWith(eachSubMenu.to)} eachSubMenu={eachSubMenu} onClose={onClose} key={eachSubMenu.label} />
        )}
      </motion.div>
    ) : <></>
  )
}

const SubMenu = ({ isCurrent, eachSubMenu, onClose }: { isCurrent: boolean, eachSubMenu: Menu, onClose?: () => void }) => (
  <motion.div css={styles.listItem} variants={subMenuDisplay} key={eachSubMenu.label}>
    <Link
      css={[styles.listItemLink, styles.subItemIndent, (isCurrent && styles.currentHighlight)]}
      to={eachSubMenu.to}
      onClick={() => onClose && onClose()}
    >
      {eachSubMenu.label}
    </Link>
  </motion.div>
)

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
  `,
  subItemIndent: css`
    display: block;
    padding: 1.1rem 1.4rem 1.1rem 2.2rem;
  `,
  currentHighlight: css`
    -webkit-text-decoration: underline;
    text-decoration: underline;
    color: var(--text);
    fill: var(--text);
  `,
}

export default Navigator