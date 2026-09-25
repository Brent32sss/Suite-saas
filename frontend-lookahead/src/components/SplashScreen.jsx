// src/components/SplashScreen.jsx
import logoSefirot from '../assets/Logo.png';

export default function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        
        {/* LOGO DE LA APP */}
        <img 
          src={logoSefirot} 
          alt="Sefirot Logo" 
          className="w-40 md:w-48 h-auto object-contain animate-pulse" 
        />
        
        {/* SPINNER ANIMADO EN NEGRO */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-black"></div>
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Cargando...
          </p>
        </div>

      </div>
    </div>
  );
}