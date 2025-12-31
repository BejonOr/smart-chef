import { InferenceClient } from "@huggingface/inference"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a 
user has and suggests a recipe they could make with some or 
all of those ingredients. You don't need to use every ingredient 
they mention in your recipe. The recipe can include additional 
ingredients they didn't mention, but try not to include too 
many extra ingredients. Format your response in markdown to 
make it easier to render to a web page.
`

const client = new InferenceClient(process.env.HF_ACCESS_TOKEN)

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body)

    if (!ingredients || ingredients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredients provided" }),
      }
    }

    const response = await client.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredients.join(", ")}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        recipe: response.choices[0].message.content,
      }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipe" }),
    }
  }
}

