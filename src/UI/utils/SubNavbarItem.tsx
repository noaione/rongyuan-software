import React, { Fragment } from 'react'
import { dj } from '../../dj'

export const SubNavbarItem = (props: {
  title: React.ReactNode
  isClick: boolean
  clickHandle: () => void
}) => {
  const { title, isClick, clickHandle } = props

  return (
    <Fragment>
      <dj.Button
        relative
        w={100}
        mode={'子侧边栏'}
        isHightLight={isClick}
        text={title}
        clickHandle={() => clickHandle()}
      />
      <dj.View relative w={20}>
        {''}
      </dj.View>
    </Fragment>
  )
}

//      pure={{
//   borderRaidus: isClick ? '2px' : '0',
//   boderBottomColor: isClick ? '#23f9e2' : 'transparent',
// }}
