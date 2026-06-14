import type { SVGProps } from 'react';

// Minimal inline icon set (stroke-based, currentColor). Sized via `size` prop.
// Kept tiny — only what the 14 screens use.

type IconProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & {
  size?: number;
  strokeWidth?: number;
};

function base({ size = 22, strokeWidth = 1.8, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 2.4 })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 2.4 })}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 2.6 })}>
    <path d="M5 12.5 10 17l9-10" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5A16 16 0 0 1 5 6.7 1.5 1.5 0 0 1 6.5 4Z" />
  </svg>
);

export const BasketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 9h14l-1.2 9.2A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.8L5 9Z" />
    <path d="M9 9 12 4l3 5" />
    <path d="M9.5 13v3M14.5 13v3" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11.5 12 5l8 6.5" />
    <path d="M6 10.5V19h12v-8.5" />
  </svg>
);

export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8h12l-.8 11A1.5 1.5 0 0 1 15.7 20H8.3a1.5 1.5 0 0 1-1.5-1L6 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base({ ...p, strokeWidth: 1.6 })} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 4 2.4 5 5.6.7-4 3.9 1 5.4-5-2.7-5 2.7 1-5.4-4-3.9 5.6-.7L12 4Z" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 2.2 })}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.6 12 20 12 20Z" />
  </svg>
);
