import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { removeFile } from "./utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`)

            return new Promise((res, rej) => {
                ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => {
                        removeFile(input)
                        res(outputPath)
                    })
                    .on('error', err => rej(err.message))
                    .run()
            })
        } catch (error) {
            console.error('error mp3', error.message)
        }
    }

    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)
            const response = await axios({ method: "GET", url, responseType: 'stream'})

            return new Promise(resolve => {
                const stream = createWriteStream(oggPath)
                response.data.pipe(stream)
                stream.on('finish', () => resolve(oggPath))
            })
        } catch (error) {
            console.error('error create egg', error.message)
        }
    }
}

export const ogg = new OggConverter()