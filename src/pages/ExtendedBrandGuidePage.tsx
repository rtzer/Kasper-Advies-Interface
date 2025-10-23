import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, X, Loader2, Menu, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function ExtendedBrandGuidePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-gradient-to-br from-[hsl(89,44%,49%)] to-[hsl(89,44%,42%)] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Kaspers Advies Brand Style Guide
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
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              1. Kleurenpalet
            </h2>
            <p className="text-lg text-muted-foreground">
              Ons complete kleurensysteem met concrete toepassingen
            </p>
          </div>

          {/* Primaire kleuren */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Primaire kleuren</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorCard
                name="Kaspers Green"
                hsl="89, 44%, 49%"
                hex="#7AB547"
                usage="Primary buttons, CTAs, active states, brand accents"
              />
              <ColorCard
                name="Kaspers Navy"
                hsl="213, 52%, 25%"
                hex="#1E3A5F"
                usage="Headers, body text (emphasis), navigation, dark backgrounds"
              />
            </div>
          </div>

          {/* Accent kleur */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Accent Kleur (Logo Checkmark)</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <ColorCard
                name="Kaspers Red"
                hsl="0, 84%, 60%"
                hex="#EB5757"
                usage="CTA buttons, wichtige acties, hover accenten, logo checkmark"
              />
            </div>
          </div>

          {/* Grayscale */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Gray Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { shade: '50', hex: '#F9FAFB', usage: 'Page backgrounds' },
                { shade: '100', hex: '#F3F4F6', usage: 'Card backgrounds' },
                { shade: '200', hex: '#E5E7EB', usage: 'Borders, dividers' },
                { shade: '300', hex: '#D1D5DB', usage: 'Disabled states' },
                { shade: '400', hex: '#9CA3AF', usage: 'Placeholders' },
              ].map(({ shade, hex, usage }) => (
                <div key={shade} className="space-y-2">
                  <div className="h-16 rounded-lg border" style={{ backgroundColor: hex }} />
                  <p className="text-sm font-medium">Gray {shade}</p>
                  <p className="text-xs text-muted-foreground">{usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Channel kleuren */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Channel Kleuren</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ColorCard name="WhatsApp" hex="#25D366" usage="WhatsApp kanaal" />
              <ColorCard name="Email" hex="#EA4335" usage="Email kanaal" />
              <ColorCard name="Phone" hex="#0088CC" usage="Telefoon kanaal" />
              <ColorCard name="Video" hex="#00AFF0" usage="Video call kanaal" />
            </div>
          </div>

          {/* Semantische kleuren */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Semantische kleuren</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ColorCard
                name="Success"
                hsl="160, 84%, 39%"
                hex="#10B981"
                usage="Success states, completed actions"
              />
              <ColorCard
                name="Warning"
                hsl="38, 92%, 50%"
                hex="#F59E0B"
                usage="Warnings, pending states"
              />
              <ColorCard
                name="Error"
                hsl="0, 84%, 60%"
                hex="#EF4444"
                usage="Errors, destructive actions"
              />
              <ColorCard
                name="Info"
                hsl="217, 91%, 60%"
                hex="#3B82F6"
                usage="Information, neutral alerts"
              />
            </div>
          </div>
        </section>

        {/* 2. Typografie */}
        <section id="typography" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              2. Typografie
            </h2>
            <p className="text-lg text-muted-foreground">
              Font hierarchy met concrete Tailwind classes
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Font Family</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="font-sans text-2xl mb-2">Inter</p>
                <p className="text-sm text-muted-foreground mb-2">Sans-serif - Voor alle tekst</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">font-sans (default)</code>
                <p className="text-sm mt-2">Weights: 300, 400, 500, 600, 700</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Heading Hiërarchie</h3>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[hsl(213,52%,25%)] mb-2">
                  H1: Heading Level 1 (30px)
                </h1>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  text-3xl font-bold text-[hsl(var(--ka-navy))]
                </code>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[hsl(213,52%,25%)] mb-2">
                  H2: Heading Level 2 (24px)
                </h2>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  text-2xl font-bold text-[hsl(var(--ka-navy))]
                </code>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[hsl(213,52%,25%)] mb-2">
                  H3: Heading Level 3 (20px)
                </h3>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  text-xl font-semibold text-[hsl(var(--ka-navy))]
                </code>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  H4: Heading Level 4 (18px)
                </h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  text-lg font-semibold text-foreground
                </code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Body Text Groottes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-lg">Large (lg): Voor intro teksten en belangrijke paragrafen</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">text-lg</code>
              </div>
              <div>
                <p className="text-base">Regular (base): Standaard body tekst</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">text-base</code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Small (sm): Metadata, helper tekst</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">text-sm</code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Extra Small (xs): Legal tekst, timestamps</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">text-xs</code>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive States */}
        <section id="states" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              3. Interactieve States
            </h2>
            <p className="text-lg text-muted-foreground">
              Hover, focus, active en disabled states
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Button States</h3>
            <Card className="p-6 space-y-4">
              <div className="space-y-3">
                <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">
                  Normal State
                </Button>
                <Button className="bg-[hsl(89,44%,49%)]/90">
                  Hover State (90% opacity)
                </Button>
                <Button className="bg-[hsl(89,44%,49%)] active:scale-95">
                  Active State (scale-95)
                </Button>
                <Button disabled className="opacity-50 cursor-not-allowed">
                  Disabled State
                </Button>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded block">
                hover:bg-primary/90 active:scale-95
              </code>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Link States</h3>
            <Card className="p-6 space-y-4">
              <div className="space-y-3">
                <a href="#" className="text-[hsl(89,44%,49%)] hover:text-[hsl(89,44%,49%)]/80 underline-offset-4 hover:underline block">
                  Primary Link
                </a>
                <a href="#" className="text-[hsl(213,52%,25%)] hover:text-[hsl(213,52%,25%)]/80 block">
                  Secondary Link
                </a>
                <a href="#" className="text-muted-foreground hover:text-[hsl(89,44%,49%)] block">
                  Breadcrumb Link
                </a>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Card Hover States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-lg hover:border-[hsl(89,44%,49%)]/20 transition-all duration-300 cursor-pointer">
                <h4 className="font-semibold mb-2">Hover over deze card</h4>
                <p className="text-sm text-muted-foreground">Shadow lift + border color change</p>
              </div>
              <div className="p-6 border rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <h4 className="font-semibold mb-2">Scale hover</h4>
                <p className="text-sm text-muted-foreground">Card wordt groter bij hover</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Buttons & Sizes */}
        <section id="buttons" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              4. Button Variants & Sizes
            </h2>
            <p className="text-lg text-muted-foreground">
              Alle button combinaties met icons
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Button Variants</h3>
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">Primary</Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                
                <Button size="sm" className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">Small</Button>
                <Button size="default" className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">Default</Button>
                <Button size="lg" className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">Large</Button>
                
                <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Met Icon
                </Button>
                <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. Badges & Tags */}
        <section id="badges" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              5. Badges & Tags
            </h2>
            <p className="text-lg text-muted-foreground">
              Labels voor status en categorieën
            </p>
          </div>

          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green-100 text-green-800">Success</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              <Badge className="bg-red-100 text-red-800">Error</Badge>
              <Badge className="bg-blue-100 text-blue-800">Info</Badge>
              <Badge className="bg-[hsl(89,44%,49%)]/10 text-[hsl(89,44%,49%)]">Active</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Card>
        </section>

        {/* 6. Spacing & Layout */}
        <section id="spacing" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              6. Spacing & Layout
            </h2>
            <p className="text-lg text-muted-foreground">
              Consistent spacing systeem
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">Spacing Scale</h3>
            {[
              { size: '1', rem: '0.25rem', px: '4px', space: 1 },
              { size: '2', rem: '0.5rem', px: '8px', space: 2 },
              { size: '4', rem: '1rem', px: '16px', space: 4 },
              { size: '6', rem: '1.5rem', px: '24px', space: 6 },
              { size: '8', rem: '2rem', px: '32px', space: 8 },
              { size: '12', rem: '3rem', px: '48px', space: 12 },
              { size: '16', rem: '4rem', px: '64px', space: 16 },
            ].map(({ size, rem, px, space }) => (
              <div key={size} className="flex items-center gap-4">
                <code className="text-sm bg-muted px-2 py-1 rounded w-16">
                  {size}
                </code>
                <div className="flex items-center gap-2">
                  <div
                    className="h-12 rounded"
                    style={{ backgroundColor: `hsl(89, 44%, 49%)`, marginRight: `${space * 4}px` }}
                  />
                  <div className="h-12 w-12 bg-gray-300 rounded" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {rem} ({px})
                </span>
              </div>
            ))}
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Layout Patterns</h3>
            <Card className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Container</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  className="container mx-auto px-4 max-w-6xl"
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Section Padding</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  className="py-12 md:py-16 lg:py-24"
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Grid Layout</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                </code>
              </div>
            </Card>
          </div>
        </section>

        {/* 7. Do's and Don'ts */}
        <section id="dos-donts" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              7. Do&apos;s and Don&apos;ts
            </h2>
            <p className="text-lg text-muted-foreground">
              Visuele voorbeelden van correcte en incorrecte implementaties
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Kleurcontrasten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-error bg-red-50 p-4">
                <p className="text-sm">✗ Te weinig contrast tussen tekst en achtergrond</p>
              </div>
              <div className="border-l-4 border-[hsl(89,44%,49%)] bg-green-50 p-4">
                <p className="text-sm font-semibold text-[hsl(213,52%,25%)]">✓ Genoeg contrast (WCAG AA compliant)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Button Styling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-error bg-red-50 p-4">
                <Button className="bg-[hsl(16,85%,53%)]">✗ Hardcoded kleur</Button>
              </div>
              <div className="border-l-4 border-[hsl(89,44%,49%)] bg-green-50 p-4">
                <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">✓ Kaspers Green</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Spacing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-error bg-red-50 p-4 space-y-2">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
                <p className="text-sm">✗ Inconsistent spacing</p>
              </div>
              <div className="border-l-4 border-[hsl(89,44%,49%)] bg-green-50 p-4 space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
                <p className="text-sm">✓ Consistent grid (space-y-4)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Component Patterns */}
        <section id="components" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              8. Component Patterns
            </h2>
            <p className="text-lg text-muted-foreground">
              Werkende voorbeelden van veelgebruikte componenten
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 border rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <img 
                  src="/placeholder.svg" 
                  alt="Service afbeelding" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Badge className="bg-green-100 text-green-800 mb-2">Beschikbaar</Badge>
                  <h3 className="font-semibold text-lg text-[hsl(213,52%,25%)] mb-1">Service naam</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Korte omschrijving van de service met key benefits.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[hsl(213,52%,25%)]">Op aanvraag</span>
                    <Button size="sm" className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">
                      Meer info
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg border">
              <Badge className="bg-yellow-100 text-yellow-800 mb-3">Update</Badge>
              <h3 className="text-2xl font-bold text-[hsl(213,52%,25%)] mb-2">
                Belangrijke mededeling
              </h3>
              <p className="text-foreground/80 mb-4">
                Blijf op de hoogte van de laatste ontwikkelingen.
              </p>
              <Button className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">
                Lees meer
              </Button>
            </div>
          </div>
        </section>

        {/* 9. Responsive Design */}
        <section id="responsive" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              9. Responsive Design
            </h2>
            <p className="text-lg text-muted-foreground">
              Mobile-first approach met breakpoints
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Breakpoints</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code className="bg-muted px-2 py-1 rounded">sm</code>
                  <span>640px+</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-2 py-1 rounded">md</code>
                  <span>768px+</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-2 py-1 rounded">lg</code>
                  <span>1024px+</span>
                </div>
                <div className="flex justify-between">
                  <code className="bg-muted px-2 py-1 rounded">xl</code>
                  <span>1280px+</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Responsive Heading</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded block">
                text-4xl md:text-5xl lg:text-6xl
              </code>
            </div>
          </Card>
        </section>

        {/* 10. Accessibility */}
        <section id="accessibility" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              10. Accessibility
            </h2>
            <p className="text-lg text-muted-foreground">
              WCAG 2.1 AA compliant richtlijnen
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Focus States</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded block">
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Color Contrast</h4>
              <p className="text-sm text-muted-foreground">
                Alle tekst heeft minimaal 4.5:1 contrast ratio (WCAG AA)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Alt Text</h4>
              <p className="text-sm text-muted-foreground">
                Alle afbeeldingen hebben beschrijvende alt attributen
              </p>
            </div>
          </Card>
        </section>

        {/* 11. Logo & Icons */}
        <section id="icons" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              11. Logo & Icons
            </h2>
            <p className="text-lg text-muted-foreground">
              Icon usage en sizing richtlijnen
            </p>
          </div>

          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-[hsl(89,44%,49%)]" />
              <Phone className="w-8 h-8 text-[hsl(89,44%,49%)]" />
              <Mail className="w-8 h-8 text-[hsl(89,44%,49%)]" />
              <Star className="w-8 h-8 text-[hsl(160,84%,39%)]" />
            </div>
          </Card>
        </section>

        {/* 12. Loading States */}
        <section id="loading" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              12. Loading States
            </h2>
            <p className="text-lg text-muted-foreground">
              Loaders, spinners en skeletons
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-8 h-8 text-[hsl(89,44%,49%)] animate-spin" />
                <span>Loading spinner</span>
              </div>
              <div className="h-4 bg-[hsl(89,44%,49%)]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[hsl(89,44%,49%)] w-2/3 animate-pulse"></div>
              </div>
              <Button disabled className="bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </Button>
            </div>
          </Card>
        </section>

        {/* 13. Tone of Voice */}
        <section id="tone" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              13. Tone of Voice
            </h2>
            <p className="text-lg text-muted-foreground">
              Communicatiestijl en taalgebruik
            </p>
          </div>

          <Card className="p-6">
            <div className="prose max-w-none">
              <h4 className="font-semibold mb-3">Tone Kenmerken:</h4>
              <ul className="space-y-2 text-sm">
                <li>✓ <strong>Professioneel en helder:</strong> &quot;Kaspers Advies helpt u met strategie en advies op maat.&quot;</li>
                <li>✓ <strong>Betrouwbaar en transparant:</strong> &quot;Samen werken we aan duurzame resultaten.&quot;</li>
                <li>✓ <strong>Persoonlijk maar zakelijk:</strong> Combineer expertise met een menselijke touch</li>
                <li>✗ <strong>Te informeel:</strong> Vermijd slang of te casual taalgebruik</li>
                <li>✗ <strong>Te zakelijk of koud:</strong> Blijf persoonlijk en benaderbaar</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* 14. Mobile Patterns */}
        <section id="mobile" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              14. Mobile Patterns
            </h2>
            <p className="text-lg text-muted-foreground">
              Touch-vriendelijke interfaces
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Touch Targets</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Minimum 44x44px voor touch elements
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded block">
                className=&quot;min-h-[44px] min-w-[44px]&quot;
              </code>
            </div>
            <div>
              <Button className="w-full bg-[hsl(89,44%,49%)] hover:bg-[hsl(89,44%,49%)]/90 min-h-[44px]">
                Mobiel-vriendelijke button (min 44px)
              </Button>
            </div>
          </Card>
        </section>

        {/* 15. Animation & Timing */}
        <section id="animation" className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,52%,25%)] mb-2">
              15. Animation & Timing
            </h2>
            <p className="text-lg text-muted-foreground">
              Smooth transitions en animations
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Transition Durations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">duration-150</code>
                  <span>Quick interactions (hover, focus)</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">duration-300</code>
                  <span>Standard animations (default)</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">duration-500</code>
                  <span>Slow, emphasized animations</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Easing Functions</h4>
              <div className="space-y-2 text-sm">
                <code className="text-xs bg-muted px-2 py-1 rounded">ease-in-out</code>
                <span className="ml-2">Smooth start en end (default)</span>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[hsl(213,52%,25%)] text-white py-12 mt-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-lg mb-2">Kaspers Advies Brand Style Guide</p>
          <p className="text-sm text-white/70">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
          </p>
        </div>
      </footer>
    </div>
  );
}

interface ColorCardProps {
  name: string;
  hsl?: string;
  hex: string;
  usage: string;
}

function ColorCard({ name, hsl, hex, usage }: ColorCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-32" style={{ backgroundColor: hex }} />
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-lg">{name}</h4>
        {hsl && (
          <div className="text-sm">
            <strong>HSL:</strong> {hsl}
          </div>
        )}
        <div className="text-sm">
          <strong>HEX:</strong> {hex}
        </div>
        <p className="text-xs text-muted-foreground">{usage}</p>
      </div>
    </Card>
  );
}