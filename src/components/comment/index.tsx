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
      max-width: 830px;
      margin-bottom: 1.5rem;
    }
  `,
}

export default Comment