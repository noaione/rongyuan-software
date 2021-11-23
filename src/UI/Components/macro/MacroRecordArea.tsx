import React, { Fragment } from 'react'
import { MacroList } from './MacroList'
import { dj } from '../../../dj'
import { res } from '../../../res'
import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { Macro } from '../../../sdk/DB'
import { blockCloud } from '../../../appConfig'

export const MacroRecordArea = () => {
  const { macroStore } = useStore()

  const saveMacro = async () => {
    const save = new Macro()
    save.value = {
      original: 0,
      type: 'ConfigMacro',
      macro: macroStore.currentRecMacroArr,
      macroType: macroStore.macroType,
      repeatCount: macroStore.repeatTimes,
    }
    save.category = macroStore.currentSelectMacro?.category
    save.localId = macroStore.currentSelectMacro?.localId
    save.name = macroStore.currentSelectMacro?.name

    macroStore.stoptHook()
    macroStore.saveMacro()
  }

  return useObserver(() => (
    <Fragment>
      <dj.View w={580} h={32} x={311} y={25}>
        <dj.View>
          <dj.RadioButton
            x={22}
            type={'方形'}
            name={'宏播放形式'}
            text={res.text.循环次数()}
            isChecked={macroStore.macroType === 'repeat_times'}
            clickHandle={() => {
              macroStore.setMacroType('repeat_times')
            }}
          />
          <dj.SpinBox
            w={74}
            h={22}
            x={110}
            y={-3}
            min={1}
            max={9999}
            value={macroStore.repeatTimes}
            step={1}
            setValue={(value: number) => {
              macroStore.setRepeatTimes(value)
            }}
            changeFinished={(value: number) => macroStore.setRepeatTimes(value)}
          />
        </dj.View>
        <dj.RadioButton
          w={201}
          x={225}
          type={'方形'}
          name={'宏播放形式'}
          text={res.text.使用指派按键切换开关播放()}
          isChecked={macroStore.macroType === 'on_off'}
          clickHandle={() => {
            macroStore.setMacroType('on_off')
          }}
        />
        <dj.RadioButton
          w={blockCloud ? 200 : 100}
          x={blockCloud ? 425 : 465}
          type={'方形'}
          name={'宏播放形式'}
          text={res.text.按下时播放()}
          isChecked={macroStore.macroType === 'touch_repeat'}
          clickHandle={() => {
            macroStore.setMacroType('touch_repeat')
          }}
        />
      </dj.View>
      <dj.View w={580} h={447} x={311} y={57} form={'Border'}>
        <dj.View w={580} h={34} form={'MacroBackground'}>
          <dj.Button
            w={58}
            h={18}
            x={21}
            y={7}
            mode={'Bluer'}
            text={
              macroStore.recodingState === 'recording'
                ? res.string.结束录制
                : res.string.开始录制
            }
            clickHandle={() => {
              macroStore.recodingState === 'stop'
                ? macroStore.starHook()
                : macroStore.stoptHook()
              macroStore.stopMouseEvent()
            }}
            mouseEnter={() => {
              macroStore.recodingState === 'recording' &&
                macroStore.stopMouseEvent()
            }}
            mouseLeave={() => {
              macroStore.recodingState === 'recording' &&
                macroStore.startMouseEvent()
            }}
          />
          <dj.Button
            w={58}
            h={18}
            x={203}
            y={7}
            mode={'Bluer'}
            text={res.string.清空}
            isDisabled={macroStore.recodingState === 'recording'}
            clickHandle={() => macroStore.setCurrentRecMacroArr([])}
          />
          <dj.Button
            w={58}
            h={18}
            x={510}
            y={7}
            mode={'Bluer'}
            text={res.string.保存}
            clickHandle={saveMacro}
            mouseEnter={() => {
              macroStore.recodingState === 'recording' &&
                macroStore.stopMouseEvent()
            }}
            mouseLeave={() => {
              macroStore.recodingState === 'recording' &&
                macroStore.startMouseEvent()
            }}
          />
        </dj.View>
        <MacroList />
      </dj.View>
    </Fragment>
  ))
}
