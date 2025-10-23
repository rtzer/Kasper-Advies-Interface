import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, X, Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function ExtendedBrandGuidePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(32,20%,97%)]">
      {/* Hero */}
      <header className="bg-gradient-to-br from-[hsl(145,50%,42%)] to-[hsl(145,50%,35%)] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
            Brand Style Guide
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Complete huisstijl documentatie met interactieve voorbeelden
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 space-y-16">
        
        {/* 1. Kleurenpalet */}
        <section id="colors" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              1. Kleurenpalet
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Ons complete kleurensysteem met concrete toepassingen
            </p>
          </div>

          {/* Primary Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Primaire Kleuren
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorCard
                name="Primary Green"
                hsl="145, 50%, 42%"
                hex="#478559"
                usage="Belangrijkste CTA's, primaire acties, hover states"
                bgColor="hsl(145, 50%, 42%)"
              />
              <ColorCard
                name="Chocolate Dark"
                hsl="25, 30%, 20%"
                hex="#332619"
                usage="Headings, belangrijke tekst, dark mode accents"
                bgColor="hsl(25, 30%, 20%)"
              />
            </div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Accent Kleuren
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorCard
                name="Accent Orange"
                hsl="16, 85%, 53%"
                hex="#E8632A"
                usage="Highlights, badges, promotional tags"
                bgColor="hsl(16, 85%, 53%)"
              />
              <ColorCard
                name="Secondary Brown"
                hsl="25, 40%, 35%"
                hex="#5C4433"
                usage="Secundaire acties, borders, muted text"
                bgColor="hsl(25, 40%, 35%)"
              />
            </div>
          </div>

          {/* Background Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Achtergronden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorCard
                name="Background Cream"
                hsl="32, 20%, 97%"
                hex="#F9F7F5"
                usage="Basis achtergrond, page background"
                bgColor="hsl(32, 20%, 97%)"
                border
              />
              <ColorCard
                name="Promo Background"
                hsl="30, 40%, 92%"
                hex="#F5EDE5"
                usage="Promotional blocks, featured sections"
                bgColor="hsl(30, 40%, 92%)"
                border
              />
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Semantische Kleuren
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorCard
                name="Success"
                hsl="145, 50%, 45%"
                hex="#39A861"
                usage="Success messages, available status"
                bgColor="hsl(145, 50%, 45%)"
              />
              <ColorCard
                name="Warning"
                hsl="38, 92%, 50%"
                hex="#F59E0B"
                usage="Warnings, pending actions"
                bgColor="hsl(38, 92%, 50%)"
              />
              <ColorCard
                name="Error"
                hsl="0, 84%, 60%"
                hex="#EF4444"
                usage="Error states, destructive actions"
                bgColor="hsl(0, 84%, 60%)"
              />
            </div>
          </div>
        </section>

        {/* 2. Typografie */}
        <section id="typography" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              2. Typografie
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Font hierarchy met concrete Tailwind classes
            </p>
          </div>

          {/* Font Families */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-serif font-semibold text-[hsl(25,30%,20%)] mb-2">
                Font Families
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-serif text-2xl">Playfair Display</span>
                  <code className="text-sm bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                    font-serif
                  </code>
                </div>
                <p className="text-sm text-[hsl(25,40%,35%)]">
                  Voor headings (weights: 400, 500, 600, 700)
                </p>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-2xl">Inter</span>
                  <code className="text-sm bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                    font-sans
                  </code>
                </div>
                <p className="text-sm text-[hsl(25,40%,35%)]">
                  Voor body tekst (weights: 300, 400, 500, 600, 700)
                </p>
              </div>
            </div>
          </Card>

          {/* Heading Hierarchy */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Heading Hiërarchie
            </h3>
            <Card className="p-8 space-y-6 bg-white">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[hsl(25,30%,20%)]">
                  H1: Hero Heading
                </h1>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-chocolate-dark
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)]">Voor hero secties</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)]">
                  H2: Section Title
                </h2>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-3xl md:text-4xl font-serif font-bold text-chocolate-dark
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)]">Voor sectie titels</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
                  H3: Subsection
                </h3>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-2xl md:text-3xl font-serif font-semibold text-chocolate-dark
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)]">Voor subsecties</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-serif font-semibold text-[hsl(25,30%,20%)]">
                  H4: Component Title
                </h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-xl md:text-2xl font-serif font-semibold text-chocolate-dark
                </code>
              </div>

              <div className="space-y-2">
                <h5 className="text-lg font-serif font-medium text-[hsl(25,30%,20%)]">
                  H5: Label Heading
                </h5>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-lg font-serif font-medium text-chocolate-dark
                </code>
              </div>

              <div className="space-y-2">
                <h6 className="text-base font-serif font-medium text-[hsl(25,30%,20%)]">
                  H6: Inline Label
                </h6>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-base font-serif font-medium text-chocolate-dark
                </code>
              </div>
            </Card>
          </div>

          {/* Body Sizes */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Body Text Groottes
            </h3>
            <Card className="p-6 space-y-4">
              <div>
                <p className="text-lg text-[hsl(25,40%,35%)]">
                  Large (lg): Voor intro teksten en belangrijke paragrafen
                </p>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">text-lg</code>
              </div>
              <div>
                <p className="text-base text-[hsl(25,40%,35%)]">
                  Regular (base): Standaard body tekst - meest gebruikte grootte
                </p>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">text-base</code>
              </div>
              <div>
                <p className="text-sm text-[hsl(25,40%,35%)]">
                  Small (sm): Metadata, helper tekst, captions
                </p>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">text-sm</code>
              </div>
              <div>
                <p className="text-xs text-[hsl(25,40%,35%)]">
                  Extra Small (xs): Legal tekst, timestamps, fine print
                </p>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">text-xs</code>
              </div>
            </Card>
          </div>
        </section>

        {/* 3. Interactive States */}
        <section id="states" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              3. Interactieve States
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Hover, focus, active en disabled states
            </p>
          </div>

          {/* Button States */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Button States
            </h3>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Normal → Hover → Active</p>
                  <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] active:scale-95 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                    Hover mij
                  </button>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                    hover:bg-primary/90 active:scale-95
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Focus State</p>
                  <button className="bg-[hsl(145,50%,42%)] text-white px-6 py-3 rounded-lg font-medium focus-visible:ring-2 focus-visible:ring-[hsl(145,50%,42%)] focus-visible:ring-offset-2">
                    Klik mij
                  </button>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Disabled State</p>
                  <button disabled className="bg-[hsl(145,50%,42%)] text-white px-6 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Disabled
                  </button>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                    opacity-50 cursor-not-allowed pointer-events-none
                  </code>
                </div>
              </div>
            </Card>
          </div>

          {/* Link States */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Link States
            </h3>
            <Card className="p-6 space-y-4">
              <div>
                <a href="#" className="text-[hsl(145,50%,42%)] hover:text-[hsl(145,50%,38%)] underline-offset-4 hover:underline font-medium">
                  Primary Link (hover mij)
                </a>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-primary hover:text-primary/80 underline-offset-4 hover:underline
                </code>
              </div>
              <div>
                <a href="#" className="text-[hsl(25,40%,35%)] hover:text-[hsl(25,30%,20%)] transition-colors">
                  Secondary Link (hover mij)
                </a>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  text-chocolate-medium hover:text-chocolate-dark
                </code>
              </div>
            </Card>
          </div>

          {/* Card Hovers */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Card Hover States
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg hover:border-[hsl(145,50%,42%)]/20 transition-all duration-300 cursor-pointer">
                <h4 className="font-serif font-semibold text-lg mb-2">Hover deze card</h4>
                <p className="text-sm text-[hsl(25,40%,35%)]">
                  Shadow en border veranderen smooth
                </p>
              </Card>
              <Card className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <h4 className="font-serif font-semibold text-lg mb-2">Scale hover</h4>
                <p className="text-sm text-[hsl(25,40%,35%)]">
                  Card wordt groter bij hover
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Buttons & Sizes */}
        <section id="buttons" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              4. Button Variants & Sizes
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Alle button combinaties met icons
            </p>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Button Variants
            </h3>
            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Default
                </button>
                <button className="border-2 border-[hsl(145,50%,42%)] text-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,42%)] hover:text-white px-6 py-3 rounded-lg font-medium transition-all">
                  Outline
                </button>
                <button className="hover:bg-[hsl(32,20%,90%)] text-[hsl(25,40%,35%)] px-6 py-3 rounded-lg font-medium transition-colors">
                  Ghost
                </button>
                <button className="bg-[hsl(25,40%,35%)] hover:bg-[hsl(25,40%,30%)] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Secondary
                </button>
                <button className="bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,55%)] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Destructive
                </button>
              </div>
            </Card>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Button Sizes
            </h3>
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-[hsl(145,50%,42%)] text-white px-3 py-1.5 rounded text-sm font-medium">
                  Small
                </button>
                <button className="bg-[hsl(145,50%,42%)] text-white px-6 py-3 rounded-lg font-medium">
                  Default
                </button>
                <button className="bg-[hsl(145,50%,42%)] text-white px-8 py-4 rounded-lg text-lg font-medium">
                  Large
                </button>
                <button className="bg-[hsl(145,50%,42%)] text-white p-3 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </Card>
          </div>

          {/* With Icons */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Buttons met Icons
            </h3>
            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Toevoegen aan winkelwagen
                </button>
                <button className="border-2 border-[hsl(16,85%,53%)] text-[hsl(16,85%,53%)] hover:bg-[hsl(16,85%,53%)] hover:text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Favoriet
                </button>
                <button className="bg-[hsl(25,40%,35%)] hover:bg-[hsl(25,40%,30%)] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Beoordeel
                </button>
              </div>
            </Card>
          </div>

          {/* Loading States */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Loading States
            </h3>
            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                  disabled={loading}
                  className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Laden...
                    </>
                  ) : (
                    'Klik om te laden'
                  )}
                </button>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. Badges & Tags */}
        <section id="badges" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              5. Badges & Tags
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Labels voor status en categorieën
            </p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <span className="bg-[hsl(16,85%,53%)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Nieuw
              </span>
              <span className="bg-[hsl(145,50%,45%)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Bestseller
              </span>
              <span className="bg-[hsl(25,40%,35%)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Chocolade
              </span>
              <span className="bg-[hsl(145,50%,42%)]/10 text-[hsl(145,50%,35%)] px-3 py-1 rounded-full text-sm font-semibold">
                Op voorraad
              </span>
              <span className="border-2 border-[hsl(25,40%,35%)] text-[hsl(25,40%,35%)] px-3 py-1 rounded-full text-sm font-semibold">
                Limited Edition
              </span>
              <span className="bg-[hsl(38,92%,50%)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sale
              </span>
            </div>
          </Card>
        </section>

        {/* 6. Spacing & Layout */}
        <section id="spacing" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              6. Spacing & Layout
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Consistent spacing systeem
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-serif font-semibold">Spacing Scale</h3>
            {[
              { size: '1', rem: '0.25rem', px: '4px' },
              { size: '2', rem: '0.5rem', px: '8px' },
              { size: '4', rem: '1rem', px: '16px' },
              { size: '6', rem: '1.5rem', px: '24px' },
              { size: '8', rem: '2rem', px: '32px' },
              { size: '12', rem: '3rem', px: '48px' },
              { size: '16', rem: '4rem', px: '64px' },
            ].map(({ size, rem, px }) => (
              <div key={size} className="flex items-center gap-4">
                <code className="text-sm bg-[hsl(30,40%,92%)] px-2 py-1 rounded w-16">
                  {size}
                </code>
                <div className="h-8 bg-[hsl(145,50%,42%)]" style={{ width: px }} />
                <span className="text-sm text-[hsl(25,40%,35%)]">
                  {rem} ({px})
                </span>
              </div>
            ))}
          </Card>

          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Layout Patterns
            </h3>
            <Card className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Container</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  className="container mx-auto px-4 max-w-6xl"
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Section Padding</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  className="py-12 md:py-16 lg:py-24"
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Grid Layout</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                </code>
              </div>
            </Card>
          </div>
        </section>

        {/* 7. Do's and Don'ts */}
        <section id="dos-donts" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              7. Do&apos;s and Don&apos;ts
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Visuele voorbeelden van correcte en incorrecte implementaties
            </p>
          </div>

          {/* Color Contrast */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Kleurcontrasten
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-green-500">
                <div className="flex items-start gap-3 mb-4">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">DO</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Voldoende contrast</p>
                  </div>
                </div>
                <div className="bg-[hsl(145,50%,42%)] text-white p-4 rounded-lg">
                  <p className="font-medium">Deze tekst is goed leesbaar</p>
                </div>
              </Card>

              <Card className="p-6 border-2 border-red-500">
                <div className="flex items-start gap-3 mb-4">
                  <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">DON&apos;T</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Te weinig contrast</p>
                  </div>
                </div>
                <div className="bg-[hsl(32,20%,90%)] text-[hsl(32,20%,85%)] p-4 rounded-lg">
                  <p className="font-medium">Deze tekst is slecht leesbaar</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Button Styling */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Button Styling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-green-500">
                <div className="flex items-start gap-3 mb-4">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">DO</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Gebruik semantic tokens</p>
                  </div>
                </div>
                <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white px-6 py-3 rounded-lg font-medium transition-colors w-full">
                  Correcte button
                </button>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  bg-primary hover:bg-primary/90
                </code>
              </Card>

              <Card className="p-6 border-2 border-red-500">
                <div className="flex items-start gap-3 mb-4">
                  <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">DON&apos;T</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Hardcoded kleuren</p>
                  </div>
                </div>
                <button className="bg-[#00FF00] text-black px-6 py-3 rounded-lg font-medium w-full">
                  Verkeerde button
                </button>
                <code className="text-xs bg-red-50 px-2 py-1 rounded block mt-2 text-red-600">
                  bg-[#00FF00] ← Nooit doen!
                </code>
              </Card>
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Spacing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-green-500">
                <div className="flex items-start gap-3 mb-4">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">DO</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Consistent spacing</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white">Element 1</div>
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white">Element 2</div>
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white">Element 3</div>
                </div>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                  space-y-4 (16px tussen elementen)
                </code>
              </Card>

              <Card className="p-6 border-2 border-red-500">
                <div className="flex items-start gap-3 mb-4">
                  <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">DON&apos;T</h4>
                    <p className="text-sm text-[hsl(25,40%,35%)]">Random spacing</p>
                  </div>
                </div>
                <div>
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white mb-2">Element 1</div>
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white mb-6">Element 2</div>
                  <div className="bg-[hsl(145,50%,42%)] p-4 rounded-lg text-white">Element 3</div>
                </div>
                <code className="text-xs bg-red-50 px-2 py-1 rounded block mt-2 text-red-600">
                  mb-2, mb-6, geen consistentie
                </code>
              </Card>
            </div>
          </div>
        </section>

        {/* 8. Component Patterns */}
        <section id="components" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              8. Component Patterns
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Werkende voorbeelden van veelgebruikte componenten
            </p>
          </div>

          {/* Product Card */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Product Card
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-square bg-[hsl(30,40%,92%)] relative">
                  <span className="absolute top-3 right-3 bg-[hsl(16,85%,53%)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Bestseller
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-semibold text-lg mb-2 group-hover:text-[hsl(145,50%,42%)] transition-colors">
                    Product naam
                  </h4>
                  <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                    Korte beschrijving van het product
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[hsl(25,30%,20%)]">€24,95</span>
                    <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white p-2 rounded-lg transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-square bg-[hsl(30,40%,92%)] relative">
                  <span className="absolute top-3 right-3 bg-[hsl(145,50%,45%)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Nieuw
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-semibold text-lg mb-2 group-hover:text-[hsl(145,50%,42%)] transition-colors">
                    Nieuw Product
                  </h4>
                  <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                    Net binnen in ons assortiment
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[hsl(25,30%,20%)]">€29,95</span>
                    <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white p-2 rounded-lg transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-square bg-[hsl(30,40%,92%)] relative">
                  <span className="absolute top-3 right-3 bg-[hsl(38,92%,50%)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Sale
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-semibold text-lg mb-2 group-hover:text-[hsl(145,50%,42%)] transition-colors">
                    Sale Product
                  </h4>
                  <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                    Tijdelijk in de aanbieding
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[hsl(25,30%,20%)]">€19,95</span>
                      <span className="text-sm text-[hsl(25,40%,35%)] line-through ml-2">€24,95</span>
                    </div>
                    <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white p-2 rounded-lg transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Promo Block */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Promo Block
            </h3>
            <div className="bg-[hsl(30,40%,92%)] rounded-lg p-8 md:p-12">
              <div className="max-w-2xl">
                <span className="inline-block bg-[hsl(16,85%,53%)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Actie
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-4">
                  Special offer
                </h3>
                <p className="text-lg text-[hsl(25,40%,35%)] mb-6">
                  Profiteer van onze tijdelijke aanbieding en bespaar tot 30% op geselecteerde producten.
                </p>
                <button className="bg-[hsl(145,50%,42%)] hover:bg-[hsl(145,50%,38%)] text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                  Shop nu
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Responsive Design */}
        <section id="responsive" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              9. Responsive Design
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Breakpoints en responsive patterns
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-serif font-semibold">Breakpoints</h3>
            <div className="space-y-3">
              {[
                { name: 'Mobile', breakpoint: 'default', width: '< 768px' },
                { name: 'Tablet', breakpoint: 'md:', width: '≥ 768px' },
                { name: 'Desktop', breakpoint: 'lg:', width: '≥ 1024px' },
                { name: 'Wide', breakpoint: 'xl:', width: '≥ 1280px' },
              ].map(({ name, breakpoint, width }) => (
                <div key={name} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-semibold">{name}</span>
                    <span className="text-sm text-[hsl(25,40%,35%)] ml-2">{width}</span>
                  </div>
                  <code className="text-sm bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                    {breakpoint}
                  </code>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[hsl(25,30%,20%)]">
              Responsive Patterns
            </h3>
            <Card className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Responsive Typography</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  text-4xl md:text-5xl lg:text-6xl
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)] mt-2">
                  Schaal tekst op van 4xl op mobile naar 6xl op desktop
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Responsive Grid</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)] mt-2">
                  1 kolom op mobile, 2 op tablet, 3 op desktop, 4 op wide
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Responsive Padding</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  py-12 md:py-16 lg:py-24
                </code>
                <p className="text-sm text-[hsl(25,40%,35%)] mt-2">
                  Meer ruimte op grotere schermen
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hide/Show Elements</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  hidden md:block (verberg op mobile, toon op tablet+)
                </code>
              </div>
            </Card>
          </div>
        </section>

        {/* 10. Accessibility */}
        <section id="accessibility" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              10. Accessibility
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Toegankelijkheid voor iedereen
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Focus States</h3>
              <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                Altijd zichtbare focus indicators voor keyboard navigatie
              </p>
              <button className="bg-[hsl(145,50%,42%)] text-white px-6 py-3 rounded-lg font-medium focus-visible:ring-2 focus-visible:ring-[hsl(145,50%,42%)] focus-visible:ring-offset-2">
                Tab naar mij
              </button>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              </code>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">ARIA Labels</h3>
              <div className="space-y-2">
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  aria-label="Toevoegen aan winkelwagen"
                </code>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  aria-describedby="help-text"
                </code>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  role="button"
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Color Contrast</h3>
              <p className="text-sm text-[hsl(25,40%,35%)]">
                Alle kleurencombinaties voldoen aan WCAG AA standaard (minimaal 4.5:1 voor normale tekst)
              </p>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Alt Text</h3>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                alt="Handgemaakte donkere chocolade met amandelen"
              </code>
              <p className="text-sm text-[hsl(25,40%,35%)] mt-2">
                Beschrijvende alt teksten voor alle afbeeldingen
              </p>
            </div>
          </Card>
        </section>

        {/* 11. Logo & Icons */}
        <section id="icons" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              11. Logo & Icons
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Iconografie en logo gebruik
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Icon Library</h3>
              <p className="text-sm text-[hsl(25,40%,35%)] mb-4">
                We gebruiken Lucide React voor alle icons
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingCart className="w-8 h-8 text-[hsl(145,50%,42%)]" />
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">ShoppingCart</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Heart className="w-8 h-8 text-[hsl(16,85%,53%)]" />
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">Heart</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Star className="w-8 h-8 text-[hsl(38,92%,50%)]" />
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">Star</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Menu className="w-8 h-8 text-[hsl(25,30%,20%)]" />
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">Menu</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Icon Sizes</h3>
              <div className="space-y-3">
                {[
                  { size: 'Small', class: 'w-4 h-4', px: '16px' },
                  { size: 'Default', class: 'w-5 h-5', px: '20px' },
                  { size: 'Medium', class: 'w-6 h-6', px: '24px' },
                  { size: 'Large', class: 'w-8 h-8', px: '32px' },
                ].map(({ size, class: className, px }) => (
                  <div key={size} className="flex items-center gap-4">
                    <ShoppingCart className={className + " text-[hsl(145,50%,42%)]"} />
                    <code className="text-sm bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                      {className}
                    </code>
                    <span className="text-sm text-[hsl(25,40%,35%)]">{size} ({px})</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Icon Colors</h3>
              <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                Icons krijgen kleuren via Tailwind classes
              </p>
              <div className="flex flex-wrap gap-4">
                <ShoppingCart className="w-8 h-8 text-[hsl(145,50%,42%)]" />
                <ShoppingCart className="w-8 h-8 text-[hsl(16,85%,53%)]" />
                <ShoppingCart className="w-8 h-8 text-[hsl(25,30%,20%)]" />
                <ShoppingCart className="w-8 h-8 text-[hsl(25,40%,35%)]" />
              </div>
            </div>
          </Card>
        </section>

        {/* 12. Loading States */}
        <section id="loading" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              12. Loading States
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Feedback tijdens laden van content
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Spinner</h3>
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 text-[hsl(145,50%,42%)] animate-spin" />
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                  &lt;Loader2 className="animate-spin" /&gt;
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Skeleton Loader</h3>
              <div className="space-y-3">
                <div className="h-4 bg-[hsl(32,20%,90%)] rounded animate-pulse w-full" />
                <div className="h-4 bg-[hsl(32,20%,90%)] rounded animate-pulse w-3/4" />
                <div className="h-4 bg-[hsl(32,20%,90%)] rounded animate-pulse w-1/2" />
              </div>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-3">
                className="bg-muted animate-pulse rounded"
              </code>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Loading Button</h3>
              <button 
                disabled
                className="bg-[hsl(145,50%,42%)] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 opacity-50"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Bezig met laden...
              </button>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Progress Bar</h3>
              <div className="w-full bg-[hsl(32,20%,90%)] rounded-full h-2">
                <div className="bg-[hsl(145,50%,42%)] h-2 rounded-full transition-all duration-500" style={{ width: '60%' }} />
              </div>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-3">
                Animeer width property voor vloeiende progressie
              </code>
            </div>
          </Card>
        </section>

        {/* 13. Tone of Voice */}
        <section id="tone" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              13. Tone of Voice
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Hoe we communiceren met onze gebruikers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3 text-[hsl(145,50%,42%)]">
                ✓ Wel
              </h3>
              <ul className="space-y-2 text-sm text-[hsl(25,40%,35%)]">
                <li>• Vriendelijk en toegankelijk</li>
                <li>• Duidelijk en direct</li>
                <li>• Professioneel maar persoonlijk</li>
                <li>• Enthousiast over producten</li>
                <li>• Helpend en informatief</li>
              </ul>
              <div className="mt-4 p-3 bg-[hsl(30,40%,92%)] rounded-lg">
                <p className="text-sm">
                  "Ontdek onze handgemaakte chocolade, met liefde bereid met de beste ingrediënten."
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3 text-[hsl(0,84%,60%)]">
                ✗ Niet
              </h3>
              <ul className="space-y-2 text-sm text-[hsl(25,40%,35%)]">
                <li>• Te formeel of afstandelijk</li>
                <li>• Jargon of moeilijke woorden</li>
                <li>• Overdreven marketing taal</li>
                <li>• Passief of saai</li>
                <li>• Onduidelijk of vaag</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-900">
                  "Onze premium cacao-gebaseerde confectionery items zijn beschikbaar voor acquisitie."
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-serif font-semibold">Microcopy Voorbeelden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Error Messages</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  "Oeps! Er ging iets mis. Probeer het nog eens."
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Success Messages</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  "Gelukt! Product toegevoegd aan je winkelwagen."
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Empty States</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  "Je winkelwagen is leeg. Tijd om te shoppen!"
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Loading States</h4>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  "Bezig met laden..."
                </code>
              </div>
            </div>
          </Card>
        </section>

        {/* 14. Mobile Patterns */}
        <section id="mobile" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              14. Mobile Patterns
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Mobile-first design patterns
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Touch Targets</h3>
              <p className="text-sm text-[hsl(25,40%,35%)] mb-3">
                Minimaal 44x44px voor alle interactieve elementen
              </p>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                className="min-h-[44px] min-w-[44px]"
              </code>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Mobile Navigation</h3>
              <div className="space-y-2">
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  Hamburger menu op mobile (md:hidden)
                </code>
                <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                  Full navigation op desktop (hidden md:flex)
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Mobile Cards</h3>
              <p className="text-sm text-[hsl(25,40%,35%)]">
                Stack verticaal op mobile, grid op grotere schermen
              </p>
              <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              </code>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Bottom Sheet</h3>
              <p className="text-sm text-[hsl(25,40%,35%)]">
                Voor mobile: filters en acties in bottom sheet in plaats van sidebar
              </p>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Swipe Gestures</h3>
              <p className="text-sm text-[hsl(25,40%,35%)]">
                Implementeer swipe-to-delete en swipe navigatie waar relevant
              </p>
            </div>
          </Card>
        </section>

        {/* 15. Animation & Timing */}
        <section id="animation" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              15. Animation & Timing
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Subtiele animaties voor betere UX
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Duration Guidelines</h3>
              <div className="space-y-2">
                {[
                  { name: 'Instant', duration: '75-100ms', use: 'Hover states, kleine veranderingen' },
                  { name: 'Fast', duration: '150-200ms', use: 'Buttons, kleine componenten' },
                  { name: 'Normal', duration: '200-300ms', use: 'Cards, modals, meeste transitions' },
                  { name: 'Slow', duration: '300-500ms', use: 'Page transitions, grote animaties' },
                ].map(({ name, duration, use }) => (
                  <div key={name} className="border-b pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{name}</span>
                      <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">
                        {duration}
                      </code>
                    </div>
                    <p className="text-sm text-[hsl(25,40%,35%)]">{use}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Easing Functions</h3>
              <div className="space-y-2">
                <div>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">ease-in-out</code>
                  <span className="text-sm text-[hsl(25,40%,35%)] ml-2">Voor meeste transitions</span>
                </div>
                <div>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">ease-out</code>
                  <span className="text-sm text-[hsl(25,40%,35%)] ml-2">Voor entrances</span>
                </div>
                <div>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded">ease-in</code>
                  <span className="text-sm text-[hsl(25,40%,35%)] ml-2">Voor exits</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Common Transitions</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Hover Scale</h4>
                  <div className="bg-[hsl(145,50%,42%)] w-24 h-24 rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer" />
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block mt-2">
                    hover:scale-105 transition-transform duration-200
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Fade In</h4>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                    opacity-0 hover:opacity-100 transition-opacity duration-300
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Slide Up</h4>
                  <code className="text-xs bg-[hsl(30,40%,92%)] px-2 py-1 rounded block">
                    translate-y-2 hover:translate-y-0 transition-transform
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm text-[hsl(25,40%,35%)]">
                <li>• Gebruik <code className="bg-[hsl(30,40%,92%)] px-1 rounded text-xs">transition-all</code> spaarzaam (performance)</li>
                <li>• Geef specifieke properties: <code className="bg-[hsl(30,40%,92%)] px-1 rounded text-xs">transition-colors</code>, <code className="bg-[hsl(30,40%,92%)] px-1 rounded text-xs">transition-transform</code></li>
                <li>• Respect "prefers-reduced-motion" voor toegankelijkheid</li>
                <li>• Houd animaties subtiel en functioneel</li>
                <li>• Test performance op lagere devices</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Quick Reference */}
        <section id="reference" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[hsl(25,30%,20%)] mb-2">
              Quick Reference
            </h2>
            <p className="text-lg text-[hsl(25,40%,35%)]">
              Veelgebruikte classes en patterns
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Button Base</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              </code>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Card Base</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow p-6"
              </code>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Container</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="container mx-auto px-4 max-w-6xl"
              </code>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Section Spacing</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="py-12 md:py-16 lg:py-24"
              </code>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Responsive Grid</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              </code>
            </div>

            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Heading Styles</h3>
              <code className="text-sm bg-[hsl(30,40%,92%)] px-3 py-2 rounded block">
                className="text-3xl md:text-4xl font-serif font-bold text-chocolate-dark"
              </code>
            </div>
          </Card>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-[hsl(25,30%,20%)] text-white py-8 mt-24">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-sm">
            Deze brandguide is een levend document. Bij vragen: neem contact op met het design team.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface ColorCardProps {
  name: string;
  hsl: string;
  hex: string;
  usage: string;
  bgColor: string;
  border?: boolean;
}

function ColorCard({ name, hsl, hex, usage, bgColor, border }: ColorCardProps) {
  return (
    <Card className={`overflow-hidden ${border ? 'border-2' : ''}`}>
      <div 
        className="h-32"
        style={{ backgroundColor: bgColor }}
      />
      <div className="p-4 space-y-2">
        <h4 className="font-serif font-semibold text-lg">{name}</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-[hsl(25,40%,35%)]">HSL:</span>
            <code className="bg-[hsl(30,40%,92%)] px-2 py-0.5 rounded text-xs">
              {hsl}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(25,40%,35%)]">HEX:</span>
            <code className="bg-[hsl(30,40%,92%)] px-2 py-0.5 rounded text-xs">
              {hex}
            </code>
          </div>
        </div>
        <p className="text-xs text-[hsl(25,40%,35%)] pt-2 border-t">
          {usage}
        </p>
      </div>
    </Card>
  );
}
