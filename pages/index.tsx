import { Conversation, RequestQueryConversation } from "./api/converse-edge"
import { forwardRef, LegacyRef, useRef, useState } from "react"
import Head from "next/head"
import { Inter } from "@next/font/google"
import { SubmitHandler, useForm } from "react-hook-form"
import useServerSentEvents from "hooks/useServerSentEvents"
import Image from 'next/image'


interface FormData {
  prompt: string
}

function MessageHuman({ message }: { message: string }) {
  return (
    <div className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800">
      <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
        <div className="bg-gray-300 relative w-8 h-8 p-1 rounded-sm text-gray-600 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <div className="relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
              {message}
            </div>
          </div>
          <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
            <button
              disabled
              className="cursor-not-allowed p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MessageBot = forwardRef(
  (
    { message, hidden }: { message: string; hidden?: boolean },
    ref?: LegacyRef<HTMLParagraphElement>
  ) => {
    return (
      <div
        className={`${
          hidden ? "hidden" : "block"
        } w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]`}
      >
        <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
          <div className="bg-[#10a37f] relative w-8 h-8 p-1 rounded-sm text-white flex items-center justify-center">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
	    <foreignObject x="0" y="0" width="100" height="100">
	         <Image src="/cleese.png" layout="fill" />
	    </foreignObject>
            </svg>
          </div>
          <div className="relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                <div className="markdown prose w-full break-words dark:prose-invert dark">
                  <p ref={ref}>{message}</p>
                </div>
              </div>
            </div>
            <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
              <button className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
              <button className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
MessageBot.displayName = "MessageBot"

export default function Page() {
  const bioNode = useRef<HTMLParagraphElement>(null)
  const [conversation, setConversation] = useState<Conversation>({
    history: [],
  })
  const [streaming, setStreaming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const { openStream } = useServerSentEvents<RequestQueryConversation>({
    baseUrl: "/api/converse-edge",
    config: {
      withCredentials: false,
    },
    onData,
    onOpen: () => {
      reset()
      if (bioNode.current) {
        console.log("resetting")
        bioNode.current.innerText = ""
      }
    },
    onClose: () => {
      document
        .getElementById(`speech-${conversation.history.length - 1}`)
        ?.scrollIntoView({ behavior: "smooth" })
      setStreaming(false)
      setConversation((prev) => {
        return {
          ...prev,
          history: [
            ...prev.history,
            {
              speaker: "bot",
              text: bioNode.current?.innerText.replace(/<br>/g, "\n") as string,
            },
          ],
        }
      })
    },
    onError: (event) => {
      console.error(event)
      setStreaming(false)
      setError(`Something went wrong with the request`)
    },
  })

  function onData(data: string) {
    if (!bioNode.current) {
      return
    }
    try {
      let text = JSON.parse(data).choices[0].delta.content
      if (text) {
        bioNode.current.innerText = bioNode.current.innerText + text
      }
    } catch (err) {
      console.log(`Failed to parse data: ${data}`)
      setError(`Failed to parse the response`)
    }
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (bioNode.current) {
      bioNode.current.innerText = "..."
    }
    setStreaming(true)

    const newConversation: Conversation = {
      history: [
        ...conversation.history,
        { speaker: "human", text: data.prompt },
      ],
    }

    setConversation(newConversation)
    const evtSource = openStream({
      query: {
        conversation: JSON.stringify(newConversation),
        temperature: "0.7",
      },
    })
  }

  return (
    <div className="dark:bg-gray-800">
      {/* <div className="border-b">
        <div className="md:max-w-2xl lg:max-w-2xl xl:max-w-3xl mx-auto">
          <h1 className="dark:text-white text-lg font-bold py-4">
            ChatGPT Clone
          </h1>
        </div>
      </div> */}
      <main className="relative min-h-screen w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800">
              {conversation.history.map((x, i) =>
                x.speaker === "human" ? (
                  <MessageHuman key={i} message={x.text} />
                ) : (
                  <MessageBot key={i} message={x.text} />
                )
              )}
              <MessageBot ref={bioNode} message="..." hidden={!streaming} />
              <div className="w-full h-48 flex-shrink-0"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
          >
            <div className="relative flex h-full flex-1 md:flex-col">
              <div className="ml-1 mt-1.5 hidden md:w-full md:m-auto md:flex md:mb-2 gap-2 justify-center">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed items-center bg-white border-gray-900 text-[#40414F]  dark:bg-[#343541] dark:border-[#565869] dark:text-[#D9D9E3] border-transparent rounded-md border inline-flex text-sm px-3 py-2 pointer-events-auto justify-center"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 mr-2"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                  Regenerate response
                </button>
              </div>
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  tabIndex={0}
                  rows={1}
                  placeholder=""
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSubmit(onSubmit)()
                    }
                  }}
                  className="max-h-52 h-6 overflow-y-hidden m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
                  {...register("prompt", { required: true })}
                />
                <button
                  type="submit"
                  className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 20 20"
                    className="h-4 w-4 rotate-90"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="lg:mx-auto lg:max-w-3xl">
            <p className="text-sm py-4 text-red-500">{error}</p>
            <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
              <a
                href="https://chat.openai.com/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                ChatGPT
              </a>{" "}
              web app clone. Stack: NextJS Edge API Routes, gpt-4,
              TailwindCSS.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
