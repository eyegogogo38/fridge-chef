
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="group bg-white rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col transition-all duration-700 hover:shadow-[0_30px_70px_-15px_rgba(249,115,22,0.2)]">
      {/* Recipe Image Container */}
      <div className="relative h-72 overflow-hidden bg-gray-50">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50/50">
            <i className="fa-solid fa-utensils text-4xl text-orange-200 animate-pulse"></i>
            <span className="text-[10px] font-black text-orange-300 mt-4 uppercase tracking-[0.2em]">Image Loading...</span>
          </div>
        )}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="text-[10px] uppercase tracking-widest font-black px-4 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-full">
            {recipe.difficulty}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-black px-4 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-full shadow-sm">
            <i className="fa-regular fa-clock mr-1 text-orange-500"></i> {recipe.cookingTime}
          </span>
        </div>
      </div>

      <div className="p-10 space-y-8">
        <div>
          <h3 className="text-3xl font-[900] text-gray-900 leading-tight mb-4">
            {recipe.name}
          </h3>
          <p className="text-gray-500 text-base leading-relaxed font-medium italic">
            "{recipe.description}"
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/70 p-6 rounded-[2rem] border border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center">
              <i className="fa-solid fa-carrot text-orange-500 mr-2"></i> Using Items
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredientsUsed.map((ing, i) => (
                <span key={i} className="text-xs font-bold bg-white text-gray-700 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-orange-50/40 p-6 rounded-[2rem] border border-orange-100/50">
            <h4 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-4 flex items-center">
              <i className="fa-solid fa-basket-shopping mr-2"></i> Additional
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.additionalIngredientsNeeded.length > 0 ? (
                recipe.additionalIngredientsNeeded.map((ing, i) => (
                  <span key={i} className="text-xs font-bold bg-white text-orange-700 px-3 py-1.5 rounded-xl shadow-sm border border-orange-100">
                    {ing}
                  </span>
                ))
              ) : (
                <span className="text-xs font-bold text-orange-300 italic">No extra items needed!</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-100 pb-4">
            <i className="fa-solid fa-fire-burner text-orange-500 mr-2"></i> Cooking Instructions
          </h4>
          <div className="space-y-6">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-6 group/step">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-lg shadow-gray-200 group-hover/step:bg-orange-500 group-hover/step:scale-110 transition-all duration-300">
                  {i + 1}
                </span>
                <p className="text-[15px] text-gray-700 leading-relaxed font-medium pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
