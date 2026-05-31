
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">

      {/* Wave separator — fills downward into footer */}
      <div aria-hidden="true" className="relative w-full leading-none" style={{ height: '70px' }}>
        <svg
          viewBox="0 0 1440 70"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Wave layer 1 — Palestinian green tint */}
          <path
            d="M0,35 C360,70 720,0 1080,35 C1260,52 1380,18 1440,35 L1440,70 L0,70 Z"
            fill="rgba(0,150,57,0.09)"
          />
          {/* Wave layer 2 — Palestinian red tint */}
          <path
            d="M0,50 C240,20 480,65 720,42 C960,18 1200,62 1440,50 L1440,70 L0,70 Z"
            fill="rgba(206,17,38,0.06)"
          />
        </svg>
      </div>

      {/* Footer body */}
      <div
        className="relative pb-8 pt-4 border-t border-accent/10"
        style={{
          background: 'linear-gradient(180deg, rgba(0,150,57,0.06) 0%, rgba(206,17,38,0.08) 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Ambient orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: '40%', height: '120%',
              top: '-20%', right: '-5%',
              background: 'radial-gradient(circle, rgba(0,150,57,0.07) 0%, transparent 70%)',
              animation: 'drift-orb-1 28s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '30%', height: '120%',
              top: '-10%', left: '-5%',
              background: 'radial-gradient(circle, rgba(206,17,38,0.05) 0%, transparent 70%)',
              animation: 'drift-orb-2 34s ease-in-out infinite',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>
            &copy; {currentYear} Mohammedh Muksith. All rights reserved.
          </p>
          {/* Palestinian solidarity row */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5" aria-label="Free Palestine">
              {[{r:-7,w:28,d:'0s'},{r:3,w:34,d:'0.5s'},{r:-4,w:30,d:'1.1s'},{r:8,w:36,d:'0.3s'},{r:-6,w:32,d:'1.6s'},{r:5,w:28,d:'0.8s'},{r:-9,w:34,d:'2.0s'}].map((f,i) => (
                <svg key={i} viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg"
                  style={{ width:`${f.w}px`, height:`${Math.round(f.w*0.5)}px`, transform:`rotate(${f.r}deg)`, opacity:0.75, borderRadius:'2px', overflow:'hidden', animation:'float-up-down 6s ease-in-out infinite', animationDelay:f.d, filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.18))' }}>
                  <rect x="0" y="0"      width="40" height="6.67" fill="#000000"/>
                  <rect x="0" y="6.67"  width="40" height="6.66" fill="#EBEBEB"/>
                  <rect x="0" y="13.33" width="40" height="6.67" fill="#009639"/>
                  <polygon points="0,0 16,10 0,20" fill="#CE1126"/>
                </svg>
              ))}
            </div>
            <p className="text-xs italic flex items-center gap-1.5" style={{ color: 'hsl(var(--foreground) / 0.50)' }}>
              <span>🍉</span>
              <span>Free Palestine — From the River to the Sea</span>
              <span>🕊️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
