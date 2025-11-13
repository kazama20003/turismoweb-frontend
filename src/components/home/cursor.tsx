'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const maskRef = useRef<HTMLDivElement>(null);
  const maskContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (maskRef.current && maskContentRef.current) {
        const x = e.pageX - 100; // 100 = radio del círculo
        const y = e.pageY - 100;

        maskRef.current.style.left = x + 'px';
        maskRef.current.style.top = y + 'px';

        // Ajustar la posición del contenido dentro de la máscara
        maskContentRef.current.style.left = -x + 'px';
        maskContentRef.current.style.top = -y + 'px';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Contenido normal */}
      <div className="cursor-none">
        <div className="flex h-screen">
          {/* Left side - Dark */}
          <div className="w-1/2 bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <h1 className="text-5xl font-bold text-white mb-4">Hello</h1>
            <p className="text-lg text-white mb-6">Check out this link:</p>
            <a 
              href="#" 
              className="text-white text-lg border-b-2 border-white pb-2 hover:opacity-80 transition-opacity"
            >
              Hover meh
            </a>
          </div>

          {/* Right side - Light */}
          <div className="w-1/2 bg-white flex flex-col items-center justify-center relative overflow-hidden">
            <h1 className="text-5xl font-bold text-black mb-4">Hello</h1>
            <p className="text-lg text-black mb-6">Check out this link:</p>
            <a 
              href="#" 
              className="text-black text-lg border-b-2 border-black pb-2 hover:opacity-80 transition-opacity"
            >
              Hover meh
            </a>
          </div>
        </div>
      </div>

      {/* Máscara circular que revela contenido invertido */}
      <div
        ref={maskRef}
        className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-[1000] overflow-hidden"
        style={{
          border: '2px solid rgba(0,0,0,0.3)',
        }}
      >
        <div
          ref={maskContentRef}
          className="absolute top-0 left-0 w-screen h-screen flex"
          style={{
            width: '100vw',
            height: '100vh',
          }}
        >
          {/* Espejo izquierdo - fondo blanco para revelar */}
          <div className="w-1/2 bg-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-black mb-4">Hello</h1>
            <p className="text-lg text-black mb-6">Check out this link:</p>
            <a 
              href="#" 
              className="text-black text-lg border-b-2 border-black pb-2"
            >
              Hover meh
            </a>
          </div>

          {/* Espejo derecho - fondo negro para revelar */}
          <div className="w-1/2 bg-black flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-white mb-4">Hello</h1>
            <p className="text-lg text-white mb-6">Check out this link:</p>
            <a 
              href="#" 
              className="text-white text-lg border-b-2 border-white pb-2"
            >
              Hover meh
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
