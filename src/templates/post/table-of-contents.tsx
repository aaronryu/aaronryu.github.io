import React from 'react'

export interface TocHeaders {
  items: Array<TocHeader>
}

export interface TocHeader {
  url: string, title: string, items?: Array<TocHeader>
}

interface Props {
  toc: TocHeaders,
  depth: number,
  currentHeaderUrl: string
}

const makeTocHeaderHtml = (each: TocHeader, remainDepth: number) => 
  (each.items !== undefined)
    ? (
      <React.Fragment key={each.title}>
        <li><a href={each.url}>{each.title}</a></li>
        <ul>{makeTocHeadersHtml(each.items, (remainDepth - 1))}</ul>
      </React.Fragment>
    )
    : <li key={each.title}><a href={each.url}>{each.title}</a></li>

const makeTocHeadersHtml = (items: Array<TocHeader>, depth: number) => {
  return <React.Fragment key={depth}>{(depth > 0) && items.map((each) => makeTocHeaderHtml(each, depth))}</React.Fragment>
}

const makeToc = (toc: TocHeaders, depth: number) => 
  (toc.items !== undefined)
    ? <ul>{makeTocHeadersHtml(toc.items, depth)}</ul>
    : <></>

const TableOfContents: React.FunctionComponent<Props> = ({ toc, depth, currentHeaderUrl }) => {
  return (
    <div
      css={{
        'ul:first-of-type': {
          marginLeft: '-0.8rem',
        },
        // 낮은 depth가 더 안쪽으로 들어가도록 모든 ul에 marginLeft를 부여한다.
        '& ul': {
          marginLeft: '-1.4rem',
        },
        // currentHeaderUrl 문자열이 href 속성에 포함된다면 아래 스타일을 부여한다. 
        // 현재 스크롤에 해당하는 Header를 하이라이트 하기 위함
        [`& ul > li a[href="${currentHeaderUrl}"]`]: {
          color: 'var(--text0)',
          fontWeight: '600',
        },
        fontSize: '0.73rem',
        lineHeight: '1.2rem',
        fontWeight: 500,
        //
        position: 'fixed',
        top: 100,
        minHeight: 100,
        margin: '1rem 1rem 1rem calc(50vw + 400px - 10px)',
        '@media only screen and (max-width: 1280px)': {
          margin: '1rem 1rem 1rem calc(800px + 50px - 10px)',
        },
        '@media only screen and (max-width: 1024px)': {
          margin: '1rem 1rem 1rem calc(800px - 10px)',
          'ul:first-of-type': {
            marginLeft: '-1rem',
          },
          // 낮은 depth가 더 안쪽으로 들어가도록 모든 ul에 marginLeft를 부여한다.
          '& ul': {
            marginLeft: '-1.8rem',
          },
          fontSize: '0.65rem',
          lineHeight: '1rem',
        },
        '@media only screen and (max-width: 970px)': {
          display: 'none',
        },
        borderLeft: '1px solid var(--hr)',
      }}
    >
      {makeToc(toc, depth)}
    </div>
  )
}

export default TableOfContents
