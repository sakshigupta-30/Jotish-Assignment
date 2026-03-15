export function mergeImage(photoDataUrl, signatureCanvas) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            ctx.drawImage(signatureCanvas, 0, 0, img.width, img.height)
            resolve(canvas.toDataURL('image/png'))
        }
        img.src = photoDataUrl
    })
}
