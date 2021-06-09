module.exports = {
    pluginOptions: {
        electronBuilder: {
            // vue 里面使用electron需要的配置，否则会报错
            // 具体请看 https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html
            nodeIntegration: true,
        }
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            title: '前端开发助手',
        },
    }

}