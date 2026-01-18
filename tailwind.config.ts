import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '360px',   // Extra small - Nederlandse budget phones (Samsung A series) 🇳🇱
      'sm': '640px',   // Small - Large phones, phablets
      'md': '768px',   // Medium - Tablets portrait
      'lg': '1024px',  // Large - Tablets landscape, small laptops
      'xl': '1280px',  // Extra large - Desktops
      '2xl': '1536px', // 2X large - Large desktops
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        inbox: {
          unread: "hsl(var(--inbox-unread))",
          "unread-bg": "hsl(var(--inbox-unread-bg))",
        },
        channel: {
          whatsapp: "hsl(var(--channel-whatsapp))",
          email: "hsl(var(--channel-email))",
          phone: "hsl(var(--channel-phone))",
          video: "hsl(var(--channel-video))",
          social: "hsl(var(--channel-social))",
        },
        status: {
          online: "hsl(var(--status-online))",
          away: "hsl(var(--status-away))",
          offline: "hsl(var(--status-offline))",
        },
        message: {
          sent: "hsl(var(--message-sent))",
          "sent-bg": "hsl(var(--message-sent-bg))",
          received: "hsl(var(--message-received))",
          "received-bg": "hsl(var(--message-received-bg))",
        },
        conversation: {
          hover: "hsl(var(--conversation-hover))",
          active: "hsl(var(--conversation-active))",
        },
        // Kaspers Advies brand colors (using CSS variables)
        'ka-green': 'hsl(var(--ka-green))',
        'ka-green-light': 'hsl(var(--ka-green-light))',
        'ka-green-dark': 'hsl(var(--ka-green-dark))',
        'ka-navy': 'hsl(var(--ka-navy))',
        'ka-navy-light': 'hsl(var(--ka-navy-light))',
        'ka-navy-dark': 'hsl(var(--ka-navy-dark))',
        'ka-red': 'hsl(var(--ka-red))',
        'ka-red-light': 'hsl(var(--ka-red-light))',
        'ka-red-dark': 'hsl(var(--ka-red-dark))',
        'ka-gray': {
          50: 'hsl(var(--ka-gray-50))',
          100: 'hsl(var(--ka-gray-100))',
          200: 'hsl(var(--ka-gray-200))',
          300: 'hsl(var(--ka-gray-300))',
          400: 'hsl(var(--ka-gray-400))',
          500: 'hsl(var(--ka-gray-500))',
          600: 'hsl(var(--ka-gray-600))',
          700: 'hsl(var(--ka-gray-700))',
          800: 'hsl(var(--ka-gray-800))',
          900: 'hsl(var(--ka-gray-900))',
        },
        'channel-whatsapp-2': 'hsl(var(--channel-whatsapp))',
        'channel-email-2': 'hsl(var(--channel-email))',
        'channel-phone-2': 'hsl(var(--channel-phone))',
        'channel-video-2': 'hsl(var(--channel-video))',
        // Priority colors (flat keys for component usage)
        'priority-urgent': "hsl(var(--priority-urgent))",
        'priority-high': "hsl(var(--priority-high))",
        'priority-normal': "hsl(var(--priority-normal))",
        'priority-low': "hsl(var(--priority-low))",
        // Alert colors (flat keys for component usage)
        'alert-success-bg': "hsl(var(--alert-success-bg))",
        'alert-success-text': "hsl(var(--alert-success-text))",
        'alert-success-border': "hsl(var(--alert-success-border))",
        'alert-warning-bg': "hsl(var(--alert-warning-bg))",
        'alert-warning-text': "hsl(var(--alert-warning-text))",
        'alert-warning-border': "hsl(var(--alert-warning-border))",
        'alert-error-bg': "hsl(var(--alert-error-bg))",
        'alert-error-text': "hsl(var(--alert-error-text))",
        'alert-error-border': "hsl(var(--alert-error-border))",
        'alert-info-bg': "hsl(var(--alert-info-bg))",
        'alert-info-text': "hsl(var(--alert-info-text))",
        'alert-info-border': "hsl(var(--alert-info-border))",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("flowbite/plugin")
  ],
} satisfies Config;
