module.exports = {
    pluginOptions: {
        electronBuilder: {
            // vue 里面使用electron需要的配置，否则会报错
            // 具体请看 https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html
            nodeIntegration: true,
            externals: ['my-native-dep'],
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules']
        }
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            title: '前端开发助手',
        },
    },
    configureWebpack: {
        devtool: 'source-map'
    }

}