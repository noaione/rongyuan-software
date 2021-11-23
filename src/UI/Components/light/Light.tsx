import React, { Fragment, useState } from 'react'
import { dj, dj2 } from '../../../dj'
import { res } from '../../../res'

import { LightRange } from '../../utils/LightRange'
import { ColorPicker, PopUpBox } from './ColorPicker'

import {
  withProps,
  LightProp,
  wheelLightData,
  logoLightData,
} from '../../utils/WithProps'

import { KeyboardBlocks } from '../home/Keyboard'
import { numToRgb, rgbToNum } from '../../../unitys/rgbNum'
import { OutsideAlerter } from '../../utils/OutsideAlerter'
import { DeviceStore } from '../../../mobxStore/deviceStore'
import { baseW } from '../../../screenConfig'

// test文件s
// import styled from '@emotion/styled'
import { KeyboardLightAnimation } from '../light/test'
import { useStore } from '../../../mobxStore/store'
// test文件e


const ColorPickerWidth = 327
const ColorPickerHeight = 335
const NavbarWidth = 269
const DriverWidth = baseW

const getLightRgb = (light: LightSetting) =>
  numToRgb(('rgb' in light && light.rgb) || 0)

const modeChange = (p: LightProp, type: string) => {
  //找到模式 对应的 type

  if (type === p.light.type) return

  const tmpLayout = p.lightLayout.types.find((v) => v.type === type)

  let tmpLight: any = { type: type }

  if (tmpLayout !== undefined) {
    if (tmpLayout.minSpeed !== undefined && tmpLayout.maxSpeed !== undefined)
      tmpLight.speed = (tmpLayout.maxSpeed - tmpLayout.minSpeed) / 2

    if (tmpLayout.minValue !== undefined && tmpLayout.maxValue !== undefined)
      tmpLight.value = (tmpLayout.maxValue - tmpLayout.minValue) / 2

    if (tmpLayout.rgb !== undefined) tmpLight.rgb = rgbToNum(255, 69, 110)

    if (tmpLayout.options !== undefined) tmpLight.option = tmpLayout.options[0]
  }

  p.setLight(tmpLight)
}

const lightCurrentLayout = (p: LightProp) => {
  const lightLayout = p.lightLayout.types.find(
    (value: { type: any }) => value.type === p.light.type
  )

  return lightLayout
    ? lightLayout
    : {
      maxSpeed: undefined,
      minSpeed: undefined,
      maxValue: undefined,
      minValue: undefined,
      options: undefined,
      rgb: undefined,
    }
}

const MouseLight = (p: LightProp) => {
  const onModeChange = (name: string) => modeChange(p, name)
  const layout = lightCurrentLayout(p)

  const isLayoutRgbExit =
    p.lightLayout.isRgb &&
    p.lightLayout.types.find((v) => v.type === p.light.type)?.rgb

  const color = isLayoutRgbExit ? getLightRgb(p.light) : { r: 0, g: 0, b: 0 }

  return (
    <dj.View w={891} h={480} x={0}>
      <dj.View w={280} h={28} x={0} y={30}>
        <dj.Text w={60} x={0} type={'SubTitle'} text={res.string.灯光模式} />
        <dj.ComboBox
          w={200}
          h={28}
          x={70}
          selectedValue={
            DeviceStore.lightNameMap[p.light.type]
              ? DeviceStore.lightNameMap[p.light.type]
              : p.light.type
          }
          onChange={(index) => onModeChange(p.lightLayout.types[index].type)}
          modes={p.lightLayout.types.map((v: { type: any }) =>
            DeviceStore.lightNameMap[v.type]
              ? DeviceStore.lightNameMap[v.type]
              : v.type
          )}
        />
      </dj.View>
      <dj.View w={334} h={28} y={101}>
        {layout.minSpeed !== undefined && (
          <Fragment>
            <dj.Text
              w={30}
              type={'SubTitle'}
              text={res.string.亮度}
              isDisabled={false}
            />
            <LightRange
              min={layout.minValue === undefined ? 0 : layout.minValue}
              max={layout.maxValue === undefined ? 5 : layout.maxValue}
              leftDescription={res.text.暗()}
              rightDescription={res.text.明()}
              value={'speed' in p.light ? p.light.speed : 0}
              setValue={(value) => {
                'speed' in p.light &&
                  p.setLight({
                    ...p.light,
                    speed: value,
                  })
              }}
              isDisabled={false}
            />
          </Fragment>
        )}
        {layout.minValue !== undefined && (
          <Fragment>
            <dj.Text
              w={30}
              type={'SubTitle'}
              text={res.string.速度}
              isDisabled={false}
            />
            <LightRange
              min={layout.minSpeed === undefined ? 0 : layout.minSpeed}
              max={layout.maxSpeed === undefined ? 5 : layout.maxSpeed}
              leftDescription={res.text.慢()}
              rightDescription={res.text.快()}
              value={'value' in p.light ? p.light.value : 0}
              setValue={(value) => {
                'value' in p.light &&
                  p.setLight({
                    ...p.light,
                    value: value,
                  })
              }}
              isDisabled={false}
            />
          </Fragment>
        )}
      </dj.View>
      {isLayoutRgbExit && (
        <dj.Text
          h={14}
          y={135}
          type={'灯光界面提示'}
          text={'请选择在使用呼吸模式和灯光常亮模式时要使用的颜色'}
        />
      )}
      <dj.View w={ColorPickerWidth} h={ColorPickerHeight} y={187}>
        <ColorPicker
          color={color}
          setColor={(rgb: number) =>
            isLayoutRgbExit &&
            'rgb' in p.light &&
            p.setLight({ ...p.light, rgb: rgb })
          }
        />
      </dj.View>
      {!isLayoutRgbExit && (
        <dj.View w={ColorPickerWidth} h={ColorPickerHeight} y={187}>
          {''}
        </dj.View>
      )}

      <dj.Img w={186} h={366} x={612} y={52} imgBg={res.img.MG912} />
    </dj.View>
  )
}

const PopColorPicker = (p: {
  color: { r: number; g: number; b: number }
  setColor: (rgb: number) => void
  clickHandle: (state: boolean) => void
  direction: 'up' | 'down'
  triangleX?: number
}) => {
  const [colorPickerEdit, setColorPickerEdit] = useState(false)

  const clickHanle = () => {
    !colorPickerEdit && p.clickHandle(false)
    setColorPickerEdit(false)
  }
  return (
    <PopUpBox direction={p.direction} triangleX={p.triangleX}>
      <OutsideAlerter clickOutsideHandle={clickHanle}>
        <dj.View>
          <ColorPicker
            color={p.color}
            setColor={p.setColor}
            setEdit={setColorPickerEdit}
          />
        </dj.View>
      </OutsideAlerter>
    </PopUpBox>
  )
}

const KeyboardUserPic = (p: LightProp) => {
  const { lightLayout, deviceLayout, lightPic, setLightPic } = p
  //console.error(lightPic)
  const [popUp, setPopUp] = useState(false)
  const [key, setPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    hid: number;
    index: undefined | number
  }>({
    x: -1,
    y: -1,
    width: -1,
    height: -1,
    hid: -1,
    index: undefined
  })

  const setDegree = (keyHidCode: number, index: number | undefined) => {
    const copy = lightPic.slice()

    const findIndex = copy.findIndex((v) => v.hid === keyHidCode && v.index === index)
    //console.error('findIndex', findIndex, key.hid, key.index, keyHidCode, index)
    findIndex === -1
      ? copy.push({ hid: keyHidCode, rgb: 0, index: index })
      : copy.splice(findIndex, 1)

    setLightPic(copy)
  }

  const color = numToRgb(
    lightPic.find((v) => v.hid === key.hid && v.index === key.index) !== undefined
      ? lightPic.find((v) => v.hid === key.hid && v.index === key.index)!.rgb
      : 206
  )

  const setColor = (rgb: number) => {
    const copy = lightPic.slice()
    const findIndex = copy.findIndex((v) => v.hid === key.hid && v.index === key.index)
    //console.error('setColor', findIndex, key.hid, key.index)
    copy.splice(findIndex, 1, { hid: key.hid, rgb: rgb, index: key.index })

    setLightPic(copy)
  }

  const clickHandle = (
    keyHidCode: number,
    text: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    index?: number
  ) => {
    if (lightLayout.isRgb) {
      setPosition({
        x: positionX,
        y: positionY,
        width: width,
        height: height,
        hid: keyHidCode,
        index: index
      })
      setPopUp(true)
      // console.log(text)
    } else setDegree(keyHidCode, index)
  }
  const x = key.x + key.width / 2 + ColorPickerWidth / 2 + NavbarWidth + p.deviceLayout.delt.deltX > DriverWidth
    ? DriverWidth - ColorPickerWidth - NavbarWidth
    : key.x - ColorPickerWidth / 2 + key.width / 2
  return (
    <Fragment>
      <dj.View w={871} h={288} y={159}>
        <KeyboardBlocks
          deviceLayout={deviceLayout}
          changedValue={lightPic.map((v) => {
            return {
              hid: v.hid,
              mode: lightLayout.isRgb
                ? {
                  color: `rgb(${numToRgb(v.rgb).r},${numToRgb(v.rgb).g},${numToRgb(v.rgb).b
                    })`,
                  type: 'CustomWeight',
                }
                : {
                  color: '',
                  type: 'Default',
                },
              index: v.index
            }
          })}
          clickHandle={clickHandle}
          mode={lightLayout.isRgb ? 'Multicolor' : 'Monochrome'}
        />
      </dj.View>

      {popUp && (
        <dj.View
          x={
            x
          }
          y={key.y - ColorPickerHeight - key.height / 2 + 159}>
          <PopColorPicker
            color={color}
            setColor={setColor}
            clickHandle={setPopUp}
            direction={'up'}
            triangleX={
              key.x + key.width / 2 - (x) - 9
            }
          />
        </dj.View>
      )}
    </Fragment>
  )
}


const KeyboardLight = (p: LightProp) => {
  const onModeChange = (name: string) => modeChange(p, name)
  const layout = lightCurrentLayout(p)

  const [popUp, setPopUp] = useState(false)

  const isLayoutRgbExit = p.lightLayout.isRgb && layout.rgb

  const color = isLayoutRgbExit ? getLightRgb(p.light) : { r: 0, g: 0, b: 0 }

  const setColor = (rgb: number) => {
    isLayoutRgbExit && p.setLight({ ...p.light, rgb: rgb })
  }

  return (
    <dj.View w={891} h={480} x={0} y={30}>
      <dj.FlexView
        flexDirection={'column'}
        w={871}
        h={80}
        justifyContent={'space-between'}>
        <dj.View relative w={871} h={28}>
          {/* 灯光模式 */}
          <dj.View w={280} h={28} x={0}>
            <dj.Text w={60} x={0} type={'SubTitle'} text={res.string.灯光模式} />
            <dj.ComboBox
              w={200}
              h={28}
              x={70}
              selectedValue={
                DeviceStore.lightNameMap[p.light.type]
                  ? DeviceStore.lightNameMap[p.light.type]
                  : p.light.type
              }
              onChange={(index) =>
                onModeChange(p.lightLayout.types[index].type)
              }
              modes={p.lightLayout.types.map((v: { type: any }) =>
                DeviceStore.lightNameMap[v.type]
                  ? DeviceStore.lightNameMap[v.type]
                  : v.type
              )}
            />
          </dj.View>

          {/* speed */}
          <dj.View w={334} h={28} x={332}>
            <dj.Text
              w={50}
              x={0}
              type={'SubTitle'}
              text={res.string.速度}
              isDisabled={layout.minSpeed === undefined}
            />
            <LightRange
              min={layout.minSpeed === undefined ? 0 : layout.minSpeed}
              max={layout.maxSpeed === undefined ? 4 : layout.maxSpeed}
              value={'speed' in p.light ? p.light.speed : 0}
              setValue={(value) => {
                'speed' in p.light &&
                  p.setLight({
                    ...p.light,
                    speed: value,
                  })
              }}
              leftDescription={res.text.慢()}
              rightDescription={res.text.快()}
              isDisabled={layout.minSpeed === undefined}
            />
          </dj.View>
          {/* 当前使用颜色 */}
          <dj.View w={120} h={28} x={727}>
            {isLayoutRgbExit && (
              <Fragment>
                <dj.ColorBlock
                  w={16}
                  h={16}
                  y={0}
                  bg={`rgb(${color.r},${color.g},${color.b})`}
                  clickHandle={() => {
                    setPopUp(!popUp)
                  }}
                />

                <dj.Text
                  w={100}
                  h={26}
                  x={28}
                  y={-0}
                  type={'SubTitle'}
                  text={res.string.当前使用颜色}
                />
              </Fragment>
            )}
          </dj.View>
        </dj.View>

        <dj.View relative w={871} h={28}>
          {/* Options */}
          <dj.View w={280} h={28} x={0}>
            <dj.Text
              w={60}
              x={0}
              type={'SubTitle'}
              text={'Options'}
              isDisabled={layout.options === undefined}
            />
            <dj.ComboBox
              w={200}
              h={28}
              x={70}
              onChange={(index: number) =>
                'option' in p.light &&
                layout.options &&
                p.setLight({ ...p.light, option: layout.options[index] })



              }
              selectedValue={
                'option' in p.light ? p.light.option : undefined
              }
              modes={layout.options === undefined ? [] : layout.options}
              isDisabled={layout.options === undefined}
            />
          </dj.View>

          {/* 亮度 */}
          <dj.View w={334} h={28} x={332}>
            <dj.Text
              w={80}
              type={'SubTitle'}
              text={res.string.亮度}
              isDisabled={layout.minValue === undefined}
            />
            <LightRange
              min={layout.minValue === undefined ? 0 : layout.minValue}
              max={layout.maxValue === undefined ? 5 : layout.maxValue}
              leftDescription={res.text.暗()}
              rightDescription={res.text.明()}
              value={'value' in p.light ? p.light.value : 0}
              setValue={(value) => {
                'value' in p.light &&
                  p.setLight({
                    ...p.light,
                    value: value,
                  })
              }}
              isDisabled={layout.minValue === undefined}
            />
          </dj.View>
        </dj.View>
      </dj.FlexView>

      {/* 键盘图 */}
      <dj.Img
        w={871}
        h={288}
        y={159}
        imgBg={
          p.deviceName in res.img
            ? (res.img[p.deviceName as keyof typeof res.img] as string)
            : res.img.MG912
        }
      />

      {/* 颜色选择BOX */}
      {isLayoutRgbExit && popUp && (
        <dj2.View2 x={571} y={33}>
          <PopColorPicker
            color={color}
            setColor={setColor}
            clickHandle={setPopUp}
            direction={'down'}
          />
        </dj2.View2>
      )}


      {/* 遮罩层 */}
      {p.light.type === 'LightUserPicture' && <KeyboardUserPic {...p} />}
      {/* {p.light.type !== 'LightOff' && <KeyboardLightAnimation {...p} />} */}
      {/* 
        关闭    LightOff
        常亮    LightAlwaysOn       有色盘
        呼吸    LightBreath         有色盘
        光波    LightWave    
        涟漪    LightRipple         有色盘
        雨滴    LightRaindrop       有色盘
        蛇形    LightSnake          有色盘
        跟随    LightPressAction    有色盘
        聚合    LightConverage      有色盘
        霓虹    LightNeon
        自定义  LightUserPicture
      */}
    </dj.View>
  )
}

export const WheelLight = withProps(MouseLight, wheelLightData)
export const LogoLight = withProps(MouseLight, logoLightData)
export const RGBLight = withProps(KeyboardLight, wheelLightData)
