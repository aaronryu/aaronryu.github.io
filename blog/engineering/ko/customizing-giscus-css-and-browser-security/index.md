---
title: "Giscus CSS 커스터마이징으로 알아보는 브라우저의 보안 정책들"
category: ["Frontend"]
created: 2026-05-13T03:03:39.420Z
# new Date(new Date().getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString();
deck: 블로그를 새로 만들면서 기존 Hexo 블로그에서 사용하던 Discus 를 더 이상 사용하지 않고 현재 가장 편리하게 쓸 수 있는 Giscus 를 사용하게되었다. Giscus 댓글 컴포넌트를 나의 블로그 CSS 테마에 맞추기 위해 커스터마이즈한 CSS 만들어 외부에서 Giscus 에 주입하려하였다. 어째서인지 마음만큼 잘 되지 않았고, 헤매던 와중에 프론트엔드 개발자라면 질리도록 보는 CORS 뿐만 아니라 Mixed Content 와 PNA (Private Network Access) 에 대한 보안 정책들이 엉켜서 동작되지 않았던 이유들을 설명하고, Giscus 내 CSS 테마를 올바르게 적용하는 법에 대해서도 안내한다.
abstract: Giscus 는 여느 서드파티 댓글 컴포넌트와 동일하게 <iframe> 으로 동작된다. 먼저 GA 구글 애널리틱스와 유사하게 <script> 통해 여러분들의 브라우저에서 클라이언트 사이드로 실행할 자바스크립트를 Giscus 서버로부터 가져오고, 개발자들이 설정한 세부옵션들을 취합하여 해당 자바스크립트는 Giscus 서버에게 서버 사이드로 Giscus 댓글 HTML 컴포넌트를 생성하여 반환받아 브라우저에서 Giscus 댓글 HTML 컴포넌트가 보이게 된다. 커스텀 CSS 는 이떄 서버에게 함께 보내어 <iframe> 으로 감싸진 댓글 HTML 컴포넌트 안에 <link> 태그로 가져오도록 되어있는데, 웹 페이지에서 웹 페이지를 가져온 서버가 아닌 외부 서버로부터 CSS 파일을 가져오는것이다보니 웹 브라우저에서 몇가지 보안 정책들을 적용하기에, 커스텀 CSS 가져오는데 신경써야할 보안설정들이 있다.
---

# Disqus

2019년에 SSG 기반의 기술인 Jekyll 지킬이나 Hexo 통해 기술 블로그를 만드는것이 유행이었는데, 댓글 기능은 기본적으로 서버와 데이터베이스를 저장소로 활용해야한다는 문제가 있다. SSG 활용한 블로그가 그런것이 있을리가! (물론 Supabase 같은 클라우드 DB 활용할 수도 있겠지만, 지금은 올인원 댓글 컴포넌트를 이야기하고있으니까) Disqus 는 댓글 컴포넌트 HTML 을 제공해줌과 동시에 그것에 대한 중앙 데이터베이스까지 제공해준다.

- 댓글 컴포넌트 HTML 렌더링 (iframe) + **자체 중앙 데이터베이스 제공**

# Utterance

2023년에 React 기반의 SSG 생성기인 Gatsby 기술로 블로그를 다시 새로 만들려고했을 당시에는, 댓글을 위한 데이터베이스를 활용하는것이 아닌 개인의 Github 을 하나의 저장소로 활용하려는 기술인 Utterance 가 유행이었다. Github 에서 프로젝트 관리를 함께 할 수 있도록 Project 와 Discussions 기능들을 출시한건 2023년쯤부터로 알고있고, 그 전에 사람들과 소통하는 창구인 Issues 를 활용하였는데 Utterance 는 댓글을 이 Github Issues 를 저장소로 활용하여 게시한다. 아이디어가 정말 좋은셈.

- 댓글 컴포넌트 HTML 렌더링 (iframe) + **개인 Github Issues 활용**

# Giscus

2026년에 Astro 활용하여 블로그를 개발하려고 보니 최근에는 댓글 컴포넌트로 Giscus 가 지배적으로 사용이 되고 있고 성능적으로도 훌륭하다고 하여 선택하게 되었다. 각 블로그 주인의 개인 Github 을 저장소로 활용한다는건 Utterance 와 원리는 똑같지만, Utterance 는 Github Issues 를 활용하고, Giscus 는 Github Discussions 를 활용한다는것만 다르다.

- 댓글 컴포넌트 HTML 렌더링 (iframe) + **개인 Github Discussions 활용**

## Giscus 댓글 컴포넌트 실제 렌더링 원리 - \<iframe\>

주니어 프론트엔드 개발자들에게 페이지를 구성하는 다양한 인풋, 버튼 등 HTML 컴포넌트들은 모두 직접 만들어서 사용해야하는것으로만 알고있을텐데, 실제 개발을 하다보면 외부에서 만들어진 HTML 컴포넌트들을 사용해야할때가 있다. 예를 들어, 고령의 펜션 운영자들을 위한 펜션 예약 홈페이지를 제공할때 똑같은 예약 페이지를 번거롭게 매번 펜션 예약 홈페이지마다 복사 붙여넣기하여 제공하지않고 **공통 예약 캘린더 HTML 컴포넌트**를 제공하여 어떤 펜션 주인의 홈페이지인지를 판단해 빈 방 정보를 채워서 보여주는 사례가 있다. 오늘 이야기할 댓글 컴포넌트도 많은 자체 블로그를 운영하는 개발자들을 위해 **공통 댓글 HTML 컴포넌트**를 제공하고 어떤 블로그의 글인지를 판단해 그것에 해당하는 댓글들을 채워주는것이다. **이렇게 유저가 보고있는 페이지 HTML 안에다 다른 서버에서 만든 HTML 을 가져와서 포함하기 위한 기술 중 하나를 iframe 이라고 한다.**

- 유저 브라우저 = **블로그 HTML 페이지 (부모)** + **댓글 HTML 컴포넌트 (자식)**
  - 블로그 HTML 페이지 (부모) 내 댓글 HTML 컴포넌트 (자식) 는 iframe 형태로 들어가있다
    - **블로그 HTML 페이지** (부모) 제공 서버 - 메인 페이지
    - **댓글 HTML 컴포넌트** (자식) 제공 서버 - 댓글 컴포넌트

![iframe 내 자식 컴포넌트와 그것을 품고있는 부모 페이지](./iframes-parent-and-child.png)

> 블로그 HTML 페이지 내 댓글 HTML 컴포넌트가 iframe 형태로 들어가있다

![HTML 내부에 외부로부터 가져온 HTML 이 iframe 으로 포함](./html-has-external-html-through-iframe.png)

## Giscus 댓글 컴포넌트에 대한 기존 테마 CSS 적용

블로그 HTML 페이지 내 iframe 으로 담겨있는 댓글 HTML 컴포넌트는 블로그 HTML 페이지를 가져온 원본 서버로부터 가져온것이 아니라 다른 서버로부터 가져온것이기 때문에, 브라우저는 iframe 부모 HTML 과 자식 HTML 을 격리하여 보안 상 부모가 자식의 DOM, CSSOM, JS 에 대해 접근하는것과 그 반대의 접근을 모두 막는다.

### iframe 를 경계로 부모와 자식간 **Browsing Context 분리 / 격리**

iframe 태그를 가진 부모 HTML 과 iframe 태그 내 자식 HTML 은 개별 DOM, CSSOM 트리로 렌더링하며, 브라우저의 SOP 정책을 통해 두 HTML 은 다른 서버로부터 온 자원이기 때문에 부모 HTML 에서도 자식 HTML 에 접근할 수 없고, 반대인 자식 HTML 에서도 부모 HTML 에 접근할 수 없도록 격리한다.

![iframe 을 경계로 부모 HTML 과 자식 HTML 간 격리](./browsing-context-seperation.png)

여담으로, 만약에 iframe 자식과 부모간 DOM, CSSOM 조작이나 JS 이벤트 호출과 같은 로직 연결이 필요한 상황이 있다면 PostMessage API 를 활용하여 부모 HTML 와 자식 HTML 간 데이터를 주고받도록 하면된다.

### iframe 과 비슷하지만 격리레벨이 낮은 Shadow DOM

여담으로 완전하게 격리되어있는 개별 DOM 인 \<iframe\> 과 비슷한 기술로 Shadow DOM 이라는것이 있는데, 이는 CSSOM 스타일 격리는 되어있지만, iframe 처럼 권한에 대한 SOP 격리가 없기때문에 서드파티 컴포넌트가 iframe 이 아닌 Shadow DOM 를 사용하게된다면 DOM 전역변수가 오염되거나, 여러분들이 사용하는 브라우저의 쿠키, 로컬 스토리지, 세션 등에 접근하여 데이터들을 마음대로 조작할 수 있어서 사실상 Giscus 와 같은 서드파티 컴포넌트들은 iframe 만이 유일한 선택지라고 생각하면된다.

- iframe 은 여러분들의 브라우저를 안전하게 유지하면서
    - 부모 CSS 가 댓글창 디자인을 망가뜨리지 않되 + 자식 CSS 가 부모 CSS 를 망가뜨리지 않고
    - 부모 JS 가 댓글 작성 기능을 가로채지 못하되 + 자식 JS 가 부모 JS 를 망가뜨리지 않게한다

### Giscus 댓글 컴포넌트에 대한 테마 CSS 자체 제공

앞서 말한 Browsing Context 분리로 CSS 디자인 적용에 있어서 브라우저 내에서 두 HTML 컴포넌트는 완전히 독립적으로 적용이 되기때문에, 블로그 HTML 페이지 (부모) 의 전역 CSS 설정으로 댓글 HTML 컴포넌트 (자식) 에 CSS 를 적용하거나 오버라이드 할 수 없다.

- **Browsing Context 분리 / 격리**
    - **블로그 HTML 페이지** 제공 서버 - 메인 페이지 CSS 따로
    - **댓글 HTML 컴포넌트** 제공 서버 - 댓글 컴포넌트 CSS 따로

![부모 HTML 에서 정의한 CSS 는 iframe 내 자식 HTML 에 적용되지 않음](./parent-css-cannot-be-applied-on-child-iframe.png)

그래서 Giscus 댓글 HTML 컴포넌트 제공 시 CSS 도 해당 HTML 컴포넌트에 포함시켜서 제공해야한다. CSS 자체는 외부 서버에 존재하는 경로이든, `https://giscus.app` 동일 서버에 존재하는 경로든 뭐든 상관없이 적용되는데, Giscus 는 자체적으로 `https://giscus.app` 동일 서버 내 여러 테마에 해당하는 CSS 들을 적재해놓고 서빙하고있기에 일반적으론 그 중 하나를 골라 사용한다

![Giscus 시작하기 위한 스크립트 태그 생성 시 테마 선택란 존재](./color-theme-selection-when-start-giscus.png)

> Giscus 공식 페이지 및 저장소에 여러 선택가능한 테마들이 있다

![Giscus 공식 테마 리스트](./giscus-official-themes.png)

다시 정리하자면 iframe 으로 가져온 자식 HTML 컴포넌트 디자인은 **부모가 컨트롤할 수 있는 영역이 아니라 자식 HTML 컴포넌트에 포함된 CSS 만이 조작할 수 있다는것이다.** 아래 이미지를 보면 iframe 으로 가져온 댓글 HTML 컴포넌트 내부에 <link> 태그의 href 내 `/thems/preferred_color_theme.css` 가 포함되어있는것을 볼 수 있고, 실제 그것의 링크는 상대경로임에도 불구하고 iframe 부모 서버의 경로가 아니라, iframe 자식 서버의 경인 `https://giscus.com/thems/preferred_color_theme.css` 인것으로 확인할 수 있다.

> 여러분들이 Giscus 가 제공하는 테마를 사용하고있다면 그 테마의 CSS 는 Giscus 서버에 위치한것이다

![Giscus 가 자체적으로 제공하는 Theme CSS 경로](./giscus-provided-official-theme-css.png)

## Giscus 댓글 컴포넌트에 대한 커스텀 CSS 적용

Giscus 댓글 HTML 컴포넌트에 동일 서버에서 제공하는 다양한 테마 CSS 를 적용할 수 있다는것은 알았다. 필자의 경우는 직접 블로그의 테마와 색상들을 결정하고 설정했기때문에, Giscus 기본 테마 중에는 본 블로그의 테마 색상이나 룩앤필이 맞는것이 존재하지 않았다. 그래서 직접 Giscus 각각의 HTML 요소들에 대해 커스텀하게 CSS 를 적용하려고 블로그의 전역 CSS 에 설정을 넣어도, 심지어 !important 를 추가해도 Giscus 댓글 컴포넌트는 변하지 않았었다.

이유는 당연히 **iframe 를 경계로 부모와 자식간 Browsing Context 분리 / 격리**때문에 전역 CSS 에 어떠한 설정을 해도 격리되어있는 iframe 내 댓글 HTML 에는 단 하나도 적용되지 않았던것이다. 그렇다고 Giscus 공식 홈페이지에 나 혼자 사용하고자하는 개인 테마를 만들어서 PR 올리는것은 말이 안되기에, 아래와 같은 방법을 써야했다.

### Giscus 댓글 컴포넌트에 외부에 저장된 커스텀 테마 CSS 자체 제공

직접 만든 커스텀 CSS 를 외부 서버에 저장한뒤, iframe 내부 Giscus 댓글 HTML 내 link 태그로 가져오는 CSS 경로를 우리가 정의한 외부 CSS 경로로 바꾸면된다.

- **기존** : iframe 내부 댓글 HTML 내 link 태그에 **Giscus 서버에서 제공하는 CSS 파일 제공**
- **도전** : iframe 내부 댓글 HTML 내 link 태그에 **외부 서버에서 제공하는 CSS 파일 제공**
    - **실패** : iframe 부모 CSS 에 iframe 자식 HTML 에 대한 선택자 및 !important 로 CSS 설정
        - 사유 : **iframe 를 경계로 부모와 자식간 Browsing Context 분리**

![Giscus 에 커스텀 CSS 파일을 외부 서버로부터 가져와서 적용](./apply-custom-css-from-external-server-on-giscus.png)

정확히는 Giscus 댓글을 서버로부터 만들어 가져오는 스크립트에 `data-theme` 어트리뷰트에 여러분들이 외부로부터 가져오고자하는 외부 CSS 경로를 넣어주면된다.

![Giscus 프론트엔드 옵션을 통해 테마란에 외부 CSS 경로 주입](./injecting-external-css-via-giscus-frontend-options.png)

외부 CSS 가 실제로 존재한다면 아래와 같이 원하는 CSS 가 제대로 적용되어 보이게된다. 아래 이미지를 보면 Giscus 댓글 HTML 컴포넌트들의 모든 색들이 다 빠져있는것을 확인할 수 있다.

![iframe 내부에 Giscus 서버로 생성한 HTML 내 외부 CSS 링크 설정 확인](./verify-external-css-link-in-giscus-iframe-html.png)

### (사례 1) 외부 로컬 CSS 제공 : 개발 시

블로그를 배포하기 전 Giscus 댓글을 어떻게 표기할지 디버깅을 하며 CSS 수정하기 위해서는 `http://localhost:4321` 로컬 Vite 개발서버를 통해 로컬에서 수정중인 CSS 파일을 제공해야한다. 로컬 파일의 CSS 전체 경로 URL 을 명시해주면된다.

```js
  <script
    is:inline
    src="https://giscus.app/client.js"
    data-repo="aaronryu/aaronryu.github.io"
    data-repo-id="MDEwOlJlcG9zaXRvcnkxNjMwOTgxOTc="
    data-category="Announcements"
    data-category-id="DIC_kwDOCbiuVc4C8t_o"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="http://localhost:4321/css/giscus-custom.css" // [!code highlight]
```

### (사례 2) 외부 원격 CSS 제공 : 배포 시

로컬에서 개발을 마친 CSS 파일은 원격 서버에 배포해서 Giscus 댓글 컴포넌트에 전체 URL 을 명시해주면된다. 아마 눈치챘겠지만 `data-theme` 어트리뷰트에 들어가는 값이 **상대경로**라면 Giscus 서버는 본인 `https://giscus.app` 내부에서 기본 제공하는 테마 CSS 를 찾아 적용하고, **절대경로**라면 명시되어있는 원격 서버로부터 CSS 가져와 적용한다. 외부로부터 CSS 가져오는 서버는 Github Pages 경로를 그대로 사용하는것이 제일 간편하고, Vercel, Netlify 나 AWS S3 와 같은 다른 정적 파일 저장소를 사용한다.

```js
  <script
    is:inline
    src="https://giscus.app/client.js"
    data-repo="aaronryu/aaronryu.github.io"
    data-repo-id="MDEwOlJlcG9zaXRvcnkxNjMwOTgxOTc="
    data-category="Announcements"
    data-category-id="DIC_kwDOCbiuVc4C8t_o"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="https://aws.s3-website.com/css/giscus-custom.css" // [!code highlight]
```

## Giscus 커스텀 CSS 적용 시 문제

Giscus 댓글 HTML 컴포넌트가 가져오는 외부 CSS 파일의 경로는 (사례 1) CSS 개발할때는 로컬 CSS 경로인 `http://localhost:4321/css/giscus-custom.css` 를 사용하고, (사례 2) CSS 개발할때는 원격 CSS 경로인 `https://aws.s3-website.com/css/giscus-custom.css` 를 사용한다. 이 두 사례를 통해 가져오는 외부 CSS 경로는 모두 Giscus 댓글 HTML 컴포넌트를 가져온 `https://giscus.app` 이나 Giscus 댓글 HTML 컴포넌트가 포함되어있는 메인 페이지를 가져온 경로(오리진)은 `https://aaronryu.github.io` 과 다르기때문에 브라우저는 보안 오류를 발생시킨다.

- 원본 블로그 글 페이지를 가져온 : `https://aaronryu.github.io`
  - 그 안의 Giscus 댓글 컴포넌트를 가져온 : `https://giscus.app`
    - (사례 1) 개발 시 : 외부 CSS 제공 로컬서버 `http://localhost:4321/css/giscus-custom.css`
    - (사례 2) 배포 시 : 외부 CSS 제공 원격서버 `https://aws.s3-website.com/css/giscus-custom.css`

> 댓글 컴포넌트 혹은 블로그 글 페이지를 가져온 경로와 다른 경로로부터 CSS 가져오고있다는 보안 오류

![블로그 글 페이지 혹은 그 안의 댓글 컴포넌트에서 다른 경로로부터 CSS 가져올때 CORS 에러 발생](./cors-error-when-get-css-from-another-origin-url.png)

> <b>블로그 글을 가져온 경로(오리진)</b>와 <b>블로그 내 댓글에서 외부 CSS 가져온 경로(오리진)</b>가 다르다

![블로그 글 페이지 혹은 그 안의 댓글 컴포넌트에서 다른 경로로부터 CSS 가져올때 CORS 에러 발생하는 원리](./principle-of-cors-error-when-get-css-from-another-origin-url.png)

# Giscus 커스텀 CSS 적용 시 이슈 원리 및 해결

## 브라우저 보안 정책 4) SOP (Same-Origin Policy)

브라우저는 기본적으로 HTML 에서 외부 서버로부터 CSS, 이미지, 같은 파일을 가져오거나 API 호출하는 모든것들을 막는다. 하지만 당연하게도 HTML 는 외부 서버로부터 CSS 가져와야 페이지를 화려하게 표기할 수 있고, 외부 서버로부터 이미지를 가져와야 유저들에게 다양한 사진들을 보여줄 수 있고, 외부 서버로부터 API 호출해야 데이터를 가져오거나 보내야 유저들에게 결제 등의 다양한 서비스를 제공할 수 있다. 그래서 HTML 파일을 가져온 서버가 아닌 외부 서버에 요청하는 모든것들을 보안의 입장에서 의도적인 호출인지 그렇지 않은 호출인지 구별할 수 있는 CORS 정책을 도입하여 SOP 정책을 보완한다.

> HTML 내부에서
HTML 을 가져온 경로(오리진) 서버가 아닌
다른 경로(오리진) 서버에 요청하거나, 다른 경로(오리진) 서버로부터 응답을 가져오는 모든 행위를
브라우저가 금지합니다.

## 브라우저 보안 정책 3) CORS (Cross-Origin Resource Sharing)

다시 SOP 에 대해 정리를 하자면 `https://a.com` 서버로부터 가져온 HTML 파일안에서 `https://b.com` 서버로부터 CSS 를 가져와서도 안되고, API 호출할수도 없다는 정책이다. 하지만 구글 폰트도 구글 서버로부터 가져와야하고, 외부 저장소에 저장해놓은 CSS 도 가져와야하며, 백엔드 서버로부터 API 호출도 해야하기에 이 정책은 현실적이지는 않아서 CORS 정책이라는 예외 정책을 두어 특정 조건이 되는 경우에만 허용하도록 되어있다.

> CSS, 폰트 등 에셋과 API 호출은 외부 서버로부터 가져올수밖에 없어서 CORS 예외 정책으로 일부만 허용

CSS 등의 자원이나 API 를 제공하는 원격 서버가 어떤 경로(오리진)의 HTML 에서 호출할 수 있는지 허용된 경로(오리진)을 헤더로 응답과 함께 반환하면, 브라우저는 서버가 헤더로 반환해준 허용된 경로(오리진)가 현재 HTML 의 경로(오리진)과 일치하는지 검사한 후 일치하는 경우에 자원을 사용할 수 있게 허용하고 / 그렇지 않으면 폐기한다.

Giscus 댓글 HTML 컴포넌트는 `https://giscus.app` 서버로부터 가져왔지만, Giscus 댓글 HTML 컴포넌트가 참조하려는 외부 CSS 출처는 <b>(사례 1) 개발 시 : 로컬 `http://localhost:4321` 서버</b> 혹은 <b>(사례 2) 배포 시 : 원격 `https://aws.s3-website.com` 서버</b>이기에 SOP 위반이 되어, CORS 예외 정책을 통해 브라우저가 허용할 수 있게해야합니다.

- 원본 블로그 글 페이지를 가져온 : `https://aaronryu.github.io`
  - 그 안의 Giscus 댓글 컴포넌트를 가져온 : `https://giscus.app` ← 외부 CSS 호출의 오리진은 이것
    - (사례 1) 개발 시 : 외부 CSS 제공 로컬서버 `http://localhost:4321/css/giscus-custom.css`
      - `http://localhost:4321` 서버에 `https://giscus.app` 서 가져온 HTML 에서 호출허용
    - (사례 2) 배포 시 : 외부 CSS 제공 원격서버 `https://aws.s3-website.com/css/giscus-custom.css`
      - `https://aws.s3-website.com` 서버에 `https://giscus.app` 서 가져온 HTML 에서 호출허용

참고로 브라우저 샌드박스 원칙에 따라 외부 CSS 호출을 한 오리진을 '브라우저 주소창에 표기된 원본 블로그 글 페이지의 오리진'인 `https://aaronryu.github.io` 가 아닌, '실제로 외부 CSS 요청을 보낸 iframe 내 댓글 컴포넌트의 오리진인 `https://giscus.app` 가 되어, 외부 CSS 제공 서버의 CORS 허용 Origin 설정 시 `https://aaronryu.github.io` 가 아닌 `https://giscus.app` 를 추가해야한다.

### (사례 1) 개발 시 : 외부 로컬 CSS 제공 서버 `http://localhost:4321` 내 CORS 설정

Astro 개발을 위해 사용하는 로컬 Vite 개발서버 설정에 CORS 허용설정을 추가하면 된다. 

```jsx
export default defineConfig({
  // ...
  vite: {
    server: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  },
});
```

하지만 로컬에서는 이렇게 설정하여 CORS 정책에 통과한다해도 여전히 오류가 발생하는데, 후술할 브라우저 보안 정책 Mixed Content (HTTPS + HTTP) 와 PNA (Private Network Access) 때문이다.

![여전히 로컬 http://localhost:4321 서버에서 가져온 CSS 에 CORS 에러 발생](./cors-error-when-get-css-from-another-origin-url.png)

### (사례 2) 배포 시 : 외부 로컬 CSS 제공 서버 `http://aws.s3-website.com` 내 CORS 설정

외부 CSS 저장소로 Netlify, Vercel, AWS S3 등을 사용한다면 각 벤더사의 설정 방식에 맞게 Access-Control-Allow-Origin 설정으로 `https://giscus.app` 혹은 * 전체 허용을 해주면 된다. AWS S3 는 아래와 같이 버킷마다 CORS 정책을 정의할 수 있도록 제공되며, 일반적으로 AWS S3 같은 정적 데이터 제공서버는 CSS, 이미지, 영상 등의 데이터 제공목적을 위해 CORS 정책 허용 오리진에 * 전체 허용을 한다.

![AWS S3 상에서 CORS 설정하는 부분](./aws-s3-cors-configuration.png)

### (사례 2) 배포 시 : 외부 로컬 CSS 제공 서버 `http://aaronryu.github.io` 내 CORS 설정

외부 CSS 저장소로 GitHub Pages 를 사용한다면 이미 설정이 되어있어 아무런 설정이 필요하지않다.

> GitHub Pages 는 기본적으로 모든 공개 리소스에 대해 `Access-Control-Allow-Origin: *` 헤더 제공

본 블로그에서 Giscus 를 위한 커스텀 CSS 를 어자피 SSG 정적으로 생성된 블로그 HTML 자체를 `https://aaronryu.github.io` 으로 서빙하고있기때문에 CSS 도 해당 Github Pages 를 사용하기로 결정하였다. 일반적으로 Github Pages 통해 블로그에 필요한 모든 폰트나 CSS, 이미지 등의 모든 자원들을 한데 모아서 저장소처럼 활용하기에 이상한 접근도 아닐뿐더러, Github Pages 는 본 서버로 서빙하는 모든 자원들에 대해 기본적으로 CORS 정책을 모두 오픈해놓았다. 그도 그럴것이 AWS S3 처럼 정적 저장소로도 충분히 활용가능하기때문이다. 그래서 따로 여러분들이 CORS 설정을 하지 않아도 정상적으로 외부 CSS 를 가져와 사용할 수 있다.

![Github Pages 는 기본적으로 모든 공개 리소스에 CORS 모두 허용 헤더 설정](./github-pages-set-cors-for-all.png)

이처럼 (사례 2)에서는 외부 CSS 조회해오는 원격 서버에 Giscus 댓글 HTML 컴포넌트의 오리진인 `https://giscus.app` CORS 정책 설정만하면 모든게 해결이 된다.

하지만 (사례 2)에서는 `http://localhost:4321` 로컬서버에서 제공하는건 여전히 2가지에서 불가능하다. 첫번째로 웹 브라우저에서 HTTPS 으로 받은 HTML 파일 내에서 CSS 파일을 HTTP 로 받으려는 시도를 막고, 두번째로는 웹 브라우저에서 `http://localhost:4321` 루프백 주소 혹은 `http://192.168.0.7:4321` 사설 주소로부터 자원을 받는 시도를 막기 때문이다.

## 브라우저 보안 정책 2) Mixed Content (HTTPS + HTTP)

브라우저는 SOP + CORS 정책에 따라 가져오려는 자원이나 호출하려는 API 를 제공하는 서버의 오리진과, 자원을 가져오거나 API 를 호출하려는 페이지를 가져온 서버의 오리진이 일치하는지 여부를 매우 섬세하게 체크한다. 오리진은 `localhost` 만을 의미하는 도메인과 달리 `http://localhost:4321` 이렇게 HTTP/HTTPS Schema 와 포트 번호까지를 총괄하는 개념이기에, 자원을 제공하는 서버의 오리진이 `http://` 이고 자원을 호출하는 페이지의 서버 오리진이 `https://` 라면 HTTP/HTTPS Schema 가 다르기떄문에 오리진이 다르다고 판단을 한다.

Mixed Content 는 오리진 기반의 CORS 정책과 유사하나, 그것보다는 조금 더 좁은 범주의 보안 정책으로 `https://` 페이지안에서 `http://` 자원(CSS, JS)을 가져올 수 없다는 보안 정책이다. HTTPS 안전한 통로로 가져온 HTML 페이지 내부에서 HTTP 안전하지 않은 통로로 자원(CSS, JS) 를 가져오게된다면, 공인 CA 인증을 받지않아 해커가 공격을 위해 만든 컨텐츠일 수 있어 그 작은 컨텐츠가 전체 보안을 무너뜨릴 수 있기때문에 허용하지 않는것이다.

- 원본 블로그 글 페이지를 가져온 : `https://aaronryu.github.io`
  - 그 안의 Giscus 댓글 컴포넌트를 가져온 : `https://giscus.app` = **HTTPS 컨텐츠**
    - (사례 1) 개발 시 : 외부 CSS 제공 로컬서버 `http://localhost:4321/css/giscus-custom.css`
    - = **HTTP 컨텐츠** → 따라서 **HTTPS** 로 가져온 댓글 HTML 에서 **HTTP** 인 외부 CSS 를 가져올 수 없다

HTTPS 보안 정책의 일환으로, CORS 가 허용되어있다하더라도 막아버려서 로컬 서버의 CSS 는 사실상 사용불가하다. 로컬 환경에 있는 로컬 서버는 로컬 서버 스스로를 신뢰할 수 있는 CA 인증기관으로 임의 등록을 하고, 자가 서명한 인증서를 발행을 하고, 로컬 DNS 에 도메인 등록까지하는 방법으로 HTTPS 적용을 하지 않는 이상 (북치고 장구치고) `http://localhost:4321` 에 대해 HTTPS 적용을 할 수 없기 때문이다.

### 브라우저 보안 정책 1) PNA (Private Network Access)

또한 `http://localhost:4321` 로컬 서버로부터 외부 CSS 파일을 가져와서 사용할 수 없는 이유 중의 남은 하나는 브라우저는 HTML 페이지에서 외부 자원을 호출할때 `localhost` 루프백 주소 혹은 `192.168.0.7` 사설 주소에 접근하는것을 막는 정책이다. SOP + CORS 정책이 HTML 페이지를 가져온 오리진이 아닌 외부 서버에 접근하는것을 차단했던 이유가 외부 서버에 대한 악의적 요청 공격으로 악용될 수 있기때문이었다. 이토록 HTML 페이지를 가져온 오리진이 아닌 외부 서버에 접근하는것 자체가 기본적으로 위험한데 그 외부 서버가 만약 여러분들의 로컬 서버 혹은 회사의 중요한 정보들을 담고있는 (외부와 격리된) 사설 서버라면 그것은 정말로 더 위험한 상황일 수 밖에 없다. 따라서 만약 HTML 페이지에서 로컬 서버 혹은 사설 서버에 접근하려고한다면 브라우저는 PNA 정책을 통해 그것을 필사적으로 막아낸다. 

- 브라우저는 우리가 접속하는 네트워크를 보안 등급에 따라 크게 세 가지 영역으로 나눈다
  - **Public 공용 주소** : `giscus.app`, `aaronryu.github.io`, `google.com`
  - **Private 사설 주소** : `192.168.0.7`
  - **Local 루프백 주소** : `localhost`, `127.0.0.1` 
- 웹 브라우저는 HTML 에서 이 중 로컬 서버나 사설 서버에 접근하는것을 모두 원천적으로 막는다
  - PNA 보안의 원칙은 넓은 영역인 공용 주소에서부터 좁은 영역인 아래 주소로의 접근을 막는것
    - **Private 사설 주소**에 대한 접근 : `http://localhost:4321`
    - **Local 루프백 주소**에 대한 접근 : `http://192.168.0.7:4321`

다만 대기업에서 어쩔 수 없이 외부 자원을 사설 서버로부터 가져오는 경우가 있을 수 있는데, 이 경우엔 CORS 정책 설정과 마찬가지로 해당 사설 서버에서 PNA 전용 헤더 `Access-Control-Allow-Private-Network: true` 를 추가해준다면 Preflight 인 OPTION 요청을 통해 확인하고, 문제없이 자원을 가져올 수 있다.

# 브라우저 보안 정책 정리

눈치가 빠른 독자는 브라우저 보안 정책을 설명할때 숫자가 역순으로 되어있는것을 발견했을텐데, 이는 브라우저가 외부 자원(이번 예시에서는 CSS)을 가져올때 고려하는 보안 정책이 적용되는 순서이다.

- 브라우저 보안 정책
  - 1) **PNA** (Private Network Access) - 망 보안
    - 본 HTML 페이지에서 외부 자원을 가져올때 **"로컬이나 사설망에 접근하는가?"**
  - 2) **Mixed Content** (HTTPS + HTTP) - 전송 보안
    - 본 HTML 페이지에서 외부 자원을 가져올때 **"HTTP 서버로부터 가져오는가?"**
  - 3) **CORS** (Cross Origin Resource Sharing) - 예외 허용
    - 본 HTML 페이지에서 외부 자원을 가져올때 **"서버가 호출 및 사용을 허가했는가?"**
  - 4) **SOP** (Same Origin Policy) - 근본 원칙
    - 본 HTML 페이지에서 외부 자원을 가져올때 **"페이지와 다른 오리진에 접근하는가?"**

![브라우저의 보안 정책들](./browser-security-policies.png)

CORS 는 SOP 정책의 예외 빗장을 열어주는 보완 정책이라보면되고, PNA 와 Mixed Content 는 SOP 정책을 보완해주는 독립적인 추가 정책인것이다.

# 번외 : 로컬 localhost 에서도 HTTPS 적용 및 도메인 설정하기

## 직접 HTTPS 할당 및 도메인 설정

로컬 localhost 서버에 HTTPS 적용을 위해서는 SSL 인증서를 발급하면된다. OpenSSL 통해서 ① **루트 CA(인증기관) 인증서**를 만들어서 도메인 인증서를 발행할 수 있는 자격을 얻고 ② 앞선 루트 CA 인증서를 기반으로 **도메인 인증서**를 서명 및 발급하면되고, 이렇게만하면 신뢰할 수 없는 기관에서 인증한 도메인 인증서라는 오류가 브라우저에 뜨게되니 가장 먼저 발급했던 ① **루트 CA(인증기관) 인증서**를 운영체제나 브라우저의 신뢰할 수 있는 루트 CA 인증서 목록에 추가까지 해야한다.

이 절차 자체가 번거롭고 귀찮기때문에 `mkcert` 유틸리티를 통해 ① `mkcert -install` 명령어로 루트 CA 인증서 생성 및 목록에 추가까지 자동으로 한 뒤, ② `mkcert localhost` 명령어로 도메인 인증서를 서명하고 발급도 한번에 손쉽게 하면 된다.

도메인의 경우에는 맥북 유저의 경우 로컬 DNS 파일 `/etc/hosts` 내 `127.0.0.1` 에 대한 원하는 도메인명을 넣어주기만 하면된다. 물론 Mixed Content (HTTPS + HTTP) 오류는 앞선 도메인 인증서 자가 발행을 통해 해결했지만 도메인명을 할당해도 여전히 로컬 or 사설 서버로 인지되어 브라우저에서 막히기 때문에 PNA 전용 헤더 `Access-Control-Allow-Private-Network: true` 를 추가해줘야한다는 점을 꼭 유념하라.

```jsx
export default defineConfig({
  // ...
  vite: {
    server: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Private-Network": true, // [!code highlight]
      },
    },
  },
});
```

## 자동 HTTPS 할당 및 도메인 할당

`ngrok` 이나 `localtunnel` 유틸리티를 활용하면 외부에 배포되어있는 HTTPS 적용 및 도메인이 할당되어있는 서버에 로컬을 연결하여, 로컬이 해당 서버와 동일한 서버처럼 동작되게 할 수 있다. 리버스 프록시 터널링 (Reserse Proxy Tunneling) 기술을 활용한것인데, 로컬에 `localtunnel` 클라이언트를 설치하여 원격 `localtunnel` 서버에게 아웃바운드 커넥션을 요청하면서 UDP Hole Punching 과 유사한 방식으로 원격 `localtunnel` 서버와 연결 및 방화벽을 통과시켜놓고, 외부에서 원격 `localtunnel` 서버에 하는 모든 요청들을 로컬 `localtunnel` 클라이언트에게 보내어 내 서버를 외부에 열어놓는것과 동일한 효과를 내는것이다. 이렇게 외부 서버에서 요청을 받아 로컬 서버로 전달해주기때문에 이를 리버스 프록시 터널링 (Reserse Proxy Tunneling) 이라고 부르는것이다.

---
