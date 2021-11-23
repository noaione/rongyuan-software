import React, { Fragment, useEffect, useRef, useState } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { autorun } from 'mobx'
import { MouseKey } from '../../../sdk/DriverIO/DeviceAPI/DeviceInterface'

export const KeyCombination = (p: {
  Cvalue: {
    hid: number
    specialKey1: SpecialKey
    specialKey2: SpecialKey
  }
  setCValue: (
    hid: number,
    specialKey1: SpecialKey,
    specialKey2: SpecialKey
  ) => void
  oldValue: ConfigCombo | undefined
  forBidden: boolean
}) => {
  const forBidden = p.forBidden
  const { macroStore } = useStore()
  const { keyIsOpen } = useStore()

  let changedText = ''
  if (p.oldValue !== undefined) {
    // console.error('p.oldValue', p.oldValue);

    p.oldValue.skey !== 'none' && (changedText = p.oldValue.skey)
    p.oldValue.key !== 0 &&
      (changedText +=
        changedText === ''
          ? res.映射.hidCodeMapKeyName(p.oldValue.key)
          : '+' + res.映射.hidCodeMapKeyName(p.oldValue.key))
    p.oldValue.key2 !== 0 &&
      (changedText +=
        changedText === ''
          ? res.映射.hidCodeMapKeyName(p.oldValue.key2)
          : '+' + res.映射.hidCodeMapKeyName(p.oldValue.key2))
  }

  const isSpecialKeyExit = (key: SpecialKey) => {
    return p.Cvalue.specialKey1 === key || p.Cvalue.specialKey2 === key
      ? true
      : false
  }


  const changeSpecialKeyToNone = (key: SpecialKey) => {
    if (p.Cvalue.specialKey1 === key)
      p.setCValue(p.Cvalue.hid, 'none', p.Cvalue.specialKey2)
    else p.setCValue(p.Cvalue.hid, p.Cvalue.specialKey1, 'none')
  }
  const changeSpecialKeyToTrue = (key: SpecialKey) => {
    if (p.Cvalue.specialKey1 === 'none')
      p.setCValue(p.Cvalue.hid, key, p.Cvalue.specialKey2)
    else p.setCValue(p.Cvalue.hid, p.Cvalue.specialKey1, key)
  }

  const changeKey = (key: SpecialKey) => {
    // console.error(key,'KKKKKKKKEEEEEEEEYYYYYYYY');
    if (forBidden) {
      isSpecialKeyExit(key)
      ? changeSpecialKeyToNone(key)
      : changeSpecialKeyToTrue(key)
      return
    } else {
      changeSpecialKeyToNone(key)
      return
    }
  }
  // console.error('ppppppppppppp', p);
  useEffect(() => autorun(() => { }), [macroStore.currentSingleValue])
  document.onkeydown = () => {
    if (forBidden && keyIsOpen.keyIsOpen) {
      // console.log('true le')
      macroStore.startSingleHook()
      macroStore.stopMouseEvent()
    }
  }
  document.onkeyup = () => {

    if (keyIsOpen.keyIsOpen && forBidden) {
      // console.error('键盘抬起');
      if (
        macroStore.currentSingleValue !== MouseKey.Left &&
        macroStore.currentSingleValue !== MouseKey.Middle &&
        macroStore.currentSingleValue !== MouseKey.Right &&
        macroStore.currentSingleValue !== 0
      ) {
        p.setCValue(
          macroStore.currentSingleValue,
          p.Cvalue.specialKey1,
          p.Cvalue.specialKey2
        )
      }
      macroStore.cleanSingleValue()
    }
  }


  // console.error(p.Cvalue.hid);

  return useObserver(() => (
    <Fragment>
      <dj.FlexView w={73} h={134} x={57} y={48} flexDirection={'column'}>
        <dj.CheckBox2
          relative
          type={'Normal'}
          text={'Ctrl'}
          isBool={forBidden}
          checkState={isSpecialKeyExit('ctrl')&&forBidden}
          clickHandle={() =>changeKey('ctrl')}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          text={'Alt'}
          isBool={forBidden}
          checkState={isSpecialKeyExit('alt')&&forBidden}
          clickHandle={() =>changeKey('alt')}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          text={'Shift'}
          isBool={forBidden}
          checkState={isSpecialKeyExit('shift')&&forBidden}
          clickHandle={() =>changeKey('shift')}
        />
        <dj.CheckBox2
          relative
          type={'Normal'}
          text={'Win'}
          isBool={forBidden}
          checkState={isSpecialKeyExit('win')&&forBidden}
          clickHandle={() =>changeKey('win')}
        />
      </dj.FlexView>
      <dj.VerticalLine w={1} h={134} x={159} y={54} />
      <dj.Text w={11} h={18} x={192} y={143} type={'组合键'} text={'+'} />
      <dj.TextSetInput
        usePlaceholder={res.useString.请输入按键}
        w={117}
        h={26}
        x={229}
        y={143}
        type={'组合键按键'}
        value={(res.映射.hidCodeMapKeyName(p.Cvalue.hid) || '')}
        onChange={() => { }}
        disabled={forBidden}
        inputFocus={() => {
        }}
        inputFinished={() => {
        }}
      />
      <dj.Text text={changedText} type={'已修改的按键值'} x={57} y={7} h={36} />
    </Fragment>
  ))
}
