import { openai } from "@ai-sdk/openai";
import { createOllama } from 'ollama-ai-provider';
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: 'http://localhost:11434/api',
});


export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: ollama("mistral"),
    messages,
    // forward system prompt and tools from the frontend
    toolCallStreaming: true,
    system,
    tools: {
      ...frontendTools(tools),
    },
    onError: console.log,
  });

  return result.toDataStreamResponse();
}
