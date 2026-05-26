import { useEffect } from 'react';

interface SplashLoadingProps {
  onAnimationComplete: () => void;
}

export default function SplashLoading({ onAnimationComplete }: SplashLoadingProps) {
  useEffect(() => {
    // Força a saída do splash após 1.5 segundos para teste limpo
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090e17] font-sans text-white">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-4xl shadow-2xl shadow-emerald-500/20 mb-6">
          S
        </div>
        
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
          EducaS
        </h1>
        
        <p className="text-slate-500 text-sm mt-3 tracking-wide font-medium">
          Carregando ambiente seguro...
        </p>
      </div>
    </div>
  );
}