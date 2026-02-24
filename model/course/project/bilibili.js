module.exports = {
  name: 'B站课堂',
  desc: 'B站课堂系统',
  homePage: '/todo?proj_key=bilibili&key=video',
  menu: [
    {
      key: 'video',
      name: '视频管理 (B站)',
    },
    {
      key: 'user',
      name: '用户管理 (B站)',
    },
    {
      key: 'course-material',
      name: '课程资料',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'pdf',
            name: 'PDF资料',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'excel',
            name: 'Excel资料',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'ppt',
            name: 'PPT资料',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
        ],
      },
    },
  ],
}
