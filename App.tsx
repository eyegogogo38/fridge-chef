
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
      setError("냉장고 속 재료를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await getRecipeRecommendations(ingredients, mealTime);
      setRecipes(response.recipes);

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
    <div className="min-h-screen py-16 px-6 lg:py-28 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Elite Header Section */}
        <header className="text-center mb-32 space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-neutral-900 border border-white/5 text-neutral-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Gemini Multimodal Intelligence
          </div>
          <h1 className="text-7xl md:text-9xl font-[950] text-white tracking-tighter leading-none italic">
            FRIDGE <span className="text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-amber-500 to-orange-200">CHEF</span>
          </h1>
          <p className="text-neutral-500 text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-tight">
            어둠이 내린 주방, 당신의 냉장고 속 재료들로 <br/>
            가장 빛나는 미식의 순간을 디자인합니다.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 items-start">
          {/* Elite Sidebar */}
          <div className="xl:col-span-4 space-y-10 sticky top-16">
            <div className="bg-neutral-900/40 backdrop-blur-3xl p-12 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/5">
              <section className="mb-14">
                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-10 flex items-center">
                  <i className="fa-solid fa-barcode mr-4 text-orange-500/50"></i> Stock Input
                </h2>
                
                <form onSubmit={handleAddIngredient} className="relative group mb-10">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="재료 입력 (예: 와인, 대게)"
                    className="w-full pl-10 pr-20 py-6 rounded-[2rem] bg-neutral-950/50 border border-white/5 focus:bg-neutral-950 focus:border-orange-500/40 focus:outline-none transition-all font-bold text-white placeholder-neutral-700 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-500 shadow-xl active:scale-90"
                  >
                    <i className="fa-solid fa-plus text-lg"></i>
                  </button>
                </form>

                <div className="flex flex-wrap gap-3 min-h-[80px]">
                  {ingredients.length === 0 ? (
                    <div className="w-full py-16 text-center border border-dashed border-white/5 rounded-[3rem] bg-black/20">
                      <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.4em]">Inventory Empty</p>
                    </div>
                  ) : (
                    ingredients.map((ing) => (
                      <button
                        key={ing}
                        onClick={() => removeIngredient(ing)}
                        className="flex items-center gap-4 bg-neutral-800/50 text-neutral-300 px-6 py-4 rounded-2xl text-[14px] font-bold border border-white/5 hover:border-red-500/40 hover:text-red-400 transition-all animate-scaleIn hover:bg-neutral-950 shadow-lg"
                      >
                        {ing}
                        <i className="fa-solid fa-xmark text-[10px] opacity-30"></i>
                      </button>
                    ))
                  )}
                </div>
              </section>

              <section className="mb-14">
                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-10 flex items-center">
                  <i className="fa-solid fa-moon mr-4 text-orange-500/50"></i> Dining Occasion
                </h2>
                <div className="flex p-2.5 bg-neutral-950 rounded-[2.5rem] border border-white/5 shadow-inner">
                  {(Object.values(MealTime)).map((time) => (
                    <button
                      key={time}
                      onClick={() => setMealTime(time)}
                      className={`flex-1 py-5 rounded-[2rem] font-black text-[11px] tracking-[0.3em] transition-all duration-700 ${
                        mealTime === time
                          ? 'bg-neutral-800 text-white shadow-2xl border border-white/10'
                          : 'text-neutral-600 hover:text-neutral-400'
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
                className={`w-full py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_60px_-10px_rgba(249,115,22,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-5 relative overflow-hidden group ${
                  loading 
                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin"></div>
                    <span className="animate-pulse">Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Inspire Me</span>
                    <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-2 transition-transform"></i>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-10 p-6 bg-red-950/20 text-red-500 rounded-[2rem] text-[12px] font-bold border border-red-500/20 flex items-center gap-4 animate-pulse">
                  <i className="fa-solid fa-circle-exclamation text-xl"></i> {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="xl:col-span-8">
            {recipes.length > 0 ? (
              <div className="flex flex-col gap-16">
                {recipes.map((recipe, idx) => (
                  <div key={recipe.id} className="animate-slideUp" style={{ animationDelay: `${idx * 250}ms` }}>
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="h-full min-h-[700px] flex flex-col items-center justify-center bg-neutral-900/20 backdrop-blur-xl rounded-[5rem] border border-white/5 text-neutral-600 p-20 text-center group transition-all duration-1000 hover:bg-neutral-900/30">
                <div className="w-40 h-40 bg-neutral-950 rounded-[3rem] flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.4)] mb-14 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 border border-white/5 relative">
                   <div className="absolute inset-0 bg-orange-500 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                   <i className="fa-solid fa-hat-chef text-6xl text-neutral-800 group-hover:text-orange-500/60 transition-colors relative z-10"></i>
                </div>
                <h3 className="text-4xl font-[950] text-white/90 mb-8 tracking-tighter italic">Your Culinary Canvas</h3>
                <p className="max-w-md text-lg font-light leading-relaxed text-neutral-500 opacity-60">
                  재료를 입력하고 AI의 영감을 받아보세요. <br/>
                  완전히 새로운 미식의 경험이 시작됩니다.
                </p>
              </div>
            ) : (
              <div className="h-full min-h-[700px] flex flex-col items-center justify-center space-y-16 bg-neutral-900/10 backdrop-blur-3xl rounded-[5rem]">
                <div className="relative">
                  <div className="w-28 h-28 border-[1px] border-neutral-800 border-t-orange-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-stars text-2xl text-orange-500/40 animate-pulse"></i>
                  </div>
                </div>
                <div className="text-center space-y-5">
                  <p className="text-3xl font-[900] text-white tracking-tighter italic">Curating Masterpieces</p>
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em] animate-pulse">Balancing flavors & aesthetics...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-30">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 flex items-center gap-5">
            <span className="w-12 h-[1px] bg-neutral-800"></span>
            THE MIDNIGHT GOURMET 2024
          </div>
          <div className="flex gap-14">
            <i className="fa-brands fa-instagram text-2xl cursor-pointer hover:text-orange-500 transition-all hover:scale-125"></i>
            <i className="fa-brands fa-dribbble text-2xl cursor-pointer hover:text-orange-500 transition-all hover:scale-125"></i>
            <i className="fa-brands fa-behance text-2xl cursor-pointer hover:text-orange-500 transition-all hover:scale-125"></i>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 flex items-center gap-5">
            ARTIFICIAL INTELLIGENCE GASTRONOMY
            <span className="w-12 h-[1px] bg-neutral-800"></span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp {
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
