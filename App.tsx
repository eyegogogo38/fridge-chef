
import React, { useState } from 'react';
import { MealTime, Recipe } from './types';
import { getRecipeRecommendations, generateRecipeImage } from './services/geminiService';
import RecipeCard from './components/RecipeCard';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mealTime, setMealTime] = useState<MealTime>(MealTime.LUNCH);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
      setInputValue('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(item => item !== ing));
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      setError("냉장고 속 재료를 최소 하나 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      // Step 1: Get Recipes JSON
      const response = await getRecipeRecommendations(ingredients, mealTime);
      setRecipes(response.recipes);

      // Step 2: Generate images in parallel for each recipe
      const recipeWithImagesPromises = response.recipes.map(async (recipe) => {
        const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
        return { ...recipe, imageUrl };
      });

      const recipesWithImages = await Promise.all(recipeWithImagesPromises);
      setRecipes(recipesWithImages);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "레시피 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Modern Hero Header */}
        <header className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-black uppercase tracking-[0.3em] mb-2">
            <i className="fa-solid fa-sparkles animate-pulse"></i> AI Culinary Assistant
          </div>
          <h1 className="text-6xl md:text-8xl font-[950] text-gray-900 tracking-tighter leading-none">
            FRIDGE <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-600 to-amber-700">CHEF</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            재료의 낭비 없는 완벽한 한 끼. <br/>
            AI 쉐프가 당신의 냉장고 속 잠자고 있는 재료를 깨웁니다.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Controls Sidebar */}
          <div className="xl:col-span-4 space-y-8 sticky top-12">
            <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl"></div>
              
              <section className="mb-12 relative z-10">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center">
                  <i className="fa-solid fa-refrigerator mr-3 text-orange-500"></i> My Inventory
                </h2>
                
                <form onSubmit={handleAddIngredient} className="relative group mb-8">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="예: 삼겹살, 대파, 마늘"
                    className="w-full pl-8 pr-16 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500/30 focus:outline-none transition-all font-bold text-gray-800 placeholder-gray-300 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-2.5 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-xl active:scale-90"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </form>

                <div className="flex flex-wrap gap-2.5 min-h-[60px]">
                  {ingredients.length === 0 ? (
                    <div className="w-full py-12 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                      <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Add your ingredients</p>
                    </div>
                  ) : (
                    ingredients.map((ing) => (
                      <button
                        key={ing}
                        onClick={() => removeIngredient(ing)}
                        className="flex items-center gap-3 bg-white text-gray-800 px-5 py-3 rounded-2xl text-[13px] font-bold shadow-sm border border-gray-100 hover:border-red-200 hover:text-red-500 transition-all animate-scaleIn hover:shadow-md"
                      >
                        {ing}
                        <i className="fa-solid fa-circle-xmark text-[10px] opacity-20"></i>
                      </button>
                    ))
                  )}
                </div>
              </section>

              <section className="mb-12 relative z-10">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center">
                  <i className="fa-solid fa-utensils mr-3 text-orange-500"></i> Meal Occasion
                </h2>
                <div className="flex p-2 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                  {(Object.values(MealTime)).map((time) => (
                    <button
                      key={time}
                      onClick={() => setMealTime(time)}
                      className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] tracking-widest transition-all duration-500 ${
                        mealTime === time
                          ? 'bg-white text-orange-600 shadow-md border border-orange-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-white/40'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              <button
                onClick={generateRecipes}
                disabled={loading}
                className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 relative z-10 ${
                  loading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-gray-900 text-white hover:bg-orange-600 shadow-orange-500/20'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Recipes...</span>
                  </div>
                ) : (
                  <>Create Recommendations <i className="fa-solid fa-bolt-lightning text-orange-400"></i></>
                )}
              </button>

              {error && (
                <div className="mt-8 p-5 bg-red-50 text-red-500 rounded-3xl text-[12px] font-bold border border-red-100 flex items-center gap-3 animate-bounce">
                  <i className="fa-solid fa-triangle-exclamation text-lg"></i> {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="xl:col-span-8">
            {recipes.length > 0 ? (
              <div className="flex flex-col gap-12">
                {recipes.map((recipe, idx) => (
                  <div key={recipe.id} className="animate-slideUp" style={{ animationDelay: `${idx * 200}ms` }}>
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-[4rem] border-2 border-dashed border-gray-200 text-gray-400 p-16 text-center group transition-all duration-700 hover:border-orange-300 hover:bg-white/60">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                  <i className="fa-solid fa-chef-hat text-5xl text-orange-200 group-hover:text-orange-500 transition-colors"></i>
                </div>
                <h3 className="text-3xl font-[950] text-gray-900 mb-6 tracking-tight">AI 쉐프가 제안하는 오늘의 메뉴</h3>
                <p className="max-w-md text-base font-medium leading-relaxed text-gray-400">
                  냉장고 재료를 입력하고 추천을 요청하세요. <br/>
                  실사 기반 요리 사진과 상세 레시피를 즉시 생성합니다.
                </p>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-12 bg-white/40 backdrop-blur-xl rounded-[4rem]">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-pepper-hot text-2xl text-orange-500 animate-bounce"></i>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-[950] text-gray-900 tracking-tight">레시피와 이미지를 구성 중입니다</p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Designing your perfect plate...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-32 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            FRIDGE CHEF STUDIO 2024
          </div>
          <div className="flex gap-10">
            <i className="fa-brands fa-instagram text-xl cursor-pointer hover:text-orange-600 transition-all hover:scale-125"></i>
            <i className="fa-brands fa-dribbble text-xl cursor-pointer hover:text-orange-600 transition-all hover:scale-125"></i>
            <i className="fa-brands fa-behance text-xl cursor-pointer hover:text-orange-600 transition-all hover:scale-125"></i>
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
            BUILT WITH GEMINI MULTIMODAL AI
            <span className="w-8 h-[1px] bg-gray-300"></span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp {
          animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
