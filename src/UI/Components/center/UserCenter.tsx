import React, { Fragment, useState } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { sdk } from '../../../sdk'
import { store } from '../../store'
import { _2500ms消失文字 } from '../../utils/_2500ms消失文字'

import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'

export const UserCenter = () => {
  const { user_warningText } = store.useState((v) => v.user_warningText)

  const [password, setPassword] = useState({
    old: '',
    new: '',
    new2: '',
  })
  const { textDisplay } = useStore()
  const disKey = textDisplay.isDis

  const changePassword = async () => {
    textDisplay.setIsDis(true)
    if (password.old === '' || password.new === '' || password.new2 === '')
      store.setState.user_warningText(
        <_2500ms消失文字
          key={Date.now()}
          text={res.string.请将所有的内容填满噢}
        />
      )
    else if (password.new.length < 6 || password.new.length > 25)
      store.setState.user_warningText(
        <_2500ms消失文字
          key={Date.now()}
          text={'密码长度应在 6-25 个字符之间'}
        />
      )
    else if (password.new !== password.new2)
      store.setState.user_warningText(
        <_2500ms消失文字
          key={Date.now()}
          text={res.string.您两次输入的密码不一致}
        />
      )
    else if (password.new === password.old)
      store.setState.user_warningText(
        <_2500ms消失文字
          key={Date.now()}
          text={res.string.新旧密码一致无法进行修改}
        />
      )
    else
      await sdk.ioFunc
        .userChangePassword(password.old, password.new)
        .then((result) =>
          store.setState.user_warningText(
            <_2500ms消失文字
              key={Date.now()}
              text={
                result.errCode === 0
                  ? res.string.密码修改成功
                  : res.string.密码修改失败
              }
            />
          )
        )

    setPassword({
      old: '',
      new: '',
      new2: '',
    })
  }
  const logout = async () =>
    await sdk.ioFunc
      .userLogout()
      .then((data) => data.errCode === 0 && store.setState.user_Name(''))

  const { configStore, deviceStore, userStore } = useStore()

  const uploadConfigs = () => configStore.uploadConfigs()

  const downConfigs = () => configStore.downloadConfigs()

  return useObserver(() =>
    userStore.user === undefined ? (
      <dj.Text
        type={'启动页主标题'}
        text={res.string.请您登录后再进入个人中心}
      />
    ) : (
        <Fragment>
          <dj.View w={400} h={131} x={0} y={0}>
            <dj.Text h={25} y={0} type={'个人中心标题'} text={'云同步'} />
            <dj.Line w={400} y={41} lineColor={'UserCenter'} />
            <dj.Text
              h={20}
              y={60}
              text={'上传该设置，将保存到我的云共享'}
              type={'描述'}
            />
            <dj.Button
              w={130}
              h={32}
              y={99}
              text={'上传当前设置'}
              mode={'BorderBackground'}
              clickHandle={uploadConfigs}
            />
          </dj.View>
          <dj.View w={400} h={131} x={491} y={0}>
            <dj.Text h={25} y={0} type={'个人中心标题'} text={'云同步'} />
            <dj.Line w={400} y={41} lineColor={'UserCenter'} />
            <dj.Text
              h={20}
              y={60}
              text={'下载云端设置，将覆盖当前设置'}
              type={'描述'}
            />
            <dj.Button
              w={130}
              h={32}
              y={99}
              text={'下载云端设置'}
              mode={'BorderBackground'}
              clickHandle={downConfigs}
            />
          </dj.View>
          <dj.View w={400} h={201} y={211}>
            <dj.Text h={25} y={0} text={'修改密码'} type={'个人中心标题'} />{' '}
            <dj.Line w={400} y={41} lineColor={'UserCenter'} />
            <dj.TextInput
              w={400}
              h={35}
              y={59}
              type={'密码'}
              usePlaceholder={res.useString.请输入旧密码}
              value={password.old}
              onChange={(event) =>
                setPassword({ ...password, old: event.target.value })
              }
            />
            <dj.Line w={400} y={98} lineColor={'UserCenter'} />
            <dj.TextInput
              w={400}
              h={35}
              y={116}
              type={'密码'}
              usePlaceholder={res.useString.请输入新密码}
              value={password.new}
              onChange={(event) =>
                setPassword({ ...password, new: event.target.value })
              }
            />
            <dj.Line w={400} y={155} lineColor={'UserCenter'} />
            <dj.TextInput
              w={400}
              h={35}
              y={171}
              type={'密码'}
              usePlaceholder={res.useString.再次输入新密码}
              value={password.new2}
              onChange={(event) =>
                setPassword({ ...password, new2: event.target.value })
              }
            />
            <dj.Line w={400} y={210} lineColor={'UserCenter'} />
          </dj.View>
          <dj.View w={400} h={201} x={491} y={211}>
            <dj.Text h={25} y={0} text={'我的设备'} type={'个人中心标题'} />

            <dj.Line w={400} y={41} lineColor={'UserCenter'} />
            <dj.Text
              w={400}
              h={35}
              y={67}
              type={'SubTitle'}
              text={deviceStore.currentDev?.deviceType.displayName}
            />
            <dj.Line w={400} y={98} lineColor={'UserCenter'} />
          </dj.View>
          <dj.Button
            w={130}
            h={32}
            x={0}
            y={453}
            text={'修改密码'}
            mode={'BorderBackground'}
            clickHandle={changePassword}
          />
          <dj.Button
            w={92}
            h={32}
            x={800}
            y={450}
            text={'退出登录'}
            mode={'Border'}
            clickHandle={logout}
          />
          {disKey&&<dj.Text
            text={user_warningText}
            type={'提示'}
            w={360}
            h={20}
            x={400}
            y={400}
          />}
        </Fragment>
      )
  )
}
