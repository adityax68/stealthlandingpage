export const UI_CONFIG = {
  colors: {
    primary: {
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      start: '#a78bfa',
      end: '#8b5cf6',
      light: '#c4b5fd',
      dark: '#7c3aed'
    },
    secondary: {
      gradient: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
      start: '#86efac',
      end: '#4ade80'
    },
    accent: {
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      start: '#fbbf24',
      end: '#f59e0b'
    },
    neutral: {
      white: '#ffffff',
      black: '#1f2937',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      }
    }
  },
  buttons: {
    variants: {
      primary: {
        background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        color: '#ffffff',
        border: 'none',
        hover: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%)',
        shadow: '0 10px 25px rgba(167, 139, 250, 0.3)'
      },
      secondary: {
        background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
        color: '#1f2937',
        border: 'none',
        hover: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)',
        shadow: '0 10px 25px rgba(134, 239, 172, 0.3)'
      },
      outline: {
        background: 'transparent',
        color: '#8b5cf6',
        border: '2px solid #8b5cf6',
        hover: {
          background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
          color: '#ffffff'
        },
        shadow: 'none'
      },
      ghost: {
        background: 'transparent',
        color: '#8b5cf6',
        border: 'none',
        hover: {
          background: 'rgba(167, 139, 250, 0.1)',
          color: '#7c3aed'
        },
        shadow: 'none'
      }
    },
    sizes: {
      sm: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '6px'
      },
      md: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px'
      },
      lg: {
        padding: '16px 32px',
        fontSize: '18px',
        borderRadius: '12px'
      },
      xl: {
        padding: '20px 40px',
        fontSize: '20px',
        borderRadius: '16px'
      }
    }
  },
  cards: {
    variants: {
      elevated: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        shadow: '0 25px 50px rgba(167, 139, 250, 0.15)',
        borderRadius: '20px'
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(167, 139, 250, 0.1)',
        shadow: '0 8px 32px rgba(167, 139, 250, 0.1)',
        borderRadius: '16px'
      },
      gradient: {
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        shadow: '0 20px 40px rgba(167, 139, 250, 0.15)',
        borderRadius: '20px'
      }
    }
  },
  animations: {
    fadeIn: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    slideIn: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' }
    }
  }
}

export type ButtonVariant = keyof typeof UI_CONFIG.buttons.variants
export type ButtonSize = keyof typeof UI_CONFIG.buttons.sizes
export type CardVariant = keyof typeof UI_CONFIG.cards.variants 