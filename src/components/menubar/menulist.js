exports.menus = [
  { to: '/dev', label: 'Development',
    subMenu: [
      { to: '/home', label: 'Home', component: 'src/pages/about/index.tsx' }
      // category 에서 list 가 딱 1개인 경우
      // category 에서 list 가 딱 1개인데, sub 가 있는경우 -> component 안만들고 submenu 로 가기
      // - submenu 만들었는데 list 가 없으면 본 메뉴 parent 까지 쭉 올라가서 메뉴 지우기 - 본 카테고리 안에 글이 없기 때문 (버그 상황)
    ]
  },
  { to: '/topiclog', label: 'Politics' },
  { to: '/journal', label: 'Economics' },
  { to: '/homo', label: 'Homo Sapience',
    subMenu: [
      { to: '/js', label: 'Javascript' },
      { to: '/css', label: 'CSS' },
      { to: '/spring', label: 'Spring',
        subMenu: [
          { to: '/spring', label: 'Spring' },
        ]
      },
    ]
  },
  { to: '/about', label: 'About', component: 'src/pages/about/index.tsx' },
]
