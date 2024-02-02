import { OpenAI } from 'openai'

export default defineEventHandler(async event => {
  const openai = new OpenAI({
    apiKey: useRuntimeConfig().openai.token
  })
  const body = await readBody(event)
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content: 'You only speak JSON. You are a computer in charge of modifying elements of a Vue application to suit the needs of the user.'
      },
      {
        role: 'system',
        content: 'Here is the current state of the app in JSON format:\n\n' + JSON.stringify(body.malleables, null, 2)
      },
      {
        role: 'user',
        content: body.prompt
      },
      {
        role: 'system',
        content: 'Provide the new state of the app in JSON format:\n\n'
      }
    ]
  })
  return JSON.parse(result.choices[0].message.content!)
})
