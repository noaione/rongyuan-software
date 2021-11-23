import React, { Fragment, useEffect, useState } from 'react'

import { dj } from '../../../dj'
import { res } from '../../../res'
import { Progress } from '../../utils/Progress'
import { toToast } from '../../utils/Toast'
import {
  DevUpgradeData,
  DevUpgradeProp,
  withProps,
} from '../../utils/WithProps'

const UpgradeUI = (p: DevUpgradeProp) => {
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    if (p.progress === 1) {
      setShowProgress(false)
      toToast('info', res.text.升级成功())
      p.close()
    }
  }, [p.progress])

  useEffect(() => {
    console.log('errr msg', p.errMsg)
    if (p.errMsg !== '') setShowProgress(false)
  }, [p.errMsg])

  return (
    <Fragment>
      <dj.View form={'背景页'}>{''}</dj.View>
      <dj.View drag={true}>
        {p.deviceType === 'keyboard' ? (
          <dj.Img
            w={871}
            h={288}
            x={175}
            y={193}
            imgBg={
              p.deviceName in res.img
                ? (res.img[p.deviceName as keyof typeof res.img] as string)
                : res.img.MG912
            }
          />
        ) : (
            <dj.Img
              w={186}
              h={366}
              x={501}
              y={139}
              imgBg={
                p.deviceName in res.img
                  ? (res.img[p.deviceName as keyof typeof res.img] as string)
                  : res.img.MG912
              }
            />
          )}
        <dj.Text
          h={15}
          y={545}
          text={res.string.需要连接数据线升级}
          type={'升级提示'}
        />
        <dj.Button
          w={160}
          h={34}
          x={520}
          y={580}
          text={res.string.更新}
          mode={'Sparker'}
          clickHandle={() => {
            p.upgrade()
            setShowProgress(p.errMsg === '' ? true : false)
          }}
        />
        <dj.Text
          h={15}
          text={`${res.text.当前固件版本()}：${p.version} `}
          x={1016}
          y={645}
          type={'单选框'}
        />
        <dj.Button
          w={13}
          h={13}
          x={1146}
          y={23}
          img={{
            size: {
              w: 13,
              h: 13,
            },
            src: res.img.close,
          }}
          clickHandle={p.close}
        />
      </dj.View>
      {showProgress && <Progress rate={p.progress} />}
    </Fragment>
  )
}

export const DevUpgrade = withProps(UpgradeUI, DevUpgradeData)
