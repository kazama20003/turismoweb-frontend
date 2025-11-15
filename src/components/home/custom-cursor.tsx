"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CustomCursorProps {
  children: React.ReactNode;
}

export function CustomCursor({ children }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const wrapper = wrapperRef.current;
    if (!cursor || !wrapper) return;

    let animationFrameId: number;

    const moveCursor = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();

        // solo mover si está dentro del wrapper
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          gsap.to(cursor, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    const enterArea = () => setIsHovering(true);
    const leaveArea = () => setIsHovering(false);

    wrapper.addEventListener("mousemove", moveCursor);
    wrapper.addEventListener("mouseenter", enterArea);
    wrapper.addEventListener("mouseleave", leaveArea);

    return () => {
      wrapper.removeEventListener("mousemove", moveCursor);
      wrapper.removeEventListener("mouseenter", enterArea);
      wrapper.removeEventListener("mouseleave", leaveArea);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // scale + opacity del texto
  useEffect(() => {
    if (!cursorRef.current || !textRef.current) return;

    gsap.to(cursorRef.current, {
      scale: isHovering ? 1.2 : 1,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(textRef.current, {
      opacity: isHovering ? 1 : 0,
      duration: 0.1,
      ease: "none",
    });
  }, [isHovering]);

  return (
    <div
      ref={wrapperRef}
      className="relative hide-system-cursor"
      style={{ cursor: "none" }}
    >
      {/* cursor visual */}
      <div
        ref={cursorRef}
        className="
          fixed top-0 left-0 w-8 h-8 rounded-full
          pointer-events-none z-[9999]
          mix-blend-difference flex items-center justify-center
        "
        style={{ opacity: isHovering ? 1 : 0 }}
      >
        <div
          ref={textRef}
          className="absolute text-black text-xs font-bold"
          style={{ opacity: 0 }}
        >
          PLAY
        </div>

        <div className="w-full h-full bg-white rounded-full" />
      </div>

      {/* contenido */}
      {children}
    </div>
  );
}
