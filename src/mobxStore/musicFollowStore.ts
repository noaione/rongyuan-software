import { desktopCapturer, remote } from 'electron'
import { observable, action, autorun, reaction } from 'mobx'
import { res } from '../res'
import { sleep } from '../unitys/timeFunc'


import { BaseStore } from './baseStore'
import { mobxStore } from './store'

const kBufferSize = 128

export class MusicFollowStore extends BaseStore {

    constructor() {
        super()
        // setTimeout(() => {
        //     autorun(() => console.log(this.musicDataArray, mobxStore.toastStore.state))
        // });

        // autorun(() =>{
        //     console.log('MMMMUUUSSSSIIICCCC', this.trackTimer, this.musicDataArray)
        //     console.error(time - new Date().getTime())
        //     time = new Date().getTime()
        // })
    }
    @observable musicDataArray = new Uint8Array();


    @observable isStart = false
    private context: AudioContext | undefined
    private mediaStream: MediaStreamAudioSourceNode | undefined
    private trackTimer: NodeJS.Timeout | undefined
    @action.bound
    async start() {
        //if (this.isStart) this.stop()
        await sleep(1000)
        //console.error('STTARRRTTTTT')
        this.stop()
        this.isStart = true

        if (this.context) return
        desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
            // console.error(await navigator.mediaDevices.enumerateDevices())

            const checkMusicDevs = async () => {
                const hasMusicDevs = (await navigator.mediaDevices.enumerateDevices()).some(v => v.kind === 'audiooutput')
                // console.error(hasMusicDevs)
                if (!hasMusicDevs) {
                    mobxStore.toastStore.setErr(res.text.未检测到扬声器())
                } else {
                    if (this.isStart) {
                        this.start()
                    }
                }
                return hasMusicDevs
            }
            if (!navigator.mediaDevices.ondevicechange)
                navigator.mediaDevices.ondevicechange = async (ev) => {
                    console.error('EEEEEEEEEEEEEEVVVVVVVVVVVVVVV',ev)
                    if (!await checkMusicDevs()) {
                        if (this.trackTimer !== undefined)
                            clearInterval(this.trackTimer)

                        this.mediaStream?.disconnect()

                        if (this.context)
                            this.context.close()
                        this.context = undefined
                    }
                }

            if (!await checkMusicDevs()) {
                return
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: 'sourceIdCapturedUsingChromeExtension'
                        },
                    },
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                        }
                    }
                } as MediaStreamConstraints)
                this.handleStream(stream)
            } catch (e) {
                this.handleError(e.toString())
            }
            return


        })
    }

    @action.bound
    stop() {
        // if (this.trackTimer !== undefined)
        //     clearInterval(this.trackTimer)
        //remote.getGlobal('clearInterval')(this.trackTimer)

        //this.musicDataArray = new Uint8Array()
        //this.mediaStream?.disconnect()

        // if (this.context)
        //     this.context.close()
        this.isStart = false



    }



    async handleStream(stream: MediaStream) {

        //this.isStart = true
        this.context = new AudioContext()
        this.mediaStream = this.context.createMediaStreamSource(stream)
        var bufferSize = kBufferSize;
        const analyser = this.context.createAnalyser()
        // analyser.maxDecibels = -30
        // analyser.minDecibels = -150;
        analyser.smoothingTimeConstant = 0.8
        this.mediaStream.connect(analyser)
        analyser.fftSize = bufferSize;
        this.musicDataArray = new Uint8Array(analyser.frequencyBinCount);
        console.log('LLLEEEENNNNN', analyser.frequencyBinCount)

        this.trackTimer = setInterval(() => {
            //remote.getGlobal('setInterval')(() => {
            if (mobxStore.toastStore.state === 'bussy') return
            if (this.isStart === false) return
            this.musicDataArray = new Uint8Array(this.musicDataArray)
            //console.log(this.dataArray)
            //analyser.getByteTimeDomainData(dataArray)
            analyser.getByteFrequencyData(this.musicDataArray)

        }, 50)
    }

    handleError(e: string) {
        console.log('音乐律动开启source错误', e)
    }
}