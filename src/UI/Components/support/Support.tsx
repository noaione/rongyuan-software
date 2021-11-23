import React, { Fragment } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { store } from '../../store'
import { toToast } from '../../utils/Toast'
import { SupportData, SupportProp, withProps } from '../../utils/WithProps'

const SupportUI = (p: SupportProp) => {
  return (
    <Fragment>
      <dj.View w={400} h={131} x={0} y={0}>
        <dj.Text h={25} y={0} type={'个人中心标题'} text={res.string.驱动版本} />
        <dj.Line w={400} y={41} lineColor={'UserCenter'} />
        <dj.Text h={20} y={60} text={p.appVersion} type={'描述'} />
        <dj.Button
          w={130}
          h={32}
          y={99}
          text={res.string.检查更新}
          mode={'BorderBackground'}
          clickHandle={async () => {
            await p.checkVersion()
            if (p.upgradeStore.appNeedUpgrade_) {
              p.upgradeStore.setUpgradeProgressApp(0)
              store.setState.appUpgrdeOpen(true)
            } else {
              toToast('info', res.text.驱动已经是最新版本无需更新())
            }
          }}
        />
      </dj.View>
      <dj.View w={400} h={131} x={491} y={0}>
        <dj.Text h={25} y={0} type={'个人中心标题'} text={res.string.固件版本} />
        <dj.Line w={400} y={41} lineColor={'UserCenter'} />
        <dj.Text h={20} y={60} text={p.devVersion} type={'描述'} />
        <dj.Button
          w={130}
          h={32}
          y={99}
          text={res.string.升级固件}
          mode={'BorderBackground'}
          clickHandle={async () => {
            await p.checkVersion()
            if (p.upgradeStore.devNeedUpgrade_) {
              p.upgradeStore.setUpgradeProgressDev(0)
              store.setState.devUpgradeOpen(true)
            } else {
              toToast('info', res.text.固件已经是最新版本无需更新())
            }
          }}
        />
        {p.upgradeStore.devNeedUpgrade_ && (
          <dj.RedDot w={5} h={5} x={135} y={100} />
        )}
      </dj.View>
    </Fragment>
  )
}

export const Support = withProps(SupportUI, SupportData)
