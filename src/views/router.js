const routers = [{
        path: '/',
        component: require('./index.vue').default,
        redirect: 'setting',
        children: [{
                path: 'git',
                name: 'git',
                redirect: 'git/repository',
                component: require('./git/index.vue').default,
                meta: {
                    title: '仓库管理'
                },
                children: [{
                        path: 'repository',
                        name: 'git.repository',
                        component: require('./git/repository/index.vue').default,
                        meta: {
                            title: '仓库列表'
                        },
                    },
                    {
                        path: 'branch',
                        name: 'git.branch',
                        component: require('./git/branch/index.vue').default,
                        meta: {
                            title: '分支管理'
                        },
                    },
                    {
                        path: 'cherry-pick',
                        name: 'git.cherry-pick',
                        component: require('./git/cherry-pick/index.vue').default,
                        meta: {
                            title: 'cherry-pick'
                        },
                    }
                ]
            },
            {
                path: 'swagger',
                name: 'swagger',
                redirect: 'swagger/project',
                component: require('./swagger/index.vue').default,
                meta: {
                    title: 'swagger'
                },
                children: [{
                        path: 'project',
                        name: 'swagger.project',
                        component: require('./swagger/project/index.vue').default,
                        meta: {
                            title: '项目列表'
                        },
                    },
                    {
                        path: 'interface',
                        name: 'swagger.interface',
                        component: require('./swagger/interface/index.vue').default,
                        meta: {
                            title: '接口管理'
                        },
                        redirect: 'swagger.interface.list',
                        children: [{
                                path: 'list',
                                name: 'swagger.interface.list',
                                component: require('./swagger/interface/list/index.vue').default,
                                meta: {
                                    title: '接口列表'
                                },
                            },
                            {
                                path: 'details',
                                name: 'swagger.interface.details',
                                component: require('./swagger/interface/details/index.vue').default,
                                meta: {
                                    title: '接口详情'
                                },
                            }
                        ]
                    }
                ]
            },
            {
                path: 'yapi',
                name: 'yapi',
                redirect: 'yapi/project',
                component: require('./yapi/index.vue').default,
                meta: {
                    title: 'yapi'
                },
                children: [{
                        path: 'project',
                        name: 'yapi.project',
                        component: require('./yapi/project/index.vue').default,
                        meta: {
                            title: '项目列表'
                        },
                    },
                    {
                        path: 'interface',
                        name: 'yapi.interface',
                        component: require('./yapi/interface/index.vue').default,
                        meta: {
                            title: '接口管理'
                        },
                        redirect: 'yapi.interface.list',
                        children: [{
                                path: 'list',
                                name: 'yapi.interface.list',
                                component: require('./yapi/interface/list/index.vue').default,
                                meta: {
                                    title: '接口列表'
                                },

                            },
                            {
                                path: 'details',
                                name: 'yapi.interface.details',
                                component: require('./yapi/interface/details/index.vue').default,
                                meta: {
                                    title: '接口详情'
                                },
                            }
                        ]
                    }
                ]
            },
            {
                path: 'doc',
                name: 'doc',
                component: require('./doc/index.vue').default,
                meta: {
                    title: '文档'
                }
            },
            {
                path: 'setting',
                name: 'setting',
                component: require('./setting/index.vue').default,
                meta: {
                    title: '设置'
                }
            },
        ],
    },
    {
        path: '*',
        redirect: '/'
    }
]
export default routers