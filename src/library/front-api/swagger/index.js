import axios from 'axios'
export default () => {
    const apiSwagger = axios.create({
        headers: {
            'Content-type': 'application/json',
        },
        adapter: require('axios/lib/adapters/http')
    })
    apiSwagger.interceptors.response.use(response => response.data.data ? JSON.parse(response.data.data) : response.data)
    return apiSwagger
}