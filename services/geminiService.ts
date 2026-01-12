
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, Recipe, RecipeResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Generates a photorealistic image for a given recipe
 */
export const generateRecipeImage = async (recipeName: string, description: string): Promise<string | undefined> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, photorealistic, professional food photography of a dish called "${recipeName}". Description: ${description}. The lighting is bright and natural, served on an elegant plate, top-down view or 45-degree angle, cinematic composition.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
};

export const getRecipeRecommendations = async (
  ingredients: string[],
  mealTime: MealTime
): Promise<RecipeResponse> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const prompt = `냉장고에 있는 재료들: [${ingredients.join(", ")}]
현재 식사 시간: ${mealTime}

위의 재료들을 주재료로 활용하여 ${mealTime} 식사에 어울리는 요리 레시피 3가지를 추천해줘. 
냉장고에 없는 필수 부재료가 있다면 '추가로 필요한 재료' 항목에 포함시켜줘.
모든 설명은 한국어로 작성해줘.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredientsUsed: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                additionalIngredientsNeeded: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                instructions: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                cookingTime: { type: Type.STRING },
                difficulty: { 
                  type: Type.STRING,
                  description: '쉬움, 보통, 어려움 중 하나'
                },
              },
              required: ["id", "name", "description", "ingredientsUsed", "instructions", "cookingTime", "difficulty"]
            }
          }
        },
        required: ["recipes"]
      },
    },
  });

  try {
    const recipeData = JSON.parse(response.text) as RecipeResponse;
    return recipeData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("레시피를 생성하는 중 오류가 발생했습니다.");
  }
};
