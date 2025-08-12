export default function LogoStrip(){
  const logos = [
    { name: "Harvard", svg: <H /> },
    { name: "Stanford", svg: <S /> },
    { name: "Wharton", svg: <W /> },
    { name: "Booth", svg: <B /> },
    { name: "Tuck", svg: <T /> },
    { name: "Oxford Saïd", svg: <O /> },
    { name: "Cambridge Judge", svg: <C /> }
  ];
  return (
    <section className="border-y">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-7">
          {logos.map((l) => (
            <div key={l.name} className="flex items-center justify-center">{l.svg}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal, brand-neutral svg wordmarks
function base(props:any){ return <svg viewBox="0 0 120 24" width="120" height="24" {...props} className="text-foreground/60"><rect width="120" height="24" fill="none"/></svg>; }
function H(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">HARVARD</div>; }
function S(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">STANFORD</div>; }
function W(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">WHARTON</div>; }
function B(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">BOOTH</div>; }
function T(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">TUCK</div>; }
function O(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">OXFORD</div>; }
function C(){ return <div className="text-sm font-semibold tracking-wide text-foreground/60">CAMBRIDGE</div>; } 