import React, { Fragment, useState } from 'react'
import { res } from '../../res'
import { dj } from '../../dj'

import { useStore } from '../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { Config, Macro } from '../../sdk/DB'

const TypeTable = {
  Config: '配置分享',
  Macro: '宏分享',
} as const

export const Share = (props: {
  type: keyof typeof TypeTable
  macro?: Macro
  config?: Config
  close: () => void
}) => {
  const { deviceStore, shareStore } = useStore()

  const [describle, setDescrible] = useState('')

  return useObserver(() => (
    <Fragment>
      <dj.View form={'背景页'} drag={true}>
        {''}
      </dj.View>
      <dj.FlexView alignItems={'center'} justifyContent={'center'}>
        <dj.View relative w={480} h={400} form={'弹出框'}>
          <dj.Text
            w={480}
            h={28}
            y={20}
            type={'弹框标题'}
            text={TypeTable[props.type]}
          />
          <dj.Button
            w={14}
            h={14}
            x={424}
            y={26}
            img={{
              size: {
                w: 14,
                h: 14,
              },
              src: res.img.topnav_close,
            }}
            clickHandle={() => {
              props.close()
            }}
          />
          <dj.FlexView
            w={400}
            h={260}
            x={40}
            y={110}
            flexDirection={'column'}
            justifyContent={'space-between'}>
            <dj.View relative h={60}>
              <dj.Text
                w={309}
                h={20}
                x={0}
                y={7}
                type={'分享配置页设备名'}
                text={'设备名称'}
              />
              <dj.Text
                w={309}
                h={36}
                x={0}
                y={38}
                type={'描述'}
                text={deviceStore.currentDev?.deviceType.displayName}
              />
            </dj.View>
          </dj.FlexView>
          <dj.TextArea
            w={400}
            h={114}
            x={40}
            y={194}
            placeholder={'设备描述'}
            editble={true}
            value={describle}
            setValue={(event) => setDescrible(event.target.value)}
          />
          <dj.FlexView
            w={400}
            h={34}
            x={44}
            y={333}
            justifyContent={'space-between'}
            alignItems={'flex-start'}>
            <dj.Button
              relative
              w={190}
              h={33}
              mode={'Border'}
              text={res.string.取消}
              clickHandle={() => props.close()}
            />
            <dj.Button
              relative
              w={190}
              h={34}
              mode={'Sparker'}
              text={res.string.确定}
              clickHandle={() => {
                props.type === 'Config'
                  ? props.config !== undefined &&
                  shareStore.shareConfig(props.config, describle)
                  : props.macro !== undefined &&
                  shareStore.shareMacro(props.macro, describle)

                props.close()
              }}
            />
          </dj.FlexView>
        </dj.View>
      </dj.FlexView>
    </Fragment>
  ))
}
