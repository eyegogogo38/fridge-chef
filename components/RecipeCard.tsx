
import React from 'react';
import { Recipe } from '../types.ts';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="group bg-neutral-900/40 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 flex flex-col transition-all duration-700 hover:border-orange-500/30 hover:shadow-[0_40px_100px_-20px_rgba(249,115,22,0.15)]">
      {/* Recipe Image Container with Dark Gradient Overlay */}
      <div className="relative h-80 overflow-hidden bg-black">
        {recipe.imageUrl ? (
          <>
            <img 
              src={recipe.imageUrl} 
              alt={recipe.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/20"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950">
            <i className="fa-solid fa-utensils text-5xl text-neutral-800 animate-pulse"></i>
            <span className="text-[10px] font-black text-neutral-700 mt-6 uppercase tracking-[0.4em]">Optimizing Vision...</span>
          </div>
        )}
        <div className="absolute top-8 left-8 flex gap-3">
          <span className="text-[10px] uppercase tracking-widest font-black px-5 py-2 bg-orange-600/90 backdrop-blur-xl text-white rounded-full shadow-2xl">
            {recipe.difficulty}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-black px-5 py-2 bg-neutral-900/80 backdrop-blur-xl text-neutral-300 rounded-full border border-white/10">
            <i className="fa-regular fa-clock mr-2 text-orange-400"></i> {recipe.cookingTime}
          </span>
        </div>
      </div>

      <div className="p-12 space-y-10">
        <div className="space-y-4">
          <h3 className="text-4xl font-[900] text-white leading-tight tracking-tighter">
            {recipe.name}
          </h3>
          <p className="text-neutral-400 text-lg leading-relaxed font-light italic opacity-80">
            "{recipe.description}"
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-800/30 p-8 rounded-[2.5rem] border border-white/5">
            <h4 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-6 flex items-center">
              <i className="fa-solid fa-circle-check text-green-500/70 mr-3"></i> Current Inventory
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {recipe.ingredientsUsed.map((ing, i) => (
                <span key={i} className="text-xs font-bold bg-neutral-900/50 text-neutral-300 px-4 py-2 rounded-xl border border-white/5">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-orange-950/20 p-8 rounded-[2.5rem] border border-orange-500/10">
            <h4 className="text-[11px] font-black text-orange-500/60 uppercase tracking-[0.3em] mb-6 flex items-center">
              <i className="fa-solid fa-plus-circle mr-3"></i> Missing Essentials
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {recipe.additionalIngredientsNeeded.length > 0 ? (
                recipe.additionalIngredientsNeeded.map((ing, i) => (
                  <span key={i} className="text-xs font-bold bg-orange-500/10 text-orange-400/90 px-4 py-2 rounded-xl border border-orange-500/20">
                    {ing}
                  </span>
                ))
              ) : (
                <span className="text-xs font-bold text-neutral-600 italic">No extra items needed</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-8 flex items-center border-b border-white/5 pb-6">
            <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-3"></i> Step-by-Step Guide
          </h4>
          <div className="space-y-8">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-8 group/step">
                <div className="relative flex-shrink-0">
                  <span className="relative z-10 w-10 h-10 bg-neutral-800 text-white rounded-2xl flex items-center justify-center font-black text-sm border border-white/10 shadow-2xl group-hover/step:bg-orange-600 group-hover/step:border-orange-500 group-hover/step:scale-110 transition-all duration-500">
                    {i + 1}
                  </span>
                  <div className="absolute inset-0 bg-orange-500 blur-xl opacity-0 group-hover/step:opacity-20 transition-opacity"></div>
                </div>
                <p className="text-[16px] text-neutral-300 leading-loose font-medium pt-1 opacity-90 group-hover/step:opacity-100 transition-opacity">
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
