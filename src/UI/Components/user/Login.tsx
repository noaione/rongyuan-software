import React, { Fragment, useState } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { store } from '../../store'
import { ForgetPassword } from './ForgetPassword'
import { Register } from './Register'
import { _2500ms消失文字 } from '../../utils/_2500ms消失文字'
import { webServerCompose } from './User'
import { kCompany, login_logo_p, urlStr } from '../../../appConfig'

export const Login = () => {
  const [state, setstate] = useState({
    email: '',
    password: '',
  })

  // tslint:disable-next-line: only-arrow-functions

  const onLogin = () => {
    if (state.email === '' || state.password === '')
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='请将所有的内容填满噢' />
      )
    else if (res.regexp.email.test(state.email) === false)
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='请输入正确的邮箱' />
      )
    else webServerCompose('login')(state)
  }

  return (
    <Fragment>
      <dj.View w={370} h={406} x={416} y={161} form={'弹出框'}>
        <dj.Img w={32} h={29} x={168} y={31} imgBg={urlStr(login_logo_p)} />
        <dj.Text
          h={25}
          y={68}
          type={'个人中心标题'}
          text={res.string.登录}></dj.Text>
        <dj.TextInput
          w={250}
          h={34}
          x={51}
          y={122}
          usePlaceholder={res.useString.邮箱}
          value={state.email}
          onChange={(event) =>
            setstate({ ...state, email: event.target.value })
          }
        />
        <dj.Line w={300} x={35} y={154} lineColor={'User'}></dj.Line>
        <dj.TextInput
          w={250}
          h={34}
          x={51}
          y={172}
          type={'密码'}
          usePlaceholder={res.useString.密码}
          value={state.password}
          onChange={(event) =>
            setstate({ ...state, password: event.target.value })
          }
        />

        <dj.Button
          w={66}
          h={17}
          x={263}
          y={179}
          mode={'Bluer'}
          text={'忘记密码?'}
          clickHandle={() => store.setState.user_UI(<ForgetPassword />)}
        />
        <dj.Line w={300} x={35} y={204} lineColor={'User'}></dj.Line>
        <dj.Button
          w={300}
          h={36}
          x={35}
          y={237}
          mode={'Sparker'}
          text={res.string.登录}
          clickHandle={onLogin}
        />
        <dj.Line w={86} x={35} y={302} lineColor={'User'}></dj.Line>
        <dj.Text y={295} type={'user提示'} text={'尚未注册账号?'} />
        <dj.Line w={86} x={248} y={302} lineColor={'User'}></dj.Line>
        <dj.Button
          w={300}
          h={36}
          x={35}
          y={330}
          mode={'Border'}
          text={res.string.注册}
          clickHandle={() => store.setState.user_UI(<Register />)}
        />
        <dj.Button
          w={12}
          h={12}
          x={321}
          y={33}
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
