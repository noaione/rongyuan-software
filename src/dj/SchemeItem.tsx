import React from 'react'
import { Text, TextEll } from './Text'
import { Button } from './Button'
import { res } from '../res'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SchemeItem = (p: {
  mode: 'head' | 'body'
  name: React.ReactNode
  describe: React.ReactNode
  deviceName: React.ReactNode
  username: React.ReactNode
  time: React.ReactNode
  downloadTimes: React.ReactNode
  detail: React.ReactNode
  download: () => void
}) => {
  const els: { name: React.ReactNode; offsetX: number; optional: boolean }[] = [
    {
      name: p.name,
      offsetX: 30,
      optional: false,
    },
    {
      name: p.describe,
      offsetX: 168,
      optional: false,
    },
    {
      name: p.deviceName,
      offsetX: 378,
      optional: false,
    },
    {
      name: p.username,
      offsetX: 462,
      optional: false,
    },
    {
      name: p.time,
      offsetX: 543,
      optional: false,
    },
    {
      name: p.downloadTimes,
      offsetX: 675,
      optional: false,
    },
    // {
    //   name: p.detail,
    //   offsetX: 754,
    //   optional: true,
    // },
    {
      name: res.string.下载,
      offsetX: 814,
      optional: true,
    },
  ]

  const textWidth = ['100px','200px','75px','70px','80px','60px','']
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: p.mode === 'head' ? '#201f1f' : 'transparent',
        color: p.mode === 'head' ? '#7a7a7a' : '#959595',
      }}>
      {els.map((item, index) => (
        <div
          key={item.offsetX}
          style={{
            left: item.offsetX,
            position: 'absolute',
            top: 8,
            height: 17,
            width:textWidth[index]
          }}>
          {!item.optional || p.mode === 'head' ? (
            <TextEll
              text={item.name}
              type={p.mode === 'head' ? '方案共享页表头' : '方案共享页表内容'}
            />
          ) : (
            <div
              style={{ width: 49, height: 24, position: 'absolute', top: -3 }}>
              <Button
                mode={'Scheme'}
                text={res.string.下载}
                clickHandle={p.download}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
