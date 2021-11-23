import React from 'react'
import { res } from '../../res'

import { useStore } from '../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'

import { 键鼠布局 } from '../../res/layout'
import { store } from '../store'
import { DeviceStore } from '../../mobxStore/deviceStore'
import { defaultLayout } from '../../sdk/DriverIO/DeviceAPI/DeviceInterface'
import { UpgradeStore } from '../../mobxStore/upgradeStore'

export interface LightProp {
  light: LightSetting
  lightLayout: {
    isRgb: boolean
    types: {
      type: string
      maxSpeed?: number
      minSpeed?: number
      maxValue?: number
      minValue?: number
      options?: string[]
      rgb?: boolean
    }[]
  }
  setLight: (light: LightSetting) => void
  deviceName: string
  deviceLayout: { layout: 键鼠布局[]; delt: { deltX: number; deltY: number } }
  lightPic: UserPicItem[]
  setLightPic: (lightPic: UserPicItem[]) => void
}

export interface LightProp2 {
  light: 'LightAlwaysOn'
  lightLayout: {
    isRgb: boolean
    types: {
      type: string
      maxSpeed?: number
      minSpeed?: number
      maxValue?: number
      minValue?: number
      options?: string[]
      rgb?: boolean
    }[]
  }
  setLight: (light: LightSetting) => void
  deviceName: string
  deviceLayout: { layout: 键鼠布局[]; delt: { deltX: number; deltY: number } }
  lightPic: UserPicItem[]
  setLightPic: (lightPic: UserPicItem[]) => void
}


export const wheelLightData = () => {
  const { deviceStore } = useStore()

  return useObserver<LightProp>(() => {
    const deviceName = deviceStore.currentDev
      ? deviceStore.currentDev.deviceType.name
        ? deviceStore.currentDev.deviceType.name
        : 'default'
      : 'default'
    const isLayoutExit = deviceName in res.键鼠坐标

    return {
      light:
        deviceStore.currentConfig.light != null
          ? deviceStore.currentConfig.light
          : { type: 'LightOff' },
      lightLayout: deviceStore.currentDev
        ? deviceStore.currentDev.deviceType.layout
          ? deviceStore.currentDev.deviceType.layout['light']
          : {
              isRgb: false,
              types: [
                {
                  type: 'LightAlwaysOn',
                  maxSpeed: 1,
                  minSpeed: 2,
                  maxValue: 3,
                  minValue: 4,
                  options: [''],
                  rgb: false,
                },
              ],
            }
        : {
            isRgb: false,
            types: [
              {
                type: 'LightAlwaysOn',
                maxSpeed: 1,
                minSpeed: 2,
                maxValue: 3,
                minValue: 4,
                options: [''],
                rgb: false,
              },
            ],
          },
      setLight: deviceStore.setLightSetting,
      deviceName: deviceName,
      deviceLayout: res.键鼠坐标[isLayoutExit ? deviceName : 'default'],
      lightPic: deviceStore.currentConfig.lightPic
        ? deviceStore.currentConfig.lightPic
        : [],
      setLightPic: (lightPic: UserPicItem[]) => {
        //console.error('!!!!!!!!!!!!!!!!!!!')
        deviceStore.setLightPic(lightPic)
      },
    }
  })
}

export const logoLightData = () => {
  const { deviceStore } = useStore()
  const deviceName = deviceStore.currentDev
    ? deviceStore.currentDev.deviceType.name
      ? deviceStore.currentDev.deviceType.name
      : 'default'
    : 'default'
  const isLayoutExit = deviceName in res.键鼠坐标

  return useObserver<LightProp>(() => ({
    light:
      deviceStore.currentConfig.logoLight != null
        ? deviceStore.currentConfig.logoLight
        : { type: 'LightOff' },
    lightLayout:
      deviceStore.currentDev?.deviceType.layout === undefined
        ? defaultLayout['light']
        : deviceStore.currentDev?.deviceType.layout['light'],
    setLight: deviceStore.setLogoLightSetting,
    deviceName: deviceName,
    deviceLayout: res.键鼠坐标[isLayoutExit ? deviceName : 'default'],
    lightPic: deviceStore.currentConfig.lightPic
      ? deviceStore.currentConfig.lightPic
      : [],
    setLightPic: (lightPic: UserPicItem[]) => {
      deviceStore.setLightPic(lightPic)
    },
  }))
}

export interface HomeProp {
  dpi: number[]
  dpiLayout: Layout['dpi']
  setDpi: (dpi: number[]) => void
  deviceLayout: { layout: 键鼠布局[]; delt: { deltX: number; deltY: number } }
  deviceName: string
  keyValue: any[]
  reportRate: number
  setReportRate: (rate: 500 | 125 | 1000 | 250) => void
}

export const homeData = () => {
  const { deviceStore } = useStore()
  return useObserver<HomeProp>(() => {
    const dpiLayout = deviceStore.currentDev
      ? deviceStore.currentDev.deviceType.layout
        ? deviceStore.currentDev.deviceType.layout['dpi']
          ? deviceStore.currentDev.deviceType.layout['dpi']
          : {
              count: 0,
              min: 0,
              max: 0,
              delt: 0,
            }
        : {
            count: 0,
            min: 0,
            max: 0,
            delt: 0,
          }
      : {
          count: 0,
          min: 0,
          max: 0,
          delt: 0,
        }

    const deviceName = deviceStore.currentDev
      ? deviceStore.currentDev.deviceType.name
        ? deviceStore.currentDev.deviceType.name
        : 'default'
      : 'default'
    const isLayoutExit = deviceName in res.键鼠坐标

    return {
      dpi: deviceStore.currentConfig.dpi
        ? deviceStore.currentConfig.dpi
        : [500, 500, 500, 500, 500, 500, 500],
      dpiLayout: dpiLayout,
      setDpi: (dpis: number[]) => deviceStore.setDpi(dpis),
      deviceLayout: res.键鼠坐标[isLayoutExit ? deviceName : 'default'],
      deviceName: deviceName,
      keyValue: deviceStore.currentConfig.value
        ? deviceStore.currentConfig.value
        : [],
      reportRate: deviceStore.currentConfig.reportRate
        ? deviceStore.currentConfig.reportRate
        : 125,
      setReportRate: (rate: 500 | 125 | 1000 | 250) =>
        deviceStore.setReportRate(rate),
    }
  })
}
export interface AppUpgradeProp {
  progress: number
  errType: 'error' | 'info'
  errMsg: string
  upgrade: () => Promise<void>
  close: () => void
}

export const AppUpgradeData = () => {
  const { upgradeStore, toastStore } = useStore()
  return useObserver<AppUpgradeProp>(() => {
    return {
      progress: upgradeStore.upgradeProgressApp,
      errType: toastStore.errType,
      errMsg: toastStore.errMsg,
      upgrade: () => upgradeStore.upgradeApp(),
      close: () => store.setState.appUpgrdeOpen(false),
    }
  })
}

export interface DevUpgradeProp {
  deviceType: 'mouse' | 'keyboard' | undefined
  deviceName: string
  version: string
  progress: number
  errType: 'error' | 'info'
  errMsg: string
  upgrade: () => Promise<void>
  close: () => void
}

export const DevUpgradeData = () => {
  const { deviceStore, upgradeStore, toastStore } = useStore()

  return useObserver<DevUpgradeProp>(() => {
    return {
      deviceType: deviceStore.currentDev?.type,
      deviceName: deviceStore.currentDev
        ? deviceStore.currentDev.deviceType.name
          ? deviceStore.currentDev.deviceType.name
          : 'default'
        : 'default',
      version: deviceStore.currentDevVersion,
      progress: upgradeStore.upgradeProgressDev,
      errType: toastStore.errType,
      errMsg: toastStore.errMsg,
      upgrade: () => upgradeStore.upgradeDev(),
      close: () => store.setState.devUpgradeOpen(false),
    }
  })
}

export interface SupportProp {
  devVersion: string
  appVersion: string
  checkVersion: () => Promise<unknown>
  devNeedUpgrade: boolean
  upgradeStore: UpgradeStore
}

export const SupportData = () => {
  const { deviceStore, upgradeStore } = useStore()

  return useObserver<SupportProp>(() => {
    return {
      devVersion: deviceStore.currentDevVersion,
      appVersion: upgradeStore.appVersion,
      checkVersion: upgradeStore.checkVersion,
      devNeedUpgrade: upgradeStore.devNeedUpgrade,
      upgradeStore: upgradeStore,
    }
  })
}

export const withProps = <T extends { [key: string]: any }>(
  Component: React.FC<T>,
  input: () => T
) => () => <Component {...input()} />
