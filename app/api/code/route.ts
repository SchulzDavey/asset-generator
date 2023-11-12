import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionMessage,
} from "openai/resources/chat/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: ChatCompletionMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return NextResponse.json({ message: "No user found" }, { status: 400 });
    }

    if (!openai.apiKey) {
      return NextResponse.json(
        { message: "API key is missing" },
        { status: 400 }
      );
    }

    if (!messages) {
      return NextResponse.json(
        { message: "Messages are required" },
        { status: 400 }
      );
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return NextResponse.json(
        { message: "Free trial has expired." },
        { status: 403 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("CODE_ERROR", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
