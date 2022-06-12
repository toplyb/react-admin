import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select, message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useStore} from "@/store";
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {http} from "@/utils";

const { Option } = Select

const Publish = () => {

  const formRef = useRef()

  const [params] = useSearchParams()
  const id = params.get('id')
  useEffect(() => {
    const getDetail = async () => {
      const {data} = await http.get(`/mp/articles/${id}`)
      if (data.cover.type === 2) {
        data.cover.type = 3
      }

      formRef.current.setFieldsValue({...data, type: data.cover.type})

      const formatImageList = data.cover.images.map(item => ({ url:item }))

      setImgCount(data.cover.type)
      setFileList(formatImageList)
      saveImageList.current = formatImageList
    }
    if (id) {
      getDetail()
    }
  }, [id])

  const {channelStore} = useStore()

  const saveImageList = useRef()
  const [fileList, setFileList] = useState([])
  const onUploadImage = ({fileList}) => {
    const images = fileList.map(item => {
      if (item.response) {
        return {
          url: item.response.data.url
        }
      }
      return item
    })
    setFileList(images)
    saveImageList.current = images
  }


  const [imgCount, setImgCount] = useState(1)
  const changeRadio = (e) => {
    setImgCount(e.target.value)

    if (saveImageList.current) {
      if (e.target.value === 1) {
        setFileList([saveImageList.current[0]])
      } else if (e.target.value === 3) {
        setFileList(saveImageList.current)
      }
    }
  }

  const navigate = useNavigate()
  const submitArticle = async (value) => {
    const params = {
      ...value,
      cover: {
        type: value.type,
        images: fileList.map(item => {
          return item.url
        })
      }
    }

    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`,params)
    } else {
      await http.post('/mp/articles?draft=false', params)

    }
    navigate('/article')
    message.success(`${id ? '更新' : '发布'}成功`)
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              { id ? '编辑':'发布' }文章
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1,content: '' }}
          onFinish={submitArticle}
          ref={formRef}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeRadio}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {
              imgCount > 0 && (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList
                  action="http://geek.itheima.net/v1_0/upload"
                  fileList={fileList}
                  onChange={onUploadImage}
                  multiple={imgCount > 1}
                  maxCount={imgCount}
                >
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                  </div>
                </Upload>
              )
            }

          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                { id ? '编辑':'发布' }文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)
