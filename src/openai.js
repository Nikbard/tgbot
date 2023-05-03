import { Configuration, OpenAIApi } from "openai"
import config from 'config'
import { createReadStream } from 'fs'
import { removeFile } from "./utils.js";

class OpenAi {
    roles = {
        ASSISTANT: 'assistant',
        USER: 'user',
        SYSTEM: 'system',
    }

    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey,
          });
        
        this.openai = new OpenAIApi(configuration);
    }

    async chat(messages) {
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages
            })

            return {message: response.data.choices[0].message, limit: response.headers['x-ratelimit-remaining-tokens']}
        } catch (error) {
            console.error('error chat', error.message)
        }
    }

    async transcription(filepath) {
        try {
            const response = await this.openai.createTranscription(
                createReadStream(filepath),
                'whisper-1'
            )

            removeFile(filepath)

            return response.data.text
        } catch (error) {
            console.error('error transcription', error.message)
        }
    }
}

export const openai = new OpenAi(config.get("OPENAI_KEY"))