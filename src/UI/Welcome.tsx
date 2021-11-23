import * as React from 'react'

import { dj } from '../dj'
import { res } from '../res'

import { remote } from 'electron'
import { SupportData, SupportProp, withProps } from './utils/WithProps'
import { store } from './store'
import { default_logo_p, kAppVersion, kCompany, kCompanyDisplayName, urlStr } from '../appConfig'
import { baseW } from '../screenConfig'

const WelcomeUI = (p: SupportProp) => {
  return (
    <dj.View drag={true}>
      <dj.Button
        w={13}
        h={13}
        x={1146}
        y={23}
        img={{
          size: {
            w: 13,
            h: 13,
          },
          src: res.img.close,
        }}
        clickHandle={() => remote.getCurrentWindow().hide()}
      />
      <dj.Img w={100} h={88} x={550} y={269} imgBg={urlStr(default_logo_p)} />
      <dj.Text
        w={baseW}
        h={40}
        x={0}
        y={382}
        text={res.text.欢迎使用() + kCompanyDisplayName + res.text.驱动()}
        type={'启动页主标题'}>

      </dj.Text>

      <dj.Text
        w={386}
        x={407}
        h={20}
        y={519}
        text={res.string.搜寻设备中}
        type={'启动页搜索'}></dj.Text>
      <dj.Text
        w={386}
        h={13}
        x={407}
        y={533}
        text={'...'}
        type={'启动页搜索'}></dj.Text>
      <dj.Text
        w={386}
        h={20}
        x={780}
        y={688}
        text={'v:' + kAppVersion}
        type={'启动页搜索'}></dj.Text>
      <dj.Button
        w={130}
        h={32}
        x={1030}
        y={680}
        text={res.string.软件更新}
        mode={'BorderBackground'}
        clickHandle={async () => {
          await p.checkVersion()
          if (p.upgradeStore.appNeedUpgrade_) {
            p.upgradeStore.setUpgradeProgressApp(0)
            store.setState.appUpgrdeOpen(true)
          }
        }}
      />
    </dj.View>
  )
}
export const Welcome = withProps(WelcomeUI, SupportData)
