import { Layout, Menu, Popconfirm } from 'antd'
import {HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined} from '@ant-design/icons'
import './index.scss'
import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom'
import {useStore} from "@/store";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";

const { Header, Sider } = Layout

const MyLayout = () => {

  const {pathname} = useLocation()

  const {userStore, loginStore, channelStore} = useStore()

  useEffect(() => {
    userStore.getUserInfo()
    channelStore.getChannelList()
  }, [userStore, channelStore])

  const navigate = useNavigate()
  const logout = () => {
    loginStore.logout()
    navigate('/login')
  }
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to='/'>数据概览</Link>
    },
    {
      key: '/article',
      icon: <DiffOutlined />,
      label: <Link to='/article'>内容管理</Link>
    },
    {
      key: '/publish',
      icon: <EditOutlined />,
      label: <Link to='/publish'>发布文章</Link>
    }
  ]

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              onConfirm={logout}
              title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>

      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(MyLayout)
