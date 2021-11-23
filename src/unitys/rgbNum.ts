export const rgbToNum = (r: number, g: number, b: number) => {
    return (r << 16) | (g << 8) | (b)
}

export const numToRgb = (rgb: number) => {
    const r = (rgb & 0xff0000) >> 16
    const g = (rgb & 0x00ff00) >> 8
    const b = (rgb & 0x0000ff)

    return { r, g, b }
}