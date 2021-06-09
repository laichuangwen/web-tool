import createApp from './library/front-create-app';
const app = createApp()
app
.task('工具方法', app => require('./library/front-util/index').default(app))
.task('请求处理', app => require('./library/front-api/index').default(app))
.task('状态管理', app => require('./library/front-store').default(app))
.task('重置css样式', () => require('./library/front-reset-css').default())
.task('iconfont图标', () => require('./library/front-icon').default())
.task('elementUI组件', app => require('./library/front-element-ui').default(app))
.task('路由', [], app => require('./library/front-router').default(app))
.task('初始化路由',['路由'], ({Vue}) => {
  Vue.$ctx.router.addRoutes(require('./views/router').default)
})
.task('初始化持久化存储',['初始化路由','工具方法'], app => require('./library/electron-store').default(app))
.task('初始化状态管理',['初始化持久化存储'],({Vue}) => {
  // 用户store
  Vue.$ctx.store.registerModule(['doc'],require('./views/store').default)
  
})
.use(app.getAllTask())
.start()
window.Vue = app.Vue