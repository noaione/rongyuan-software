import * as React from 'react'
import { useStore } from '../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { store } from './store'

import { res } from '../res'
import { DeviceType } from '../sdk/DB'


export const Help = () => {
    const { deviceStore, helpStore, upgradeStore } = useStore()
    console.log('HHHHHEEEEEELLLLLPPPPPPP')
    React.useEffect(() => {
        helpStore.getCurrentComanyDevList()
    }, [])
    return useObserver(() => (
        <div style={{
            color: 'black',
            background: 'white',
            height: 1000,
            WebkitAppRegion: 'drag'
        } as React.CSSProperties}>
            <div style={{
                height: 20
            }} />
            <div >
                {res.string.您的设备在升级过程中出现了问题请选择您的设备型号重新进行升级升级过程中不要拔出USB}
            </div>
            <div style={{
                height: 20
            }} />
            <div>
                {helpStore.currentComanyDevList.map(v => {
                    return <button
                        style={{
                            height: 50,
                            width: 100
                        }}
                        onClick={() => {
                            const tmpDT = new DeviceType()
                            Object.assign(tmpDT, deviceStore.currentDev!.deviceType)
                            tmpDT.id = v.id
                            tmpDT.name = v.name

                            deviceStore.currentDev!.deviceType = tmpDT
                            deviceStore.currentDevVersion = '0'
                            upgradeStore.setUpgradeProgressDev(0)
                            store.setState.devUpgradeOpen(true)
                        }}>
                        {v.displayName}
                    </button>
                })}
            </div>
        </div>
    ))
}
