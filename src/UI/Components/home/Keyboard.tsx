import React, { Fragment, useState } from 'react'

import { res } from '../../../res'
import { dj, dj2 } from '../../../dj'
import { KeySetting } from '../keysetting/KeySetting'

import { HomeProp, withProps, homeData } from '../../utils/WithProps'
import { 键鼠布局 } from '../../../res/layout'
import { useStore } from '../../../mobxStore/store'
import { kCompany } from '../../../appConfig'
export const KeyboardBlocks = (p: {
  deviceLayout: { layout: 键鼠布局[]; delt: { deltX: number; deltY: number } }
  changedValue: {
    hid: number
    mode: { color: string; type: 'Default' | 'CustomLight' | 'CustomWeight' }
    index?: number
  }[]
  mode: 'Home' | 'Monochrome' | 'Multicolor'
  clickHandle: (
    keyHidCode: number,
    text: string,
    positionX: number,
    positionY: number,
    width: number,
    high: number,
    index?: number
  ) => void
}) => {
  const defaultMode: (
    mode: 'Home' | 'Monochrome' | 'Multicolor'
  ) => {
    color: string
    type: 'Default' | 'CustomLight' | 'CustomWeight'
  } = (mode: 'Home' | 'Monochrome' | 'Multicolor') => {
    switch (mode) {
      case 'Home':
      default:
        return {
          color: '',
          type: 'Default',
        }
      case 'Monochrome':
        return {
          color: '#4cd7c7',
          type: 'CustomLight',
        }
    }
  }
  {
    // document.onkeydown = (e) => {
    //   var value= e.keyCode;
    //   var key = String.fromCharCode(e.keyCode);
    //   console.log(key+'---'+value);
    // }
    //p.changedValue.forEach(v => console.error(v))
    return (
      <Fragment>
        {p.deviceLayout.layout.map(
          (value, i) =>
            value.value !== undefined && (
              <dj.KeyboardBlock
                key={i}
                w={value.w}
                h={value.h}
                x={value.x + p.deviceLayout.delt.deltX}
                y={-value.y + p.deviceLayout.delt.deltY}
                mode={
                  p.changedValue.find((v) => v.hid === value.value && v.index === value.index)?.mode
                    ? p.changedValue.find((v) => v.hid === value.value && v.index === value.index)?.mode
                    : defaultMode(p.mode)
                }
                clickHandle={() => {
                  p.clickHandle(
                    value.value,
                    value.keyName,
                    value.x + p.deviceLayout.delt.deltX,
                    -value.y + p.deviceLayout.delt.deltY,
                    value.w,
                    value.h,
                    value.index
                  )
                  // console.log(index);
                }}
              />
            )
        )}
      </Fragment>
    )
  }
}
const KeyboardBase = (p: HomeProp) => {
  const [state, setState] = useState<{
    open: boolean,
    keyHidCode: number,
    text: string,
    index: number | undefined
  }>({ open: false, keyHidCode: 0, text: '', index: undefined })

  //console.log('device name', p.deviceName)
  // const changeList = ['标准层', '标准层1', '标准层2', '标准层3', '标准层4', '标准层5', '标准层6', '标准层7',]
  const changeList = new Array()
  for (var i = 0; i < 3; i++) {
    // if (i === 0)
    //   changeList.push(res.text.标准层())
    // else
    changeList.push(res.text.标准层() + '_' + (i + 1))
  }
  const { keyIsOpen } = useStore()
  const { deviceStore } = useStore()
  return (
    <Fragment>
      <dj.Text h={18} type={'键盘提示'} text={res.string.带} />
      <dj.Button w={14} h={14} x={16} y={2} mode={'KeyboardExample'} />
      <dj.Text
        h={18}
        x={36}
        type={'键盘提示'}
        text={res.string.背景的按键表示该按键的默认功能已被更改}
      />
      <dj.View w={871} h={288} x={0} y={74}>
        <dj.Img
          w={871}
          h={288}
          imgBg={
            p.deviceName in res.img ? res.img[p.deviceName] : res.img.MG912
          }
          type={'完全覆盖背景区'}
        />
        <KeyboardBlocks
          deviceLayout={p.deviceLayout}
          changedValue={p.keyValue.map((v) => {
            return {
              index: v.index,
              hid: v.original,
              mode: {
                color: '#4cd7c7',
                type: 'CustomLight',
              },
            }
          })}
          clickHandle={(keyHidCode: number, text: string, positionX: number, positionY: number, width: number, high: number, index?: number | undefined) => {
            setState({ open: true, keyHidCode: keyHidCode, text: text, index: index })
            keyIsOpen.setIsOpen(true)
          }
          }
          mode={'Home'}
        />
      </dj.View>
      { keyIsOpen.keyIsOpen && (
        <dj2.View2 w={1200} h={730} x={-268} y={-146}>
          <KeySetting
            keyHidCode={state.keyHidCode}
            title={state.text}
            oldValue={p.keyValue.find((v) => v.original === state.keyHidCode && v.index === state.index)}
            closeHandle={() => {
              setState({ open: false, keyHidCode: 0, text: '', index: undefined })
              keyIsOpen.setIsOpen(false)
            }}
            index={state.index}
          />
        </dj2.View2>
      )}
      <dj.FlexView h={30} x={100} y={400} justifyContent={'space-start'}>
        {kCompany === '比乐' && changeList.map((v, i) => {
          return (
            <dj.Button
              key={i}
              isHightLight={deviceStore.currentProfile === i}
              relative
              w={100}
              marginRight={15}
              mode={'Border'}
              text={v}
              clickHandle={() => {
                deviceStore.setCurrentProfile(i)
                // console.error(i);
              }}
            ></dj.Button>
          )
        })}
      </dj.FlexView>
    </Fragment>
  )
  // })
}

export const KeyboardHome = withProps(KeyboardBase, homeData)
