import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "stacked";
  inverted?: boolean;
  asLink?: boolean;
}

export function MonogramUM({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Monograma UM"
    >
      <defs>
        {/* Gradiente Metálico Rose Gold Nobre */}
        <linearGradient id="roseGoldMetal1" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#8C4A3E" />
          <stop offset="25%" stopColor="#C58577" />
          <stop offset="48%" stopColor="#FAD3C8" />
          <stop offset="55%" stopColor="#E2A597" />
          <stop offset="78%" stopColor="#A86558" />
          <stop offset="100%" stopColor="#6E2F24" />
        </linearGradient>

        <linearGradient id="roseGoldMetal2" x1="90%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#9B564A" />
          <stop offset="30%" stopColor="#D99B8D" />
          <stop offset="52%" stopColor="#FFF0EB" />
          <stop offset="70%" stopColor="#B76E79" />
          <stop offset="100%" stopColor="#63261C" />
        </linearGradient>

        <filter id="monogramShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#8C4A3E" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#monogramShadow)" transform="translate(10, 10)">
        {/* Letra U com serifa clássica */}
        <path
          d="M20 18 H38 V68 C38 98 52 118 80 118 C108 118 122 98 122 68 V18 H140 V68 C140 108 118 132 80 132 C42 132 20 108 20 68 Z"
          fill="url(#roseGoldMetal1)"
        />

        {/* Letra M entrelaçada em harmonia com o U */}
        <path
          d="M20 18 H38 L80 100 L122 18 H140 V122 H124 V44 L84 122 H76 L36 44 V122 H20 Z"
          fill="url(#roseGoldMetal2)"
        />

        {/* Serifas de topo da letra U e M */}
        <path d="M16 18 H42 V22 H16 Z" fill="url(#roseGoldMetal1)" />
        <path d="M118 18 H144 V22 H118 Z" fill="url(#roseGoldMetal1)" />
        <path d="M118 120 H144 V124 H118 Z" fill="url(#roseGoldMetal1)" />
        <path d="M16 120 H42 V124 H16 Z" fill="url(#roseGoldMetal1)" />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  size = "md",
  variant = "horizontal",
  inverted = false,
  asLink = true,
}: LogoProps) {
  const sizeConfig = {
    sm: {
      monogram: "h-8 w-8",
      title: "text-[15px] tracking-[0.24em]",
      subtitle: "text-[8.5px] tracking-[0.35em]",
      gap: "gap-2.5",
    },
    md: {
      monogram: "h-11 w-11",
      title: "text-lg md:text-xl tracking-[0.24em]",
      subtitle: "text-[9.5px] md:text-[10.5px] tracking-[0.38em]",
      gap: "gap-3.5",
    },
    lg: {
      monogram: "h-16 w-16",
      title: "text-2xl md:text-3xl tracking-[0.26em]",
      subtitle: "text-xs md:text-sm tracking-[0.4em]",
      gap: "gap-4",
    },
    xl: {
      monogram: "h-24 w-24",
      title: "text-3xl md:text-4xl tracking-[0.28em]",
      subtitle: "text-sm md:text-base tracking-[0.42em]",
      gap: "gap-5",
    },
  }[size];

  if (variant === "stacked") {
    const stackedContent = (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <MonogramUM className={sizeConfig.monogram} />
        <span
          className={`font-serif uppercase font-semibold mt-3 ${sizeConfig.title} ${
            inverted
              ? "text-white"
              : "bg-gradient-to-r from-[#8C4A3E] via-[#C58577] to-[#763529] bg-clip-text text-transparent"
          }`}
        >
          Umbelina Mendez
        </span>
        <span
          className={`uppercase font-sans font-medium mt-1 ${sizeConfig.subtitle} ${
            inverted ? "text-white/80" : "text-[#6E5A56]"
          }`}
        >
          Bióloga Esteta
        </span>
      </div>
    );

    if (asLink) {
      return (
        <Link to="/" className="group inline-flex flex-col items-center outline-none">
          {stackedContent}
        </Link>
      );
    }
    return stackedContent;
  }

  const content = (
    <div className={`inline-flex items-center select-none ${sizeConfig.gap} ${className}`}>
      <MonogramUM className={sizeConfig.monogram} />
      <div className="flex flex-col text-left">
        <span
          className={`font-serif uppercase font-semibold leading-tight ${sizeConfig.title} ${
            inverted
              ? "text-white"
              : "bg-gradient-to-r from-[#8C4A3E] via-[#C58577] to-[#763529] bg-clip-text text-transparent"
          }`}
        >
          Umbelina Mendez
        </span>
        <span
          className={`uppercase font-sans font-medium leading-none mt-1 ${sizeConfig.subtitle} ${
            inverted ? "text-white/80" : "text-[#6E5A56]"
          }`}
        >
          Bióloga Esteta
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="group inline-flex items-center outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
