import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return NextResponse.json({ message: "No user found" }, { status: 400 });
    }

    if (!prompt) {
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

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.log("MUSIC_ERROR", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
