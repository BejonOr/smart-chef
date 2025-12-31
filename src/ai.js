export async function getRecipeFromMistral(ingredientsArr) {
  const response = await fetch("/.netlify/functions/getRecipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients: ingredientsArr }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch recipe")
  }

  const data = await response.json()
  return data.recipe
}
