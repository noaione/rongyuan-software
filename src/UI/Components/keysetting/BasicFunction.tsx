import React, { Fragment } from 'react'
import { dj } from '../../../dj'
import { res } from '../../../res'
const ___items: SpecialFuntion[] = [
  '播放器',
  '播放/暂停',
  '停止',
  '上一曲',
  '下一曲',
  '音量减',
  '音量大',
  '静音',
]

const showItems = {
  '播放器': res.string.播放器,
  '播放/暂停': res.string.播放暂停,
  停止: res.string.停止,
  上一曲: res.string.上一曲,
  下一曲: res.string.下一曲,
  音量减: res.string.音量减,
  音量大: res.string.音量大,
  静音: res.string.静音,
}

export const BasicFunction = (p: {
  basic: SpecialFuntion | undefined
  setBasic: (basic: SpecialFuntion | undefined) => void
  oldValue: ConfigFunction | undefined
  forBidden:boolean
}) => {
  let changedText
  const forBidden = p.forBidden
  if (p.oldValue !== undefined) {
    changedText = showItems[p.oldValue.key as keyof typeof showItems] //p.oldValue.key
  }

  return (
    <Fragment>
      <dj.Text text={changedText} type={'已修改的按键值'} x={57} y={7} h={36} />

      <dj.List
        w={342}
        h={145}
        x={54}
        y={48}
        itemCount={___items.length}
        scrollToIndex={0}
        itemSize={() => 30}
        renderItem={(i: number) => (
          <dj.CheckBox2
            relative
            key={i}
            h={32}
            type={'Normal'}
            text={showItems[___items[i] as keyof typeof showItems]}
            checkState={p.basic === ___items[i]&&forBidden}
            isBool={forBidden}
            clickHandle={() => {
              if(forBidden){
                p.basic !== ___items[i]
                ? p.setBasic(___items[i])
                : p.setBasic(undefined)
              } else {
                p.setBasic(undefined)
              }
              
            }}
          />
        )}
      />
    </Fragment>
  )
}
