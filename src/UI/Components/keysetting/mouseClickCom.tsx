import React, { Fragment, useEffect, useRef, useState } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
// import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { MouseKey } from '../../../sdk/DriverIO/DeviceAPI/DeviceInterface'
// import { autorun } from 'mobx'
// import { MouseKey } from '../../../sdk/DriverIO/DeviceAPI/DeviceInterface'


export const MouseClickCom = (p: {
  cMouse:MouseKey|undefined
  setcMouse: (cMouse: MouseKey|undefined) => void
  oldValue: ConfigChangeToMouseBtn | undefined
  forBidden: boolean
}) => {
  const forBidden = p.forBidden
  const getMouseText = (n:MouseKey) => {
    const mouseText = [
      'MouseLeft',//1000
      'MouseRight',//999
      'MouseMiddle',//998
      'MouseForward',//997
      'MouseBack',//996
    ]

    const text = mouseText[1000+n]
    return text
  }
  let changedText = ''
  if (p.oldValue !== undefined) {
    p.oldValue.key !== 0 && (changedText = getMouseText(p.oldValue.key))
  }


  const isMouseExit = (mouseKey: MouseKey) => {
    return p.cMouse === mouseKey
      ? true
      : false
  }
  const changeMouseToNone = (mouseKey: MouseKey) => {
    p.setcMouse(mouseKey)
    if (p.cMouse === mouseKey) {
      p.setcMouse(0)
    }
  }
  const changeMouseToTrue = (mouseKey: MouseKey) => {
    p.setcMouse(mouseKey)
    if (p.cMouse === 0) {
      p.setcMouse(mouseKey)
    }
  }
  const changeMouseKey = (mouseKey: MouseKey) => {
    if (forBidden) {
      isMouseExit(mouseKey)
        ? changeMouseToNone(mouseKey)
        : changeMouseToTrue(mouseKey)
      return
    } else {
      changeMouseToNone(mouseKey)
      return
    }
  }
  // console.error('p.cMousep.cMousep.cMouse',p.cMouse);
  

  return useObserver(() => (
    <Fragment>
      <dj.FlexView2 w={200} x={57} y={44} flexDirection={'column'}>
        <dj.CheckBox2
          relative
          type={'Normal'}
          imgBg={res.img.left_mouse_key}
          isBool={forBidden}
          checkState={isMouseExit(-1000)&&forBidden}
          clickHandle={() => changeMouseKey(-1000)}
          w={60}
          h={30}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          imgBg={res.img.right_mouse_key}
          isBool={forBidden}
          checkState={isMouseExit(-999)&&forBidden}
          clickHandle={() => changeMouseKey(-999)}
          w={60}
          h={30}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          imgBg={res.img.middle_mouse_key}
          isBool={forBidden}
          checkState={isMouseExit(-998)&&forBidden}
          clickHandle={() => changeMouseKey(-998)}
          w={60}
          h={30}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          imgBg={res.img.mouse_keyUp}
          isBool={forBidden}
          checkState={isMouseExit(-997)&&forBidden}
          clickHandle={() => changeMouseKey(-997)}
          w={60}
          h={30}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          imgBg={res.img.mouse_keydown}
          isBool={forBidden}
          checkState={isMouseExit(-996)&&forBidden}
          clickHandle={() => changeMouseKey(-996)}
          w={60}
          h={30}
        />
      </dj.FlexView2>
      <dj.Text text={changedText} type={'已修改的按键值'} x={57} y={7} h={36} />
    </Fragment>
  ))
}