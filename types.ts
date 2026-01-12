
export enum MealTime {
  BREAKFAST = '아침',
  LUNCH = '점심',
  DINNER = '저녁'
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredientsUsed: string[];
  additionalIngredientsNeeded: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
  imageUrl?: string; // AI generated image URL
}

export interface RecipeResponse {
  recipes: Recipe[];
}
