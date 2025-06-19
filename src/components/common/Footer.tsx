
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/10 text-primary-foreground py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-foreground/80 flex items-center justify-center">
          &copy; {currentYear} Mohammedh Muksith. All rights reserved.
        </p>
        <p className="text-xs text-foreground/60 mt-2 flex items-center justify-center gap-1.5">
          Free Palestine
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 100"
            className="w-5 h-auto rounded-sm"
            aria-hidden="true"
            focusable="false"
          >
            <rect width="200" height="33.33" fill="#000000" />
            <rect y="33.33" width="200" height="33.34" fill="#FFFFFF" />
            <rect y="66.67" width="200" height="33.33" fill="#009639" />
            <polygon points="0,0 100,50 0,100" fill="#CE1126" />
          </svg>
        </p>
      </div>
    </footer>
  );
}
