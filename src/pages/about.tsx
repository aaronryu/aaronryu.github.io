import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { graphql } from "gatsby"
import * as React from "react"
import { universities, University } from "./resume/educations"
import { companies, Company } from "./resume/experiences"

interface Props {
  data: {
    mdx: {
      id: string
      frontmatter: {
        slug: string /* example-post */
        title: string /* 제목에 해당합니다. */
        author: string /* Aaron Ryu */
        date: string /* 2021-10-28 */
        dateFormatted: string
        updateDate: string /* 2021-10-28 */
        abstract?: string /* (2) 그 다음 작은 폰트로 */
      }
      body: string
      slug: string
    }
  }
}

interface Theory {
  
}

const Highlight = styled('a')(() => ({
  fontWeight: 'bold',
  color: 'var(--text-link)',
}))

const About: React.FunctionComponent<Props> = ({
  data: { mdx },
}) => {
  return (
    <article>
      <div css={styles.introduction}>
        <div css={css`font-size: 1.7em; margin-top: 14px;`}>Aaron Ryu</div>
        <div css={css`font-size: 1.1em;`}>Software Developer</div>
        <div css={css`font-size: 0.97em; margin: 16px 0; font-style: italic;`}>"Cool Heads, Warm Hearts"</div>
        <div css={css`font-size: 0.9em;`}>
          <div css={css`margin: 4px`}>aaron.ryu.dev@gmail.com | +82 10 5549 7201</div>
          <div css={css`margin: 4px`}>Seoul, 05328, Republic of Korea</div>
        </div>
      </div>
      <div css={styles.body}>
        <Specialty list={[
          <><Highlight>Web Development</Highlight>: Front-end &amp; Back-end</>,
        ]}/>
        <Skills list={[
          <><Highlight>Kotlin 1.3</Highlight>, <Highlight>Java 8+ w/ Spring</Highlight></>,
          <><Highlight>React.js</Highlight> and <Highlight>Angular.js w/ Typescript</Highlight></>,
          <><Highlight>AWS</Highlight></>,
        ]}/>
        <Experiences companies={companies} />
        <Education universities={universities} />
      </div>
    </article>
  )
}

const Specialty: React.FunctionComponent<{ list: Array<React.ReactFragment> }> = ({ list }) => (
  <Header category="Specialty">
    <ul css={styles.representative}>
      {list.map(each => <li>{each}</li>)}
    </ul>
  </Header>
)

const Skills: React.FunctionComponent<{ list: Array<React.ReactFragment> }> = ({ list }) => (
  <Header category="Skills">
    <ul css={styles.representative}>
      {list.map(each => <li>{each}</li>)}
    </ul>
  </Header>
)

const Experiences: React.FunctionComponent<{ companies: Array<Company> }> = ({ companies }) => (
  <Header category="Experience">
    {companies.map(company => (
      <EachExperience>
        <div css={styles.eachExperienceHeader}>
          <a css={css`position: relative; left: -5px`}>
            <svg height="20" viewBox="0 0 18 18" width="24" fill="var(--text-link)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
            </svg>
          </a>
          <strong css={css`font-size: 1.12rem;`}>{company.name}</strong>
          <span css={css`margin: 0 10px 0 auto;`}>{company.startDate} ~ {company.endDate ? company.endDate : 'Current'}</span>
        </div>
        <ul css={css`position: relative; top: -25px; margin-bottom: -6px;`}>
          {company.projects.map(eachProject => (
            <li css={styles.mainProject}>
              <div css={styles.mainProjectHeader}>
                {eachProject.name}
                <span css={css`margin: 0 10px 0 auto;`}>~ {eachProject.endDate}</span>
              </div>
              {eachProject.details.map(eachDetail => (
                <ul>
                  <li>{eachDetail.name}</li>
                  {eachDetail.subDetails && eachDetail.subDetails.length > 0 && (
                    <ul>
                      {eachDetail.subDetails.map(eachSubDetail => (
                        <li>{eachSubDetail}</li>
                      ))}
                    </ul>
                  )}
                </ul>
              ))}
            </li>
            ))}
        </ul>
      </EachExperience>
    ))}
  </Header>
)

const Education: React.FunctionComponent<{ universities: Array<University> }> = ({ universities }) => (
  <Header category="Education">
    {universities.map(university => (
      <EachEducation>
        <div css={styles.eachEducationHeader}>
          <a css={css`position: relative; left: -5px; top: 1px`}>
            <svg height="20" viewBox="0 0 18 18" width="24" fill="var(--text-link)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
            </svg>
          </a>
          <span>{university.name}, {university.major} - {university.degree}</span>
          <span css={css`margin: 0 10px 0 auto;`}>{university.startDate} ~ {university.endDate ? university.endDate : 'Current'}</span>
        </div>
        <ul css={css`position: relative; top: -25px; margin-bottom: -6px;`}>
          {university.projects.map(eachProject => (
            <li css={styles.mainStudy}>
              <div css={styles.mainStudyHeader}>
                {eachProject.name}
                {/* <span css={css`margin: 0 10px 0 auto;`}>~ {eachProject.endDate}</span> */}
              </div>
              {eachProject.details.map(eachDetail => (
                <ul>
                  <li>{eachDetail.name}</li>
                  {eachDetail.subDetails && eachDetail.subDetails.length > 0 && (
                    <ul>
                      {eachDetail.subDetails.map(eachSubDetail => (
                        <li>{eachSubDetail}</li>
                      ))}
                    </ul>
                  )}
                </ul>
              ))}
            </li>
            ))}
        </ul>
      </EachEducation>
    ))}
  </Header>
)

const Theory: React.FunctionComponent<{ papers: Array<Paper> }> = ({ papers }) => (
  <Header category="Papers &amp; Conferences Attended">
    {universities.map(university => (
      <EachEducation>
        <div css={styles.eachEducationHeader}>
          <a css={css`position: relative; left: -5px; top: 1px`}>
            <svg height="20" viewBox="0 0 18 18" width="24" fill="var(--text-link)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
            </svg>
          </a>
          <span>{university.name}, {university.major} - {university.degree}</span>
          <span css={css`margin: 0 10px 0 auto;`}>{university.startDate} ~ {university.endDate ? university.endDate : 'Current'}</span>
        </div>
        <ul css={css`position: relative; top: -25px; margin-bottom: -6px;`}>
          {university.projects.map(eachProject => (
            <li css={styles.mainStudy}>
              <div css={styles.mainStudyHeader}>
                {eachProject.name}
                {/* <span css={css`margin: 0 10px 0 auto;`}>~ {eachProject.endDate}</span> */}
              </div>
              {eachProject.details.map(eachDetail => (
                <ul>
                  <li>{eachDetail.name}</li>
                  {eachDetail.subDetails && eachDetail.subDetails.length > 0 && (
                    <ul>
                      {eachDetail.subDetails.map(eachSubDetail => (
                        <li>{eachSubDetail}</li>
                      ))}
                    </ul>
                  )}
                </ul>
              ))}
            </li>
            ))}
        </ul>
      </EachEducation>
    ))}
  </Header>
)

const Header: React.FunctionComponent<{
  category: string,
  children: React.ReactNode,
}> = ({ category, children }) => (
  <React.Fragment>
    <h2 id={category} css={css`position: relative;`}>
      <a css={styles.aAnchor}>
        <svg height="20" viewBox="0 0 20 20" width="20" fill="var(--text-link)">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
        </svg>
      </a>
      {category}
    </h2>
    {children}
  </React.Fragment>
)

const EachExperience: React.FunctionComponent<{
  children: React.ReactNode,
}> = ({ children }) => (
  <div css={styles.eachExperience}>
    {children}
  </div>
)

const EachEducation: React.FunctionComponent<{
  children: React.ReactNode,
}> = ({ children }) => (
  <div css={styles.eachEducation}>
    {children}
  </div>
)

const styles = {
  introduction: css`
    margin-top: 85px;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; // flex-start;
    text-align: center;
  `,
  representative: css`
    font-size: 1.115rem;
  `,
  highlight: css`
    font-size: 1rem;
    font-weight: bold;
    color: var(--text-link);
  `,
  aAnchor: css`
    height: 2.3rem;
    border-bottom: 2px solid var(--text-link);
    background-position: 0 100%;
    background-size: auto 3px;
    background-repeat: repeat-x;

    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    padding-right: 4px;
  `,
  eachExperience: css`
    border: 1px solid var(--text-link);
    border-radius: 10px;
    padding: 10px 10px 0 10px;
    margin: 20px 16px 20px 0;
  `,
  eachExperienceHeader: css`
    display: flex;
    font-size: 1.115rem;
    color: var(--text-link);
    background-color: var(--text-link-background);
    border-radius: 5px;
    // border-bottom: 1px solid var(--brand);
    // padding-bottom: 10px;

    @media only screen and (max-width: 700px) {
      font-size: 1.015rem;
    }
  `,
  mainProject: css`
    padding-top: 20px;
  `,
  mainProjectHeader: css`
    display: flex;
    color: var(--text-link);
  `,
  headerWrapper: css`
    margin: 0 0 1rem 0;
    padding: 0;
  `,

  eachEducation: css`
    border: 1px solid var(--text-link);
    border-radius: 10px;
    padding: 10px 10px 0 10px;
    margin: 20px 16px 20px 0;
  `,
  eachEducationHeader: css`
    display: flex;
    font-size: 1rem;
    color: var(--text-link);
    background-color: var(--text-link-background);
    border-radius: 5px;
    // border-bottom: 1px solid var(--brand);
    // padding-bottom: 10px;

    @media only screen and (max-width: 700px) {
      font-size: 0.915rem;
    }
  `,
  mainStudy: css`
    padding-top: 20px;
  `,
  mainStudyHeader: css`
    display: flex;
  `,

  header: css`
    margin: 0 auto;
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }

    padding: 0 1rem;
    max-width: 800px;
  `,
  category: css`
    margin: 0 0 1.1rem 0.15rem;
    letter-spacing: 0.03rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--brand);
  `,
  headline: css`
    margin: 0;
    padding: 0;
    line-height: 1.4;
    font-size: 1.6rem;
    font-weight: 500;

    @media only screen and (max-width: 700px) {
      font-size: 1.25rem;
    }
  `,
  titleWrapper: css`
    position: fixed;
    z-index: -1;
    top: 15px;
    left: 24rem;
    right: 24rem;
    text-align: center;

    @media only screen and (max-width: 1100px) {
      left: 20rem;
      right: 20rem;
    }

    @media only screen and (max-width: 1000px) {
      left: 7rem;
      right: 7rem;
    }

    .scrolled-a-bit & {
      z-index: 12;
    }
  `,
  title: css`
    margin: 0 auto;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9792rem;
    transition: all 0.15s ease-out;
    transform: translate3d(0, 0.5rem, 0);
    opacity: 0;

    .scrolled-a-bit & {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }
  `,
  deck: css`
    margin: 0.95rem 0 0;
    padding: 0 0.1rem;
    line-height: 1.9;
    font-size: 1.0rem;

    @media only screen and (max-width: 700px) {
      font-size: 0.86rem;
    }
  `,
  abstract: css`
    margin: 0 auto 0;
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }

    padding: 0 1rem;
    max-width: 750px;
    display: flex;
    justify-content: center;
  `,
  abstractText: css`
    max-width: 700px;
    line-height: 1.9;

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }
  `,
  epigraph: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }

    padding: 0 1rem 5rem;
    max-width: 650px;
    text-align: center;
  `,
  epigraphText: css`
    max-width: 450px;
    margin: 0 0 0.5rem 0;
    line-height: 1.9;
  `,
  epigraphAuthor: css`
    padding-top: 0.3rem;
    max-width: 500px;
    display: flex;
    align-items: center;
    margin: 0 0.225rem 0 0;
    letter-spacing: 0.03rem;

    ::before {
      content: '';
      margin-right: 0.44rem;
      width: 13px;
      height: 1px;
      background: #777;
    }
  `,
  meta: css`
    margin: 0 auto;
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }

    padding: 0 1rem 0;
    width: 100%;
    max-width: 800px;
    letter-spacing: 0.02rem;
    font-size: 0.83rem;
    color: var(--brand);
  `,

  body: css`
    margin: 2rem auto 0;
    @media only screen and (max-width: 1280px) {
      margin: 0 auto 0 50px;
      padding: 0 1.2rem;
    }
    @media only screen and (max-width: 1024px) {
      margin: 0 auto 0 0;
      padding: 0 1.2rem;
    }

    padding: 0 1rem;
    width: 100%;
    max-width: 800px;
    line-height: 2;
    font-size: 1.0rem;

    @media only screen and (max-width: 700px) {
      font-size: 0.84rem;
    }

    p,
    ul,
    ol {
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      word-break: break-word;
      hyphens: auto;
    }

    ul,
    ol {
      padding-left: 2rem;

      ul,
      ol {
        margin-bottom: 0;
      }
    }

    blockquote {
      margin-left: 2.1rem;
      margin-right: 0;
      font-size: 0.9rem;
    }

    img {
      max-width: 100%;
    }

    hr {
      position: relative;
      margin: 2.848rem auto 2.848rem;
      padding: 0;
      border: none;
      width: 20px;
      height: 20px;
      background: none;

      &::after {
        content: '\u2666';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    h1,
    h2 {
      // margin: 1.6rem 0 0 0;
      margin: 2.3rem 0 0 0;
      @media only screen and (max-width: 700px) {
        margin: 2rem 0 1rem 0;
      }
      line-height: 1.6;
      font-weight: 400;
      scroll-margin-top: 5rem;
    }

    h2 {
      font-size: 1.296rem;
      font-weight: 600;
      height: 2.3rem;
      border-bottom: 2px solid var(--text-link);
      @media only screen and (max-width: 700px) {
        font-size: 1.196rem;
      }
    }

    h3 {
      font-size: 1.115rem;
      @media only screen and (max-width: 700px) {
        font-size: 1.015rem;
      }
    }

    h4 {
      font-size: 1.138rem;
      @media only screen and (max-width: 700px) {
        font-size: 1.038rem;
      }
    }

    h5 {
      font-size: 1.067rem;
      @media only screen and (max-width: 700px) {
        font-size: 0.967rem;
      }
    }

    small {
      font-size: 0.937rem;
      @media only screen and (max-width: 700px) {
        font-size: 0.837rem;
      }
    }

    .gatsby-highlight {
      margin-bottom: 1.602rem;
    }

    [data-language] {
      ::before {
        content: attr(data-language);
        display: flex;
        justify-content: flex-end;
        margin-right: 0.8rem;
        margin-bottom: -2rem;
        letter-spacing: 0.05rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-placeholder);
      }
    }

    .gatsby-code-title {
      margin-left: 0.2rem;
      margin-bottom: 0.5rem;
      text-align: left;
      font-size: 0.8rem;
      font-family: 'Fira Code', 'Consolas', 'Menlo', 'Monaco', 'Andale Mono WT',
        'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter',
        'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono',
        'Nimbus Mono L', 'Courier New', 'Courier', monospace;
      color: var(--text-auxiliary);
    }
  `,
  footer: css`
    margin: 5rem auto 0;
    max-width: 650px;
  `,
}

export const query = graphql`
  query {
    mdx(slug: { eq: "about-test/" }) {
      id
      frontmatter {
        title
        slug
        author
        date
        dateFormatted: date(formatString: "MMM D, YYYY hh:mmA")
        updateDate
        abstract
      }
      body
      slug
    }
  }
`

export default About
