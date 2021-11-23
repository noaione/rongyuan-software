import React, { Fragment, useState } from 'react'

import { dj } from '../../../dj'
import { res } from '../../../res'

import { store } from '../../store'
import { Login } from './Login'
import { _2500ms消失文字 } from '../../utils/_2500ms消失文字'
import { webServerCompose } from './User'

export const ForgetPassword = () => {
  const [email, setEmail] = useState('')

  const sendEmail = async () => {
    if (res.regexp.email.test(email) === false) {
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text={'请输入正确的邮箱'} />
      )
    } else webServerCompose('forgetPassword')({ email })
  }

  return (
    <Fragment>
      <dj.View w={370} h={330} x={416} y={170} form={'弹出框'}>
        <dj.Text h={25} y={23} text={'忘记密码'} type={'个人中心标题'} />
        <dj.Line y={53} lineColor={'UserVerify'}></dj.Line>
        <dj.Text
          h={18}
          y={124}
          text={'为了您的账户安全我们将发送一条验证码至您的邮箱'}
          type={'启动页搜索'}
        />

        <dj.Button
          w={12}
          h={12}
          x={36}
          y={26}
          img={{
            size: {
              w: 12,
              h: 12,
            },
            src: res.img.return,
          }}
          clickHandle={() => store.setState.user_UI(<Login />)}
        />
        <dj.TextInput
          w={300}
          h={34}
          x={35}
          y={76}
          type={'Center'}
          usePlaceholder={res.useString.输入您的邮箱}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <dj.Button
          w={300}
          h={36}
          x={35}
          y={193}
          mode={'Sparker'}
          text={'发送'}
          clickHandle={sendEmail}
        />
        <dj.Button
          w={12}
          h={12}
          x={321}
          y={26}
          img={{
            size: {
              w: 12,
              h: 12,
            },
            src: res.img.close,
          }}
          clickHandle={() => {
            store.setState.userOpen(false)
            store.setState.user_UI(<Login />)
            store.setState.user_warningText('')
          }}
        />
      </dj.View>
    </Fragment>
  )
}
