import {Link, useNavigate} from 'react-router-dom'
import {Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import img404 from '@/assets/error.png'
import {useEffect, useState} from "react";
import {http} from "@/utils";
import {useStore} from "@/store";
import {observer} from "mobx-react-lite";

const {Option} = Select
const {RangePicker} = DatePicker

const Article = () => {
  const {channelStore} = useStore()

  const search = (value) => {
    const {channel_id, date, status} = value
    const params = {}
    if (status !== -1) {
      params.status = status
    } else {
      params.status = undefined
    }
    if (channel_id && channel_id !== -1) {
      params.channel_id = channel_id
    }
    if (channel_id === -1) {
      params['channel_id'] = undefined
    }
    if (date) {
      params.begin_pubdate = date[0].format('YYYY-MM-DD')
      params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setArticleParams({
      ...articleParams,
      ...params
    })
  }

  const deleteArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    setArticleParams({
      ...articleParams,
      page: 1
    })
  }

  const navigate = useNavigate()
  const editArticle = async (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt=""/>
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => {
        let color = 'green'
        let text = '审核通过'
        if (data === 0) {
          color = 'gold'
          text = '草稿'
        } else if (data === 1) {
          color = 'orange'
          text = '待审核'
        } else if (data === 3) {
          color = 'red'
          text = '审核失败'
        }
        return (
          <Tag color={color}>{text}</Tag>
        )
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => editArticle(data)}/>
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined/>}
              onClick={() => deleteArticle(data)}
            />
          </Space>
        )
      }
    }
  ]

  const [articleList, setArticleList] = useState({
    list: [],
    count: 0
  })
  const [articleParams, setArticleParams] = useState({
    page: 1,
    per_page: 10
  })

  const getArticleList = async () => {
    const {data} = await http.get('/mp/articles', {params: articleParams})
    setArticleList({
      list: data.results,
      count: data.total_count
    })
  }
  useEffect(() => {
    getArticleList()
  }, [articleParams])

  const nextPage = (page) => {
    setArticleParams({
      ...articleParams,
      page
    })
  }

  return (
    <div>
      <Card
        title={<Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to="/home">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>内容管理</Breadcrumb.Item>
        </Breadcrumb>}
        style={{marginBottom: 20}}
      >
        <Form onFinish={search} initialValues={{status: -1}}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{width: 200}}
            >
              {channelStore.channelList.map(item => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{marginLeft: 80}}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`根据筛选条件共查询到 ${articleList.count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={articleList.list} pagination={{
          pageSize: articleParams.per_page,
          total: articleList.count,
          onChange: nextPage
        }}/>
      </Card>
    </div>
  )
}

export default observer(Article)
