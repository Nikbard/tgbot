import { unlink } from 'fs/promises'

export const removeFile = async (path) => {
    try {
        await unlink(path)
    } catch (error) {
        console.error('remove', error.message)
    }
}