
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
          <path
            d="M0,35 C360,70 720,0 1080,35 C1260,52 1380,18 1440,35 L1440,70 L0,70 Z"
            fill="hsl(230 85% 56% / 0.07)"
          />
          <path
            d="M0,50 C240,20 480,65 720,42 C960,18 1200,62 1440,50 L1440,70 L0,70 Z"
            fill="hsl(262 72% 56% / 0.05)"
          />
        </svg>
      </div>

      {/* Footer body */}
      <div
        className="relative pb-8 pt-4 border-t border-primary/10"
        style={{
          background: 'linear-gradient(180deg, hsl(230 85% 56% / 0.04) 0%, hsl(262 72% 56% / 0.06) 100%)',
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
              background: 'radial-gradient(circle, hsl(230 85% 56% / 0.06) 0%, transparent 70%)',
              animation: 'drift-orb-1 28s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '30%', height: '120%',
              top: '-10%', left: '-5%',
              background: 'radial-gradient(circle, hsl(262 72% 56% / 0.04) 0%, transparent 70%)',
              animation: 'drift-orb-2 34s ease-in-out infinite',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>
            &copy; {currentYear} Mohammedh Muksith. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
