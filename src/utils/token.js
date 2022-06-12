const key = 'xiaosheng-key'

const setToken = (value) => {
  return window.localStorage.setItem(key, value)
}

const getToken = () => {
  return window.localStorage.getItem(key)
}

const deleteToken = () => {
  return window.localStorage.removeItem(key)
}

export {
  setToken,
  getToken,
  deleteToken
}

