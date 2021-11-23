import React, { useState } from 'react'

import { remote } from 'electron'

import { res } from '../res'
import { dj } from '../dj'
import { store } from './store'
import { useStore } from '../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { blockCloud, kCompany, topnav_logo_p, urlStr } from '../appConfig'

import * as path from 'path'

export const Top = () => {
  const { userStore } = useStore()

  const testC = () => {
    const fs = require('fs');
    const currentC_p = path.join('..', 'CurrentCompany.json')
    const currentCompany = require(currentC_p) as {
      'currentCompany': string
    }
    //test
    // const true_p = process.cwd() + '/company/company_' + currentCompany.currentCompany + '/CONFIG.json'
    
    //安装包
    const true_p = process.cwd() + '/resources/app/company/company_' + currentCompany.currentCompany + '/CONFIG.json'
    
    const configjson_p = '/company/company_' + currentCompany.currentCompany + '/CONFIG.json'
    const cObj = require('..' + configjson_p)

    const aa = {
      "company": cObj['company'],
      "displayName": cObj['displayName'],
      "blockCloud": blockCloud ? false : true,
    }
    fs.writeFile(true_p, JSON.stringify(aa), (err:any) => {
      if (err)
        console.error('XXXXXXXXXXX')
      else
        remote.getCurrentWindow().reload()
    })
  }

  return useObserver(() => (
    <dj.View w={1200} h={61} drag={true}>
      {kCompany === '比乐' && <dj.Button
        w={100}
        h={30}
        x={90}
        y={20}
        mode={'Border'}
        text={'中 / Eng'}
        clickHandle={() =>testC()}
      ></dj.Button>}
      <dj.Img w={35} h={29} x={42} y={20} imgBg={urlStr(topnav_logo_p)}></dj.Img>
      {userStore.user === undefined ? (
        !blockCloud && (
          <dj.Button
            x={968}
            y={19}
            w={70}
            h={26}
            isHightLight={false}
            mode={'Lighter'}
            text={'登录/注册'}
            clickHandle={() => store.setState.userOpen(true)}
          />
        )
      ) : (
          <dj.TextEll
            w={100}
            h={20}
            x={968}
            y={21}
            type={'SubTitle'}
            text={!blockCloud ? userStore.user.name : ''}></dj.TextEll>
        )}
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
        clickHandle={() => remote.getCurrentWindow().hide()}
      />
      <dj.Line y={61} h={1} lineColor={'Normal'} />
    </dj.View>
  ))
}
