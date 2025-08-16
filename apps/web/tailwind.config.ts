import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep backgrounds
        'dark-void': '#0B0F1A',
        'dark-navy': '#1A1F2E',
        'dark-indigo': '#2A1E3D',
        
        // Neon accents
        'neon-purple': '#7C3AED',
        'neon-blue': '#00E5FF', 
        'neon-cyan': '#22D3EE',
        'neon-magenta': '#FF00E5',
        'neon-pink': '#FF0080',
        
        // Premium accents
        'gold': '#D4AF37',
        'gold-light': '#F0D975',
        'gold-dark': '#B8941F',
        
        // Glass/surface
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-strong': 'rgba(255, 255, 255, 0.2)',
        'surface-light': 'rgba(255, 255, 255, 0.05)',
        
        // Text
        'text-primary': '#E6F0FF',
        'text-secondary': '#B8C5D1',
        'text-muted': '#6B7889',
      },
      backgroundImage: {
        // Soft gradients for hero
        'gradient-hero-soft': 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(59, 130, 246, 0.2) 60%, rgba(99, 102, 241, 0.4) 100%)',
        'gradient-hero-elegant': 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)',
        
        // Neon gradients (more subdued)
        'gradient-neon': 'linear-gradient(135deg, rgba(124, 58, 237, 0.6) 0%, rgba(0, 229, 255, 0.4) 50%, rgba(255, 0, 229, 0.5) 100%)',
        'gradient-purple-cyan': 'linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, rgba(34, 211, 238, 0.4) 100%)',
        'gradient-cyan-magenta': 'linear-gradient(135deg, rgba(0, 229, 255, 0.4) 0%, rgba(255, 0, 229, 0.4) 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F0D975 100%)',
        
        // Original intense version (for accent elements)
        'gradient-hero': 'conic-gradient(from 0deg at 50% 50%, #7C3AED 0deg, #00E5FF 120deg, #FF00E5 240deg, #7C3AED 360deg)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer-fast': 'shimmer 1s infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { filter: 'brightness(1) saturate(1)' },
          'to': { filter: 'brightness(1.2) saturate(1.3)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-strong': '0 8px 32px 0 rgba(31, 38, 135, 0.7)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Exo 2', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'hero': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      })
    }
  ],
} satisfies Config
 