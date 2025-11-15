import RevealCursorWrapper from "@/components/home/RevealCursorWrapper";

export default function Page() {
  return (
    <div className="space-y-40">
      
      <RevealCursorWrapper>
        <section className="h-[60vh] bg-black text-white flex items-center justify-center">
          <h1 className="text-6xl font-bold">Sección 1</h1>
        </section>
      </RevealCursorWrapper>

      <RevealCursorWrapper circleSize={260}>
        <section className="h-[60vh] bg-gray-900 text-white flex items-center justify-center">
          <h1 className="text-6xl font-bold">Sección 2</h1>
        </section>
      </RevealCursorWrapper>

      <RevealCursorWrapper circleSize={180}>
        <section className="h-[60vh] bg-neutral-800 text-white flex items-center justify-center">
          <h1 className="text-6xl font-bold">Sección 3</h1>
        </section>
      </RevealCursorWrapper>

    </div>
  );
}
