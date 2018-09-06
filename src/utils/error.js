import { Message } from 'element-ui'

export default function ErrorMsg(res) {
  if (res.code !== 200) {
    const msg = res.msg || '网络请求错误'
    Message.error({
      message: msg,
      type: 'error'
    })
  }
}
