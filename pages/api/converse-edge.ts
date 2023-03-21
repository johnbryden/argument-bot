import type { NextRequest } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

type Speaker = "bot" | "human"

export interface Speech {
  speaker: Speaker
  text: string
}

export interface Conversation {
  history: Array<Speech>
}

export interface RequestQueryConversation {
  conversation: string
  temperature: string
}

type Messages = Parameters<typeof openai.createChatCompletion>[0]["messages"]

function getMessages({
  conversation,
}: {
  conversation: Conversation
}): Messages {
  let messages: Messages = [
    { role: "system", content: "You are an argumentative individual who tries to find the flaws in the users language. Speak in the manner of John Cleese in the Monty Python argument sketch." },
  ]
  conversation.history.forEach((speech: Speech, i) => {
    messages.push({
      role: speech.speaker === "human" ? "user" : "assistant",
      content: speech.text,
    })
  })

  let userInput = messages[messages.length -1]
  console.log(userInput)
  let prompt = "You are having an argument with someone and they have responded with '" + userInput['content'] + "'. Put an opposing perspective in a condescending tone."
//  messages[messages.length -1]['content'] = prompt

  return messages
}

function validateConversation(conversation: Conversation) {
  if (!conversation) {
    throw new Error("Invalid conversation")
  }
  if (!conversation.history) {
    throw new Error("Invalid conversation")
  }
}

function validateTemperature(temperature: number) {
  if (isNaN(temperature)) {
    throw new Error("Invalid temperature")
  }
  if (temperature < 0 || temperature > 1) {
    throw new Error("Invalid temperature")
  }
}

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  let conversation: Conversation
  let temperature: number
  try {
    conversation = JSON.parse(searchParams.get("conversation") as string)
    temperature = parseFloat(searchParams.get("temperature") as string)
    validateConversation(conversation)
    validateTemperature(temperature)
  } catch (e: any) {
    return new Response(
      JSON.stringify({ message: e.message || "Invalid parameter" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    )
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: getMessages({ conversation }),
      max_tokens: 1024,
      temperature,
      stream: true,
    })


    return new Response(completion.body, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error: any) {
    console.error(error)
    if (error.response) {
      console.error(error.response.status)
      console.error(error.response.data)
    } else {
      console.error(error.message)
    }
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler
