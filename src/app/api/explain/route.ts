import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request to the /api/explain route.
 * This function takes an original and an engineered prompt and returns
 * an AI-generated explanation of the improvements.
 */
export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new NextResponse(
      JSON.stringify({ error: "OpenRouter API key not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { originalPrompt, engineeredPrompt } = await req.json();

    if (!originalPrompt || !engineeredPrompt) {
      return new NextResponse(
        JSON.stringify({ error: "Original and engineered prompts are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const finalPrompt = `You are an expert prompt engineering instructor. Your goal is to explain WHY the "Engineered Prompt" is better and more effective than the "Original Prompt".

Focus your explanation on the core principles of good prompt design that were applied, such as adding a persona, providing context, specifying a format, and adding constraints.
Keep your explanation concise, clear, and educational for someone new to prompt engineering. Use markdown for formatting if it helps clarify the points.

---
**Original Prompt:**
"""
${originalPrompt}
"""
---
**Engineered Prompt:**
"""
${engineeredPrompt}
"""
---

Now, provide the explanation.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error (Explain):", errorText);
      return new NextResponse(
        JSON.stringify({ error: `OpenRouter API error: ${response.statusText}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const explanation = data.choices[0]?.message?.content;

    if (!explanation) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to get a valid explanation from the AI model." }),
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify({ explanation }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal server error (Explain):", error);
    return new NextResponse(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
