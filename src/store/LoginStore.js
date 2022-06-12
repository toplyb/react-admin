import {makeAutoObservable} from "mobx";
import {deleteToken, getToken, http, setToken} from "@/utils";

class LoginStore{
  token = getToken() || ''

  constructor() {
    makeAutoObservable(this)
  }

  login = async ({mobile, code}) => {
    const data = await http.post('/authorizations', {
      mobile,
      code
    })
    this.token = data.data.token

    setToken(this.token)
  }

  logout = () => {
    this.token = ''
    deleteToken()
  }
}

export default LoginStore
