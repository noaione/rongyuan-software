import React from 'react'
import { dj } from '../../dj'
import { useStore } from '../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { res } from '../../res'

export const Loading = () => {
  const { toastStore } = useStore()

  return useObserver(() =>
    toastStore.state === 'bussy' ? (
      <dj.View form={'loading'} drag={true}>
        <dj.Rotate w={34} h={34} x={583} y={348}>
          <dj.Img imgBg={res.img.loading} type={'完全覆盖背景区'} />
        </dj.Rotate>
      </dj.View>
    ) : null
  )
}
