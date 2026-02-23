import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "FIRE App <onboarding@resend.dev>",
      to: process.env.FEEDBACK_EMAIL!,
      subject: "FIRE App Feedback",
      text: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback send failed:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
