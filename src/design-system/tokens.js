export const tokens = {
  brand: {
    50:  '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  accent: {
    50:  '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
  },
  surface: {
    page: '#f8fafc',
    raised: '#ffffff',
    sunken: '#f1f5f9',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  ink: {
    900: '#0f172a',
    700: '#334155',
    500: '#64748b',
    400: '#94a3b8',
    300: '#cbd5e1',
    200: '#e2e8f0',
    100: '#f1f5f9',
  },
  radii: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  shadow: {
    card: 'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]',
    pop:  'shadow-[0_8px_30px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)]',
    ring: 'focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
  },
  gradients: {
    hero: 'bg-[linear-gradient(135deg,#eef2ff_0%,#fdf4ff_50%,#fff_100%)]',
    brand: 'bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_45%,#d946ef_100%)]',
    brandSoft: 'bg-[linear-gradient(135deg,#eef2ff_0%,#fdf4ff_100%)]',
    ink: 'bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_60%,#312e81_100%)]',
  },
};

export default tokens;
