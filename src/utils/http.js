import axios from "axios";
import {getToken} from "@/utils/token";
import {history} from "@/utils/history";

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: '5000'
})

http.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  return response.data
}, error => {
  if (error.response.status === 401) {
    history.push('/login')
  }
  return Promise.reject(error)
})

export {http}
