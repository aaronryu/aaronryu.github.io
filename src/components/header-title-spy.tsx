import * as React from "react"
import { css } from "@emotion/react"
import { useEffect } from "react"
import { useRef } from "react"

interface Props {
  active: boolean
  pathname: string
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const HeaderTitleSpy: React.FunctionComponent<Props> = ({ active, pathname }) => {
  const spy = useRef() as React.MutableRefObject<HTMLDivElement>;

  // Layout 에서 공통적으로 제목에 해당하는 스크롤
  useEffect(() => {
    if (!active) {
      document.body.classList.remove('scrolled-a-bit')
    } else {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (!entry.intersectionRatio) {
            document.body.classList.add('scrolled-a-bit')
          } else {
            document.body.classList.remove('scrolled-a-bit')
          }
        },
        { rootMargin: '0px' }
      )
      observer.observe(spy.current)
      return () => {
        observer.disconnect()
      }
    }
  }, [pathname])

  return (<div css={styles.scrollSpy} ref={spy} style={{ height: 210 }} />)
}

const styles = {
  scrollSpy: css`
    position: absolute;
    z-index: -999;
    top: 0;
    width: 1px;
  `,
}

export default HeaderTitleSpy
