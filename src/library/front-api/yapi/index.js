import axios from 'axios'
export default () => {
    const apiYapi = axios.create({
        headers: {
            'Content-type': 'application/json',
        },
        adapter: require('axios/lib/adapters/http')
    })
    apiYapi.interceptors.response.use(response => response.data.data)
    return apiYapi
}