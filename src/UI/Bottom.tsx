import React from 'react'

import { res } from '../res'
import { dj } from '../dj'
import { store } from './store'

import { useStore } from '../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { kCompany } from '../appConfig'

const DeviceBlock = (p: {
  type: string
  isHightLight: boolean
  clickHandle: () => void
}) => {
  return (
    <dj.View w={40} h={25} relative>
      <dj.VerticalLine h={14} y={4} />
      <dj.Button
        w={22}
        h={22}
        x={7}
        y={0}
        isHightLight={p.isHightLight}
        img={{
          size: { w: 22, h: 22 },
          src:
            p.type === 'keyboard'
              ? res.img.bottom_keyboard
              : p.type === 'mouse'
                ? res.img.bottom_mouse
                : res.img.bottom_delete,
        }}
        clickHandle={p.clickHandle}
      />
    </dj.View>
  )
}

export const Bottom = () => {
  const { configurationOpen } = store.useState((v) => v.configurationOpen)
  const { deviceStore } = useStore()
  const { keyIsOpen } = useStore()
  const { macroStore } = useStore()
  const changeList = new Array<String>()
  for (var i = 0; i < 4; i++) {
    if (i === 0)
      changeList.push(res.text.标准层())
    else
      changeList.push(res.text.标准层() + '_' + i)
  }
  return useObserver(() => (
    <dj.View w={1200} h={61} x={0} y={667}>
      <dj.Line lineColor={'Normal'} />
      <dj.Text
        w={100}
        h={20}
        x={20}
        y={20}
        type={'鼠标型号'}
        text={deviceStore.currentDev?.deviceType.displayName}
      />

      <dj.FlexView
        w={630}
        h={35}
        x={132}
        y={20}
        justifyContent={'start'}
        horizontalScroll={true}>
        {deviceStore.deviceArr.map((value, index) => (
          <DeviceBlock
            key={index}
            type={value.deviceType.type ? value.deviceType.type : ''}
            isHightLight={deviceStore.currentSelectIndex === index}
            clickHandle={() =>{
              keyIsOpen.setIsOpen(false)
              macroStore.stoptHook()
              deviceStore.currentSelectIndex !== index &&
              deviceStore.setCurrentSelectIndex(index)
            }}
          />
        ))}
      </dj.FlexView>

      <dj.Button
        w={130}
        h={22}
        x={771}
        y={20}
        img={{
          size: {
            w: 22,
            h: 22,
          },
          src: res.img.leftbar_recovery,
        }}
        mode={'Lighter'}
        isHightLight={false}
        textW={108}
        text={res.string.恢复默认}
        clickHandle={() => deviceStore.setReset()}
      />
      <dj.Button
        w={180}
        h={22}
        x={962}
        y={19}
        reverse
        img={{
          size: { w: 10, h: 6 },
          src: res.img.bottom_configure,
        }}
        mode={'Lighter'}
        isHightLight={configurationOpen}
        textW={165}
        text={deviceStore.currentConfig.name}
        // text={kCompany !== '比乐' ? deviceStore.currentConfig.name : changeList[deviceStore.currentProfile]}
        clickHandle={() => {
          keyIsOpen.setIsOpen(false)
          macroStore.stoptHook()
          store.setState.configurationOpen(!configurationOpen)
        }}
      />
    </dj.View>
  ))
}
