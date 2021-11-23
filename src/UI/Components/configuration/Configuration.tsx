import React, { Fragment } from 'react'
import { ConfigurationBox, ConfigurationBox2 } from './ConfigurationBox'

import { dj } from '../../../dj'
import { res } from '../../../res'
import { store } from '../../store'

import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'

import { OutsideAlerter } from '../../utils/OutsideAlerter'
import { newConfigName } from '../../utils/NameProvider'
import { Config } from '../../../sdk/DB'
import { blockCloud, kCompany } from '../../../appConfig'

export const Configuration = (props: {
  title: string
  setShareConfig: (config: Config) => void
}) => {
  const { title } = props

  const { configurationOpen, shareOpen } = store.useState(
    (v) => v.configurationOpen.shareOpen
  )

  const { configStore, deviceStore, pageStore, shareStore } = useStore()
  const { macroStore } = useStore()
  const changeList = new Array()
  for (var i = 0; i < 4; i++) {
    if (i === 0)
      changeList.push(res.text.标准层())
    else
      changeList.push(res.text.标准层() + '_' + i)
  }
  return useObserver(() => (
    <Fragment>
      <OutsideAlerter
        clickOutsideHandle={() => store.setState.configurationOpen(false)}>
        <dj.View w={363} h={562} x={796} y={87} form={'配置页'}>
          <dj.FlexView
            w={363}
            h={61}
            justifyContent={'center'}
            alignItems={'center'}>
            <dj.Line y={61} lineColor={'UserCenter'} />
            <dj.Text relative h={22} type={'配置页标题'} text={title} />
          </dj.FlexView>
          <dj.FlexView w={363} h={18} y={76} justifyContent={'space-between'}>
            <dj.Button
              relative
              w={70}
              h={18}
              isHightLight={false}
              mode={'Bluer'}
              text={res.string.添加}
              clickHandle={() => {
                deviceStore.creatNewConfigToCurrentAndSave(
                  newConfigName(configStore.configList),
                  ''
                )
              }}
            />
            {!blockCloud && <dj.Button
              relative
              w={70}
              h={18}
              isHightLight={false}
              mode={'Bluer'}
              textAlign={'left'}
              text={res.string.热门}
              clickHandle={() => {
                macroStore.stoptHook()
                store.setState.configurationOpen(false)
                pageStore.setPageIndex(3)
                shareStore.setCurrentShareListType('config')
                shareStore.setShareListPage('config', 'count')
              }}
            />}
          </dj.FlexView>

          <dj.List
            w={363}
            h={450}
            y={105}
            itemCount={configStore.configList.length}
            scrollToIndex={0}
            itemSize={() => 70}
            renderItem={(i) => {
              return (
                <div>
                  <ConfigurationBox
                    key={configStore.configList[i].localId}
                    config={configStore.configList[i]}
                    configurationOpen={configurationOpen}
                    shareOpen={shareOpen}
                    onDelete={() => {
                      configStore.deleteConfig(configStore.configList[i])
                    }}
                    clickHandle={(event) => {
                      if (
                        deviceStore.currentConfig.localId ===
                        configStore.configList[i].localId
                      )
                        return
                      deviceStore.setCurrentConfig(configStore.configList[i])
                      event.stopPropagation()
                      store.setState.configurationOpen(false)
                    }}
                    sharConfigClick={() =>
                      props.setShareConfig(configStore.configList[i])
                    }
                  />
                </div>
              )
            }}
          />

          {/* {kCompany === '比乐' && <dj.List
            w={363}
            h={450}
            y={105}
            itemCount={4}
            scrollToIndex={0}
            itemSize={() => 70}
            renderItem={(i) => {
              return (
                <div>
                  <ConfigurationBox2
                  name={changeList[i]}
                  index={i}
                  clickHandle={(event) => {
                    deviceStore.setCurrentProfile(i)
                  }}
                  />
                </div>
              )
            }}
          />} */}
        </dj.View>
      </OutsideAlerter>

      <dj.View w={180} h={22} x={962} y={686}>
        {''}
      </dj.View>
    </Fragment>
  ))
}
