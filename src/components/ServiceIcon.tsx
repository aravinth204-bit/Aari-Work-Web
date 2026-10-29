type ServiceIconProps = {
  title: string;
  className?: string;
};

/**
 * Hand-drawn line marks for the six services. One visual language:
 * 32px grid, 1.4 stroke, round caps, no fills.
 */
export default function ServiceIcon({ title, className = "h-9 w-9" }: ServiceIconProps) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (title) {
    case "Aari Work":
      return (
        <svg {...common}>
          <path d="M25 5 11 21" />
          <path d="M23.4 6.8c1 1 1 2.4 0 3.4s-2.4 1-3.4 0" />
          <path d="M8 15c-2.6 2.8-2.9 6.1-1.8 8.8 2.7 1.1 6 .8 8.8-1.8" />
          <path d="M9.5 22.5c2.2-.4 4.1-2.4 4.5-4.5" />
        </svg>
      );
    case "Embroidery":
      return (
        <svg {...common}>
          <circle cx="16" cy="15" r="9.5" />
          <circle cx="16" cy="15" r="6.2" strokeDasharray="1.5 2.4" />
          <path d="M16 5.5v-2M16 26.5v2M5.5 15h-2M28.5 15h-2" />
          <path d="M20 11c1.6 1.2 1.6 3.6 0 4.8" />
        </svg>
      );
    case "Brooches Work":
      return (
        <svg {...common}>
          <path d="M16 4.5 23 11l-7 6.5L9 11Z" />
          <path d="M16 4.5v13M9 11h14" opacity="0.45" />
          <path d="M16 17.5v8" />
          <path d="M16 25.5 13.8 28M16 25.5l2.2 2.5" />
        </svg>
      );
    case "Zardosi Work":
      return (
        <svg {...common}>
          <path d="M11 6h10v7H11z" />
          <path d="M11 9h10M11 12h10" opacity="0.45" />
          <path d="M13 13c0 5-3 6.5-3 10.5a3 3 0 0 0 6 0" />
          <path d="M19 13c0 4 2.5 6 2.5 9.5a3.5 3.5 0 0 1-7 0" />
        </svg>
      );
    case "Stone & Kundan Work":
      return (
        <svg {...common}>
          <path d="M9 8h14l4 5.5L16 27 5 13.5Z" />
          <path d="M5 13.5h22M9 8l3.5 5.5L16 8l3.5 5.5L23 8M12.5 13.5 16 27l3.5-13.5" opacity="0.45" />
        </svg>
      );
    case "Cut Work & Patch Work":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="9" r="2.8" />
          <circle cx="8.5" cy="21" r="2.8" />
          <path d="M10.8 10.6 26 23M10.8 19.4 26 7" />
          <path d="M18 6h6v6" strokeDasharray="1.6 2.2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="9" />
          <path d="M16 10v7l4 2" />
        </svg>
      );
  }
}
