import React, { Fragment, useState, useEffect } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { BasicFunction } from './BasicFunction'
import { KeyCombination } from './KeyCombination'
import { MacroEdit } from './MacroEdit'

import { mobxStore, useStore } from '../../../mobxStore/store'
import { Macro } from '../../../sdk/DB/entity/macro'
import { useObserver } from 'mobx-react-lite'


import { autorun } from 'mobx'
import { MouseKey } from '../../../sdk/DriverIO/DeviceAPI/DeviceInterface'
import { MouseClickCom } from './mouseClickCom'
import { none } from 'ramda'

const settings = process.platform === 'darwin' ?
  [res.string.组合键, res.string.宏]
  : [res.string.组合键, res.string.宏, res.string.基本功能, res.string.鼠标]

const getSpecialKeyHidCode = (key: SpecialKey) => {
  let value = 0
  switch (key) {
    case 'ctrl':
      value = 224
      break
    case 'alt':
      value = 226
      break
    case 'shift':
      value = 0xe1
      break
    case 'win':
      value = 227
      break
    default:
      value = 0
      break
  }
  return value
}

const getPageIndex = (
  type:
    | 'ConfigMacro'
    | 'ConfigFunction'
    | 'combo'
    | 'forbidden'
    | 'ConfigChangeToMouseBtn'
    | undefined
) => {
  switch (type) {
    case 'ConfigMacro':
      return 1
    case 'ConfigFunction':
      return 2
    default:
      return 0
  }
}

export const KeySetting = (p: {
  keyHidCode: number
  oldValue: ConfigValue | undefined
  closeHandle: () => void
  title: string
  index?: number
}) => {
  const [pageIndex, setPageIndex] = useState(getPageIndex(p.oldValue?.type))
  const [forbidenKey, setForbidenKey] = useState(
    p.oldValue ? p.oldValue.type === 'forbidden' : false
  )
  const [combination, setCombination] = useState<{
    hid: number
    specialKey1: SpecialKey
    specialKey2: SpecialKey
  }>({
    hid: 0,
    specialKey1: 'none',
    specialKey2: 'none',
  })

  const [macro, setMacro] = useState<Macro>()
  const [basic, setBasic] = useState<SpecialFuntion>()
  const [cMouse, setcMouse] = useState<MouseKey>()
  const { deviceStore, macroStore } = useStore()

  useEffect(
    () =>
      autorun(() => {
        macroStore.refreshMacroList()
      }),
    []
  )


  let keyNameSp1 = ''
  //键盘首字母大写
  if (res.映射.hidCodeMapKeyName(p.keyHidCode) !== undefined) {
    keyNameSp1 = combination.specialKey1.substring(0, 1).toUpperCase() + combination.specialKey1.substring(1)
  }
  const setKeyCombination = () => {
    if (
      combination.hid === 0 &&
      combination.specialKey1 === 'none' &&
      combination.specialKey2 === 'none'
    )
      return


    const isAll =
      combination.specialKey1 !== 'none' && combination.specialKey2 !== 'none'
    let sKey: SpecialKey =
      combination.specialKey1 === 'none'
        ? combination.specialKey2
        : combination.specialKey1
    let key1 = isAll
      ? getSpecialKeyHidCode(combination.specialKey2)
      : combination.hid
    let key2 = isAll ? combination.hid : 0



    const value: ConfigCombo = {
      type: 'combo',
      original: p.keyHidCode,
      skey: sKey,
      key: key1,
      key2: key2,
      index: p.index
    }
    // console.error('value',value);
    // console.error('combination.specialKey1',combination.specialKey1);
    // console.error('combination.specialKey2',combination.specialKey2);
    // console.error('combination.hid',combination.hid);
    // console.error('res.映射.hidCodeMapKeyName(p.keyHidCode)',res.映射.hidCodeMapKeyName(p.keyHidCode));
    // console.error(res.映射.hidCodeMapKeyName(combination.hid));



    if (keyNameSp1 === res.映射.hidCodeMapKeyName(p.keyHidCode) && combination.specialKey2 === 'none' && combination.hid === 0) {
      return
    } else if (combination.specialKey1 === 'none' && combination.specialKey2 === 'none' && res.映射.hidCodeMapKeyName(combination.hid) === res.映射.hidCodeMapKeyName(p.keyHidCode)) {
      return
    } else {
      deviceStore.setKeyConfig(value)
    }
  }
  console.error(combination);

  const setMacroEdit = () => {
    if (macro === undefined) return
    if (macro.value === undefined) {
      macro.value = {
        type: 'ConfigMacro',
        original: p.keyHidCode,
        macroType: 'touch_repeat',
        repeatCount: 0,
        macro: [],
        index: p.index
      }
    }

    macro.value.original = p.keyHidCode
    macro.value.index = p.index
    deviceStore.setKeyConfig({ ...macro.value })
  }

  const setBasicFunction = () => {
    if (basic === undefined) return
    const value: ConfigFunction = {
      original: p.keyHidCode,
      type: 'ConfigFunction',
      key: basic,
      index: p.index
    }
    deviceStore.setKeyConfig(value)
  }
  const setMouseCom = () => {
    if (cMouse === undefined) return
    const value: ConfigChangeToMouseBtn = {
      original: p.keyHidCode,
      type: 'ConfigChangeToMouseBtn',
      key: cMouse,
      index: p.index
    }
    deviceStore.setKeyConfig(value)
  }

  const setRecover = () => {
    const value: ConfigCombo = {
      type: 'combo',
      original: p.keyHidCode,
      skey: 'none',
      key: p.keyHidCode,
      key2: 0,
      index: p.index
    }
    deviceStore.setKeyConfig(value)
  }

  const setForbidden = () => {
    const value: ConfigForbidden = {
      type: 'forbidden',
      original: p.keyHidCode,
      index: p.index
    }
    //console.error('VVVVVVVVVVAAAAAAAALLLLLLLUUUUUEEEEEEE',value);
    deviceStore.setKeyConfig(value)
  }
  const { keyIsOpen } = useStore()
  // console.error('keyIsOpen',keyIsOpen.keyIsOpen);
  return useObserver(() => (
    <Fragment>
      <dj.View form={'背景页'} drag={true}>
        {''}
      </dj.View>
      <dj.View w={480} h={431} x={360} y={150} form={'弹出框'}>
        <dj.Text h={30} y={24} text={p.title + res.text.键设置()} type={'弹框标题'} />
        <dj.Line y={65} lineColor={'按键设置'} />
        <dj.Button
          x={428}
          y={28}
          w={12}
          h={12}
          img={{ size: { w: 12, h: 12 }, src: res.img.close }}
          clickHandle={() => {
            p.closeHandle()
            macroStore.stoptHook()
          }}
        />
        <dj.FlexView
          w={230}
          h={36}
          x={130}
          y={74}
          justifyContent={'space-between'}
          alignItems={'center'}>
          {settings.map((value, index) => (
            <dj.Button
              relative
              key={index}
              isHightLight={pageIndex === index && !forbidenKey}
              w={60}
              mode={'按键设置'}
              text={value}
              clickHandle={() => {
                macroStore.stoptHook()
                if (index !== 0) {
                  keyIsOpen.setIsOpen(false)
                } else {
                  keyIsOpen.setIsOpen(true)
                }

                if (!forbidenKey)
                  setPageIndex(index)
                else
                  return
              }}
            />
          ))}
        </dj.FlexView>
        <dj.View w={399} h={218} x={41} y={132} form={'DefaultBackground'}>
          {settings[pageIndex] === res.string.组合键 ? (
            <KeyCombination
              Cvalue={combination}
              setCValue={(
                hid: number,
                specialKey1: SpecialKey,
                specialKey2: SpecialKey
              ) =>
                setCombination({
                  hid: hid,
                  specialKey1: specialKey1,
                  specialKey2: specialKey2,
                })
              }
              oldValue={
                p.oldValue
                  ? p.oldValue.type === 'combo'
                    ? p.oldValue
                    : undefined
                  : undefined
              }
              forBidden={!forbidenKey}
            />
          ) : null}
          {settings[pageIndex] === res.string.宏 && (
            <MacroEdit
              setMacro={(macro: Macro | undefined) => setMacro(macro)}
            />
          )}
          {settings[pageIndex] === res.string.基本功能 && (
            <BasicFunction
              basic={basic}
              setBasic={(basic: SpecialFuntion | undefined) => setBasic(basic)}
              oldValue={
                p.oldValue
                  ? p.oldValue.type === 'ConfigFunction'
                    ? p.oldValue
                    : undefined
                  : undefined
              }
              forBidden={!forbidenKey}
            />
          )}
          {settings[pageIndex] === res.string.鼠标 && (
            <MouseClickCom
              cMouse={cMouse}
              setcMouse={(key: MouseKey | undefined) => setcMouse(key)}
              oldValue={
                p.oldValue
                  ? p.oldValue.type === 'ConfigChangeToMouseBtn'
                    ? p.oldValue
                    : undefined
                  : undefined
              }
              forBidden={!forbidenKey}
            ></MouseClickCom>
          )}
        </dj.View>
        <dj.CheckBox
          w={100}
          h={16}
          x={44}
          y={371}
          type={'Normal'}
          text={res.string.禁用按键}
          checkState={forbidenKey}
          clickHandle={() => {
            macroStore.stoptHook()
            setForbidenKey(!forbidenKey)
          }}
        />
        <dj.Button
          w={84}
          h={28}
          x={258}
          y={366}
          mode={'Border'}
          text={res.string.恢复默认}
          clickHandle={() => {
            macroStore.stoptHook()
            setRecover()
            p.closeHandle()
          }}
        />
        <dj.Button
          w={84}
          h={28}
          x={356}
          y={367}
          mode={'Sparker'}
          text={res.string.确定}
          clickHandle={async () => {
            macroStore.stoptHook()
            if (forbidenKey === true) {
              setForbidden()
              p.closeHandle()
              return
            } else if (forbidenKey === false) {

              if (
                (keyNameSp1 === res.映射.hidCodeMapKeyName(p.keyHidCode) && combination.specialKey2 === 'none' && combination.hid === 0)
                || (combination.specialKey1 === 'none' && combination.specialKey2 === 'none' && res.映射.hidCodeMapKeyName(combination.hid) === res.映射.hidCodeMapKeyName(p.keyHidCode))
              ) {
                setRecover()
              } else if (combination.hid !== 0 || combination.specialKey1 !== 'none' || combination.specialKey2 !== 'none') {
                setKeyCombination()
              } else if (macro) {
                setMacroEdit()
              } else if (basic) {
                setBasicFunction()
              } else if (cMouse) {
                setMouseCom()
              } else {
                setRecover()
              }
              p.closeHandle()
              return
            }
            if (settings[pageIndex] === res.string.组合键) {
              setKeyCombination()
            }
            if (settings[pageIndex] === res.string.宏) {
              setMacroEdit()
            }
            if (settings[pageIndex] === res.string.基本功能) {
              setBasicFunction()
            }
            if (settings[pageIndex] === res.string.鼠标) {
              setMouseCom()
            }
            p.closeHandle()
          }}
        />
      </dj.View>
    </Fragment>
  ))
}
