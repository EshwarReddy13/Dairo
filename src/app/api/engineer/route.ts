import { NextRequest, NextResponse } from "next/server";

// A mapping to translate the persona value into a descriptive string for the AI
const personaMapping: { [key: string]: string } = {
  software_architect: "a senior software architect",
  marketing_guru: "a world-class marketing guru",
  legal_advisor: "an experienced legal advisor",
  default: "an expert in the relevant field",
};

/**
 * Handles the POST request to the /api/engineer route.
 * This function takes a user's prompt and engineers a better one using an LLM.
 */
export async function POST(req: NextRequest) {
  // 1. Check for the OpenRouter API key in environment variables
  if (!process.env.OPENROUTER_API_KEY) {
    return new NextResponse(
      JSON.stringify({ error: "OpenRouter API key not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // 2. Parse the incoming request body to get the user's prompt and persona
    const { userPrompt, persona } = await req.json();

    if (!userPrompt) {
      return new NextResponse(
        JSON.stringify({ error: "User prompt is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. Construct the "meta-prompt" using the template from the project plan
    const assignedPersona = personaMapping[persona] || personaMapping.default;

    const finalPrompt = `You are Dairo, an expert Prompt Engineering assistant. Your goal is to take a user's raw prompt and rewrite it to be significantly more effective for a large language model.

Adhere to these principles when rewriting:
1.  **Add a Persona:** Assign a clear, expert role to the LLM. For this request, the persona is: "${assignedPersona}".
2.  **Provide Context:** Add necessary background information that the LLM might need to understand the user's goal.
3.  **Specify Format:** Define the desired output format (e.g., "Provide the answer in a markdown table," "Use JSON format," "Write in a friendly, encouraging tone.").
4.  **Add Constraints:** Add negative constraints to tell the model what *not* to do (e.g., "Do not use technical jargon," "Keep the explanation under 200 words.").
5.  **Be Specific and Clear:** Remove ambiguity and add detail to ensure the output is precise.

Now, take the following user's prompt and rewrite it based on all the principles above. Return ONLY the rewritten, improved prompt and nothing else. Do not include any of your own preamble or explanation.

User's Prompt:
"""
${userPrompt}
"""`;

    // 4. Make the API call to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free", // Using a capable free model
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return new NextResponse(
        JSON.stringify({ error: `OpenRouter API error: ${response.statusText}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const engineeredPrompt = data.choices[0]?.message?.content;

    if (!engineeredPrompt) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to get a valid response from the AI model.",
        }),
        { status: 500 }
      );
    }

    // 5. Return the successful response to the frontend
    return new NextResponse(JSON.stringify({ engineeredPrompt }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return new NextResponse(
      JSON.stringify({ error: "An internal server error occurred." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
