exports.menus = [
  { to: '/dev', label: 'Development',
    subMenu: [
      { to: '/home', label: 'Home', component: 'src/pages/about/index.tsx' }
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
  { to: '/about', label: 'About', component: 'src/pages/about/index.tsx' },
]
