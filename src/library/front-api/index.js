export default ({Vue}) => {
    Vue.$ctx.apiSwagger = require('./swagger').default(Vue)
    Vue.$ctx.apiYapi = require('./yapi').default(Vue)
}