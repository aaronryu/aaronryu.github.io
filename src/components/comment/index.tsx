import { css, Global } from "@emotion/react"
import React, { createRef, useEffect, useRef } from "react"

const Comment: React.FunctionComponent = () => {
  const REPO_FOR_SEARCH = 'aaronryu/aaronryu.github.io'
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const utterances = document.createElement("script")
    const attributes = {
      src: "https://utteranc.es/client.js",
      repo: REPO_FOR_SEARCH,
      "issue-term": "pathname",
      label: "comment",
      theme: "github-dark-orange",
      crossOrigin: "anonymous",
      async: "true",
    }
    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })
    containerRef.current.appendChild(utterances)
  }, [])
  
  return (
    <>
      <Global styles={styles.global} />
      <div id="comment" ref={containerRef} />
    </>
  )
}

const styles = {
  global: css`
    .utterances {
      // sizer
      @media only screen and (max-width: 1280px) {
        margin: 0 auto 2rem 50px;
        padding: 0 1.2rem;
      }
      @media only screen and (max-width: 1024px) {
        margin: 0 auto 2rem 0;
        padding: 0 1.2rem;
      }
      @media only screen and (max-width: 970px) {
        margin: 0 auto 2rem;
        padding: 0 1.2rem;
      }

      // width
      position: relative;
      box-sizing: border-box;
      max-width: 800px;
    }
  `,
}

export default Comment