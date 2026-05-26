// src/components/layout/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-[#090e17]">
      {/* Lado Esquerdo: Arte / Foguete */}
      {/* Ajuste o caminho da imagem conforme você salvar na pasta public */}
      <div className="hidden lg:flex w-2/3 bg-[#070a12] items-center justify-center p-0 relative overflow-hidden">
        <img 
          src="/foguete-background.png" 
          alt="Conhecimento" 
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Lado Direito: Modal de Login */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-[#0f172a] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}