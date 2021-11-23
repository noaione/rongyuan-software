import React, { Fragment, useState } from 'react'
import { BaseType } from '../dj/BaseType'
import { res } from '../res'
import { KeyboardHome } from './Components/home/Keyboard'
import { MouseHome } from './Components/home/Mouse'
import { LogoLight, WheelLight, RGBLight } from './Components/light/Light'
import { MacroFile } from './Components/macro/MacroFile'
import { ConfigScheme, MacroScheme } from './Components/scheme/Scheme'
import { UserCenter } from './Components/center/UserCenter'
import { Support } from './Components/support/Support'
import { dj } from '../dj'
import { SubNavbarItem } from './utils/SubNavbarItem'

import { mobxStore, useStore } from '../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { GA } from '../sdk/GA/ga'
import { blockCloud } from '../appConfig'

export const MainLayout = () => {
  const [subPageIndex, setSubPageIndex] = useState(0)
  const { deviceStore, pageStore } = useStore()

  const __________items: {
    title: React.ReactNode
    src: BaseType.ButtonStateImg
    changeable: boolean
    mouse: {
      title: React.ReactNode
      jsx: React.ReactNode
    }[]
    keyboard: {
      title: React.ReactNode
      jsx: React.ReactNode
    }[]
    common: {
      title: React.ReactNode
      jsx: React.ReactNode
    }[]
    lineExist: boolean
  }[] = [
      {
        title: res.string.主要设置,
        src: res.img.leftbar_home,
        changeable: true,
        mouse: [{ title: 'CPI', jsx: <MouseHome /> }],
        keyboard: [{ title: '', jsx: <KeyboardHome /> }],
        common: [],
        lineExist: true,
      },
      {
        title: res.string.灯光设置,
        src: res.img.leftbar_light,
        changeable: true,
        mouse: [
          {
            title: 'Wheel灯光',
            jsx: <WheelLight />,
          },
          {
            title: 'LOGO灯光',
            jsx: <LogoLight />,
          },
        ],
        keyboard: [{ title: res.string.灯光, jsx: <RGBLight /> }],
        common: [],
        lineExist: true,
      },
      {
        title: res.string.宏编辑,
        src: res.img.leftbar_edit,
        changeable: false,
        mouse: [],
        keyboard: [],
        common: [{ title: res.string.宏文件, jsx: <MacroFile /> }],
        lineExist: true,
      },
      {
        title: res.string.方案共享,
        src: res.img.leftbar_programme,
        changeable: false,
        mouse: [],
        keyboard: [],
        common: [
          {
            title: '配置文件',
            jsx: <ConfigScheme />,
          },
          {
            title: res.string.宏文件,
            jsx: <MacroScheme />,
          },
        ],
        lineExist: true,
      },
      {
        title: res.string.个人中心,
        src: res.img.leftbar_personal,
        changeable: false,
        mouse: [],
        keyboard: [],
        common: [{ title: '', jsx: <UserCenter /> }],
        lineExist: false,
      },
      {
        title: res.string.支持,
        src: res.img.leftbar_support,
        changeable: false,
        mouse: [],
        keyboard: [],
        common: [{ title: '', jsx: <Support /> }],
        lineExist: false,
      },
    ]

  if (blockCloud) {
    console.log('SPLLLICCCCEEE')
    __________items.splice(3, 2)
  }
  const { textDisplay } = useStore()
  const { macroStore } = useStore()
  const { shareStore } = useStore()

  return useObserver(() => {
    return (
      <Fragment>
        <dj.View w={224} h={605} y={61}>
          <dj.VerticalLine x={224} />
          <dj.FlexView w={224} h={315} x={38} y={44} flexDirection={'column'}>
            {__________items.map((item, index) => (
              <dj.Button
                relative
                key={index}
                w={106}
                h={45}
                img={{
                  size: {
                    w: 22,
                    h: 22,
                  },
                  src: item.src,
                }}
                textW={72}
                mode={'侧边栏'}
                isHightLight={pageStore.pageIndex === index}
                text={item.title}
                clickHandle={() => {
                  if(macroStore.recodingState === 'stop') {
                    textDisplay.setIsDis(false)
                    pageStore.setPageIndex(index)
                    setSubPageIndex(0)
                    index === 4 && deviceStore.getUserDevList()
                  } else {
                    mobxStore.toastStore.setInfo(res.text.请先停止录制())
                  }
                }}
              />
            ))}
          </dj.FlexView>
        </dj.View>
        <dj.View w={975} h={604} x={224} y={61}>
          <dj.View w={352} h={40} x={40} y={44}>
            {__________items[pageStore.pageIndex].lineExist && (
              <dj.Line y={40} w={880} lineColor={'Normal'} />
            )}

            <dj.FlexView>
              {__________items[pageStore.pageIndex][
                __________items[pageStore.pageIndex].changeable
                  ? deviceStore.currentDev
                    ? deviceStore.currentDev.type
                    : 'keyboard'
                  : 'common'
              ].map(
                (v, index) =>
                  v.title !== '' && (
                    <SubNavbarItem
                      key={index}
                      title={v.title}
                      isClick={
                        pageStore.pageIndex !== 3 
                        ? subPageIndex === index
                        : shareStore.currentShareListNum === index
                      }
                      clickHandle={() => {
                        index===0&&shareStore.setCurrentShareListNum(index)
                        index===1&&shareStore.setCurrentShareListNum(index)
                        setSubPageIndex(index)
                      }}
                    />
                  )
              )}
            </dj.FlexView>
          </dj.View>

          <dj.View x={44} y={85} w={891} h={583}>
            {''}
            {__________items[pageStore.pageIndex][
              __________items[pageStore.pageIndex].changeable
                ? deviceStore.currentDev
                  ? deviceStore.currentDev.type
                  : 'common'
                : 'common'
            ].length <= subPageIndex
              ? setSubPageIndex(0)
              : __________items[pageStore.pageIndex][
                __________items[pageStore.pageIndex].changeable
                  ? deviceStore.currentDev
                    ? deviceStore.currentDev.type
                    : 'common'
                  : 'common'
              ][pageStore.pageIndex !== 3? subPageIndex : shareStore.currentShareListNum].jsx}
          </dj.View>
        </dj.View>
      </Fragment>
    )
  })
}
