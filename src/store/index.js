import React from "react";
import LoginStore from "@/store/LoginStore";
import UserStore from "@/store/UserStore";
import ChannelStore from "@/store/ChannelStore";

class IndexStore{
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new ChannelStore()
  }
}

const indexStore = new IndexStore()
const context = React.createContext(indexStore)
// 通过 useContext 拿到 IndexStore 的实例对象然后返回
const useStore = () => React.useContext(context)

export {useStore}
