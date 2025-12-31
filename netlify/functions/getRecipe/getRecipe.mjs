import { InferenceClient } from "@huggingface/inference"

const client = new InferenceClient(process.env.HF_ACCESS_TOKEN)

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients a user has
and suggests a recipe they could make with some or all of those ingredients.
You may add a few extra ingredients if needed.
Format the response in markdown.
`

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  try {
    const { ingredients } = await request.json()

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid ingredients array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const response = await client.chatCompletion({
      model: "HuggingFaceTB/SmolLM3-3B",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredients.join(", ")}. What recipe should I make?`,
        },
      ],
      max_tokens: 1024,
    })

    return new Response(
      JSON.stringify({
        recipe: response.choices[0].message.content,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Inference error:", error)

    return new Response(
      JSON.stringify({ error: "Failed to fetch recipe" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

