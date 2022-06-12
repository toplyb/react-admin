import {Card, Form, Input, Button, message} from "antd";
import logo from '@/assets/logo.png'
import './index.scss'
import {useStore} from "@/store";
import {useNavigate} from 'react-router-dom'

function Login() {

  const {loginStore} = useStore()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    await loginStore.login(values)
    message.success('登录成功')
    navigate('/', {replace: true})
  }

  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo} alt=""/>

        <Form initialValues={{agree: true, mobile: '13811111111', code: '246810'}} validateTrigger={['onChange']} onFinish={onFinish}>
          <Form.Item name='mobile' rules={
            [
              { required: true, message: '请输入手机号' },
              {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', validateTrigger: 'onChange'}
            ]}>
            <Input defaultValue='13811111111' placeholder='请输入手机号'></Input>
          </Form.Item>

          <Form.Item name='code' rules={[{ required: true, message: '请输入验证码' }]}>
            <Input defaultValue='246810' placeholder='请输入验证码'></Input>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
