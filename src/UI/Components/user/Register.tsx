import React, { Fragment, useState } from 'react'

import { dj } from '../../../dj'
import { res } from '../../../res'

import { store } from '../../store'
import { Login } from './Login'
import { UserArgee } from './UserArgee'
import { _2500ms消失文字 } from '../../utils/_2500ms消失文字'
import { webServerCompose } from './User'
import { login_logo_p, urlStr } from '../../../appConfig'

export const Register = () => {
  const [state, setstate] = useState({
    userName: '',
    email: '',
    password: '',
    password2: '',
    gender: 'male' as 'male' | 'female',
    isAgree: false,
  })

  const [agreeOpen, setAgreeOpen] = useState(false)

  const isEmpty = (value: string) => {
    return value === ''
  }

  const onSubmit = () => {
    if (!state.isAgree)
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='请您同意用户协议后再进行注册' />
      )
    else if (
      isEmpty(state.email) ||
      isEmpty(state.userName) ||
      isEmpty(state.password) ||
      isEmpty(state.password2)
    )
      store.setState.user_warningText(
        <_2500ms消失文字
          key={Date.now()}
          text={res.string.请将所有的内容填满噢}
        />
      )
    else if (state.password !== state.password2)
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='两次输入的密码不一致' />
      )
    else if (res.regexp.email.test(state.email) === false)
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='请输入正确的邮箱' />
      )
    else if (state.password.length < 6 || state.password.length > 25)
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='密码长度应在 6-25 个字符之间' />
      )
    else if (state.userName.length < 4) {
      store.setState.user_warningText(
        <_2500ms消失文字 key={Date.now()} text='用户名至少需要 4 个字符' />
      )
    } else {
      webServerCompose('register')(state)
    }
  }

  return (
    <Fragment>
      <dj.View w={370} h={490} x={416} y={120} form={'弹出框'}>
        <dj.Img w={32} h={29} x={168} y={31} imgBg={urlStr(login_logo_p)} />
        <dj.Text
          h={25}
          y={68}
          type={'个人中心标题'}
          text={res.string.注册}></dj.Text>
        <dj.Button
          w={12}
          h={12}
          x={37}
          y={33}
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
          w={250}
          h={34}
          x={51}
          y={121}
          value={state.email}
          onChange={(event) =>
            setstate({ ...state, email: event.target.value })
          }
          usePlaceholder={res.useString.邮箱}
        />
        <dj.Line w={300} x={35} y={155} lineColor={'User'}></dj.Line>
        <dj.TextInput
          w={250}
          h={34}
          x={51}
          y={173}
          value={state.userName}
          onChange={(event) =>
            setstate({ ...state, userName: event.target.value })
          }
          usePlaceholder={res.useString.用户名}
        />
        <dj.Line w={300} x={35} y={207} lineColor={'User'}></dj.Line>
        <dj.TextInput
          w={250}
          h={34}
          x={51}
          y={224}
          type={'密码'}
          value={state.password}
          onChange={(event) =>
            setstate({ ...state, password: event.target.value })
          }
          usePlaceholder={res.useString.密码长度}
        />
        <dj.Line w={300} x={35} y={258} lineColor={'User'}></dj.Line>
        <dj.TextInput
          w={250}
          h={34}
          x={51}
          y={274}
          type={'密码'}
          value={state.password2}
          onChange={(event) =>
            setstate({ ...state, password2: event.target.value })
          }
          usePlaceholder={res.useString.再次输入密码}
        />
        <dj.Line w={300} x={35} y={308} lineColor={'User'}></dj.Line>
        <dj.Text
          w={100}
          h={14}
          x={50}
          y={330}
          type={'单选框'}
          text={res.string.性别}
        />
        <dj.RadioButton
          w={30}
          h={14}
          x={201}
          y={334}
          type={'圆形'}
          name={'性别'}
          text={'男'}
          isChecked={state.gender === 'male'}
          clickHandle={() => setstate({ ...state, gender: 'male' })}
        />
        <dj.RadioButton
          w={30}
          h={14}
          x={250}
          y={334}
          type={'圆形'}
          name={'性别'}
          text={'女'}
          isChecked={state.gender === 'female'}
          clickHandle={() => setstate({ ...state, gender: 'female' })}
        />
        <dj.Line w={300} x={35} y={357} lineColor={'User'}></dj.Line>
        <dj.Button
          w={300}
          h={36}
          x={35}
          y={390}
          mode={'Sparker'}
          text={res.string.注册}
          clickHandle={onSubmit}
        />
        <dj.CheckBox
          w={20}
          h={14}
          x={136}
          y={445}
          type={'用户须知'}
          text={''}
          checkState={state.isAgree}
          clickHandle={(event) => {
            setstate({ ...state, isAgree: event.target.checked })
          }}
        />
        <dj.Button
          mode={'同意用户协议'}
          w={90}
          h={25}
          x={156}
          y={440}
          text={res.string.同意用户协议}
          clickHandle={() => setAgreeOpen(true)}
        />
        <dj.Button
          w={12}
          h={12}
          x={324}
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
      {agreeOpen && (
        <UserArgee
          setAgree={(pro: boolean) => {
            setAgreeOpen(false)
            setstate({ ...state, isAgree: pro })
          }}
        />
      )}
    </Fragment>
  )
}
