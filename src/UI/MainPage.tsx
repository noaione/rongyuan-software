import React, { useState } from 'react'
import { Bottom } from './Bottom'
import { Configuration } from './Components/configuration/Configuration'
import { Share } from './utils/Share'
import { Top } from './Top'
import { MainLayout } from './MainLayout'

import { User } from './Components/user/User'
import { store } from './store'
import { Loading } from './utils/Loading'
import { Config } from '../sdk/DB'

import { AppUpgrade } from './Components/support/AppUpgrade'
import { res } from '../res'

export const MainPage = () => {
  const {
    configurationOpen,
    shareOpen,
    userOpen,
    appUpgrdeOpen,
  } = store.useState(
    (v) => v.configurationOpen.shareOpen.userOpen.appUpgrdeOpen
  )

  const [shareConfig, setShareConfig] = useState<Config | undefined>(undefined)
  return (
    <div>
      <div>
        <Top />
        <MainLayout />
        <Bottom />
      </div>
      {configurationOpen && (
        <Configuration
          title={res.text.配置设置()}
          setShareConfig={(config: Config) => setShareConfig(config)}
        />
      )}
      {shareOpen && (
        <Share
          type={'Config'}
          config={shareConfig}
          close={() => {
            store.setState.shareOpen(false)
            setShareConfig(undefined)
          }}
        />
      )}
      <Loading />
      {userOpen && <User />}
    </div>
  )
}
