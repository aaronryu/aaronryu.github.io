import { css } from '@emotion/react'
// import logo from './aaron-icon.svg'
import logo from './aaron-icon-lined.svg'

const Logo = ({ title }: { title: string }) => (
  <>
    <img src={logo} style={{ width: 35, height: 30 }}/>
    <title id="logoimage">{title}</title>
  </>
)

const styles = {
  g: css`
    fill: var(--text);
  `,
}

export default Logo
