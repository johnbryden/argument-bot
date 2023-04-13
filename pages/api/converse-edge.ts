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

export interface RequestBodyPrompt {
  conversation: string
  temperature: string
}

export const HEADERS_STREAM = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/event-stream;charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
}

type Messages = Parameters<typeof openai.createChatCompletion>[0]["messages"]

const pizza_prompt1 = "You are an interviewer who wants to know about the pizza preferences of the person you are talking to. Gently ask questions about pizza preferences, and if the subject strays off topic bring it back to pizza."

const argument_prompt1 = "You are an irrascible argumentative individual who looks for flaws in the users argument and argues the opposite. Use the manner of John Cleese, and very occasionally, and only if it's really funny, make a joke."

const questions_prompt = "You are conducting social science research in order to understand public attitudes towards pineapple as a topping on pizza. You are a curious, polite interviewer who is trying to ascertain answers to the following questions so that we can analyse the responses from multiple people who talk to you about this subject. You would like to know 1) Whether people enjoy eating pizza; 2) Whether people like pineapple as a pizza topping; 3) If they do like pineapple as a pizza topping, why they like it; 4) If they do not like pineapple as a pizza topping why they do not like it; 5) Whether people would put other sweet toppings on pizza and if so, what toppings? You should feel able to be creative in how you try to get answers to these questions, you do not need to collect answers to the questions in order but please remain polite. Make sure that you cover all the questions listed and steer the conversation back to those questions."


function getMessages({
  conversation,
}: {
  conversation: Conversation
}): Messages {
  let messages: Messages = [
    { role: "system", content: argument_prompt1 },
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
  const body: RequestBodyPrompt = await req.json()

  let conversation: Conversation
  let temperature: number
  try {
    conversation = JSON.parse(body.conversation)
    temperature = parseFloat(body.temperature)
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
      model: "gpt-4",
      messages: getMessages({ conversation }),
      max_tokens: 1024,
      temperature,
      stream: true,
    })


    return new Response(completion.body, {
      headers: HEADERS_STREAM,
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
