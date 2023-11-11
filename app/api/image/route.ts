import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return NextResponse.json({ message: "No user found" }, { status: 400 });
    }

    if (!openai.apiKey) {
      return NextResponse.json(
        { message: "API key is missing" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { message: "prompt is required" },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { message: "amount is required" },
        { status: 400 }
      );
    }

    if (!resolution) {
      return NextResponse.json(
        { message: "resolution is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("IMAGE_ERROR", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
