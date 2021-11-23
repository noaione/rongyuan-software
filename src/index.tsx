import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { APP } from './UI/APP'
import { sdk } from './sdk'

import { mobxStore, MobxStoreContext } from './mobxStore/store'
import 'mobx-react-lite/batchingForReactDom'

import { remote } from 'electron'
import { ratio, baseH } from './screenConfig'
import { Test } from './UI/test'

console.log('SSSSSSSSTTTTTTTT')
sdk.init().then((v) => {
  console.log('hello world')

  //if (process.platform !== 'darwin') {
  var devInnerHeight = baseH // 开发时的InnerHeight
  var devDevicePixelRatio = 1.0// 开发时的devicepixelratio
  var devScaleFactor = ratio // 开发时的ScaleFactor
  var scaleFactor = remote.screen.getPrimaryDisplay().scaleFactor
  var zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)
  require('electron').webFrame.setZoomFactor(zoomFactor)
  //}

  // downloadDevUpgradeFile('K68_SN32F240B_V104.hex').then(v => {
  //   console.log('VVVV', v)
  // })
  ReactDOM.render(
    <MobxStoreContext.Provider value={mobxStore}>
      <APP />
      {/* <Test /> */}
    </MobxStoreContext.Provider>,
    document.querySelector('#root')
  )
})
