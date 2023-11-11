import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return NextResponse.json({ message: "No user found" }, { status: 400 });
    }

    if (process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "Key couldn't be found" },
        { status: 500 }
      );
    }

    if (!messages) {
      return NextResponse.json(
        { message: "Messages are required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const result = response.choices[0].message;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.log("CONVERSATION_ERROR", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
