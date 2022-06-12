import {makeAutoObservable} from "mobx";
import {http} from "@/utils";

class ChannelStore{
  channelList = []

  constructor() {
    makeAutoObservable(this)
  }

  getChannelList = async () => {
    const res = await http.get('/channels')
    this.channelList = res.data.channels
    this.channelList.unshift({id: -1, name: '全部'})
  }

}

export default ChannelStore
