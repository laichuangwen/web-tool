export default {
    namespaced: true,
    state: {
        url: '',
    },
    mutations: {
        setUrl(state, val) {
            state.url = val
        }
    },
    getters: {}
}