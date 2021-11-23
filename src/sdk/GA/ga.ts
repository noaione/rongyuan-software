import ua from 'universal-analytics'
import { machineId } from 'node-machine-id'

let visitor: ua.Visitor
machineId().then(v => {
    console.log(v)
    visitor = ua('UA-175174086-1', v)
    console.log(process.platform + ' ' + require('os').release())
    visitor.set('ua', process.platform + ' ' + require('os').release())
})


export namespace GA {

    export const trackPage = (page: string) => {
        console.log('GGGAAAA',page)
        if (visitor === undefined) return
        visitor.pageview(page).send(v => {
            //console.log(page, v)
        })
    }
    export const trackScreen = (screenName: string, appName: string, appVersion: string) => {
        if (visitor === undefined) return
        visitor.screenview(screenName, appName, appVersion).send()
    }

    export const trackEvent = (category: string, action: string, label?: string, value?: string | number, page?: string) => {
        if (visitor === undefined) return
        visitor.event({
            ec: category,
            ea: action,
            el: label,
            ev: value,
            dp: page
        })
    }
    //毫秒
    export const trackTime = (category: string, value: string, time: number, label?: string) => {
        if (visitor === undefined) return
        visitor.timing({
            utc: category,
            utv: value,
            utt: time,
            utl: label
        })
        // visitor.event({
        //     ec: category,
        //     ea: value,
        //     ev: time,
        //     el: label
        // }, v => { console.log('!!!!', v) })
    }

}