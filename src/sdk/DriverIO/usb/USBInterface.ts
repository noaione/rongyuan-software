import { DeviceType } from "../../DB";

export class USBInterface {
    deviceType: DeviceType;

    constructor(dev: DeviceType) {
        this.deviceType = dev;
    }

    initDevice: () => Promise<boolean> = () => {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    destroyDevice: () => Promise<boolean> = async () => {
        return true;
    }

    sendOutputReport: (reportId: number, buf: Buffer) => Promise<boolean> = (
        reportId: number,
        buf: Buffer
    ) =>
        new Promise((resolve) => {
            resolve(true);
        });

    readInputReport: (reportId: number) => Promise<Buffer | undefined> = async (
        reportId: number
    ) => {
        return Buffer.from([]);
    };

    sendFeature: (buf: Buffer) => Promise<boolean> = (buf: Buffer) =>
        new Promise((resolve) => {
            resolve(true);
        });
    
    readFeature: (buf: Buffer) => Promise<Buffer | undefined> = async (buf: Buffer) => {
        return Buffer.from([]);
    }

    writeData = async (buf: Buffer) => {
        return true;
    }

    readData = async () => {
        return Buffer.from([]);
    }
}