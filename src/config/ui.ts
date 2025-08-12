export const UI_CONFIG = {
  colors: {
    primary: {
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      start: '#30cfd0',
      end: '#330867',
      light: '#4dd4d5',
      dark: '#2a0a5a'
    },
    secondary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      start: '#667eea',
      end: '#764ba2'
    },
    accent: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      start: '#f093fb',
      end: '#f5576c'
    },
    neutral: {
      white: '#ffffff',
      black: '#000000',
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
        background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        color: '#ffffff',
        border: 'none',
        hover: 'linear-gradient(135deg, #4dd4d5 0%, #2a0a5a 100%)',
        shadow: '0 10px 25px rgba(48, 207, 208, 0.3)'
      },
      secondary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        hover: 'linear-gradient(135deg, #7c8feb 0%, #8a5bb3 100%)',
        shadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
      },
      outline: {
        background: 'transparent',
        color: '#30cfd0',
        border: '2px solid #30cfd0',
        hover: {
          background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
          color: '#ffffff'
        },
        shadow: 'none'
      },
      ghost: {
        background: 'transparent',
        color: '#30cfd0',
        border: 'none',
        hover: {
          background: 'rgba(48, 207, 208, 0.1)',
          color: '#4dd4d5'
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        shadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        borderRadius: '20px'
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px'
      },
      gradient: {
        background: 'linear-gradient(135deg, rgba(48, 207, 208, 0.1) 0%, rgba(51, 8, 103, 0.1) 100%)',
        border: '1px solid rgba(48, 207, 208, 0.2)',
        shadow: '0 20px 40px rgba(48, 207, 208, 0.15)',
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