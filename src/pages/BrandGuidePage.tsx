import { useState } from 'react';
import { Palette, Type, Layout, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function BrandGuidePage() {
  const [activeTab, setActiveTab] = useState('colors');

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--ka-navy))] mb-2">
          Kaspers Advies Brand Guide
        </h1>
        <p className="text-muted-foreground">
          Officiële merkrichtlijnen voor consistente branding
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'colors'
              ? 'text-[hsl(var(--ka-green))] border-b-2 border-[hsl(var(--ka-green))]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Kleuren
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'typography'
              ? 'text-[hsl(var(--ka-green))] border-b-2 border-[hsl(var(--ka-green))]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Type className="w-4 h-4 inline mr-2" />
          Typografie
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-[hsl(var(--ka-green))] border-b-2 border-[hsl(var(--ka-green))]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layout className="w-4 h-4 inline mr-2" />
          Componenten
        </button>
      </div>

      {/* Content */}
      {activeTab === 'colors' && <ColorsSection />}
      {activeTab === 'typography' && <TypographySection />}
      {activeTab === 'components' && <ComponentsSection />}
    </div>
  );
}

function ColorsSection() {
  return (
    <div className="space-y-8">
      {/* Primary Colors */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Primary Kleuren
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorCard
            name="Kaspers Green"
            variable="--ka-green"
            hex="#7AB547"
            hsl="89 44% 49%"
            usage="Primary buttons, CTAs, active states, brand accents"
          />
          <ColorCard
            name="Kaspers Navy"
            variable="--ka-navy"
            hex="#1E3A5F"
            hsl="213 52% 25%"
            usage="Headers, body text (emphasis), navigation, dark backgrounds"
          />
        </div>
      </div>

      {/* Gray Scale */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Gray Scale
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { shade: '50', hex: '#F9FAFB', usage: 'Page backgrounds' },
            { shade: '100', hex: '#F3F4F6', usage: 'Card backgrounds' },
            { shade: '200', hex: '#E5E7EB', usage: 'Borders, dividers' },
            { shade: '300', hex: '#D1D5DB', usage: 'Disabled states' },
            { shade: '400', hex: '#9CA3AF', usage: 'Placeholders' },
            { shade: '500', hex: '#6B7280', usage: 'Secondary text' },
            { shade: '600', hex: '#4B5563', usage: 'Secondary text' },
            { shade: '700', hex: '#374151', usage: 'Body text' },
            { shade: '800', hex: '#1F2937', usage: 'Dark text' },
            { shade: '900', hex: '#111827', usage: 'Headings' },
          ].map(({ shade, hex, usage }) => (
            <div key={shade} className="space-y-2">
              <div
                className="h-20 rounded-lg border border-border"
                style={{ backgroundColor: hex }}
              />
              <p className="text-sm font-medium">Gray {shade}</p>
              <p className="text-xs text-muted-foreground">{usage}</p>
              <CopyButton text={hex} label={hex} />
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Semantic Kleuren
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ColorCard
            name="Success"
            hex="#10B981"
            hsl="160 84% 39%"
            usage="Success states, completed actions"
          />
          <ColorCard
            name="Warning"
            hex="#F59E0B"
            hsl="38 92% 50%"
            usage="Warnings, pending states"
          />
          <ColorCard
            name="Error"
            hex="#EF4444"
            hsl="0 84% 60%"
            usage="Errors, destructive actions"
          />
          <ColorCard
            name="Info"
            hex="#3B82F6"
            hsl="217 91% 60%"
            usage="Information, neutral alerts"
          />
        </div>
      </div>

      {/* Channel Colors */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Channel Kleuren
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ColorCard name="WhatsApp" hex="#25D366" usage="WhatsApp kanaal" />
          <ColorCard name="Email" hex="#EA4335" usage="Email kanaal" />
          <ColorCard name="Phone" hex="#0088CC" usage="Telefoon kanaal" />
          <ColorCard name="Video" hex="#00AFF0" usage="Video call kanaal" />
        </div>
      </div>
    </div>
  );
}

function ColorCard({ name, variable, hex, hsl, usage }: any) {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div
        className="h-24 rounded-lg mb-4 border"
        style={{ backgroundColor: hex }}
      />
      <h3 className="font-semibold text-[hsl(var(--ka-navy))] mb-2">{name}</h3>
      {variable && (
        <code className="text-sm bg-muted px-2 py-1 rounded block mb-2">
          {variable}
        </code>
      )}
      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <strong>HEX:</strong>
          <CopyButton text={hex} label={hex} />
        </div>
        {hsl && (
          <div className="flex items-center justify-between">
            <strong>HSL:</strong>
            <CopyButton text={hsl} label={hsl} />
          </div>
        )}
        {usage && (
          <p className="mt-2 text-xs">
            <strong>Gebruik:</strong> {usage}
          </p>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Gekopieerd!', description: `${label} naar klembord gekopieerd` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs flex items-center space-x-1 hover:text-[hsl(var(--ka-green))] transition-colors"
    >
      {copied ? (
        <Check className="w-3 h-3" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
      <span>{label}</span>
    </button>
  );
}

function TypographySection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">Headers</h2>
        <div className="space-y-6 bg-card rounded-lg p-6 border">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--ka-navy))]">
              H1: Heading Level 1 (30px)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              text-3xl / font-bold / text-[hsl(var(--ka-navy))]
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
              className="text-3xl font-bold text-[hsl(var(--ka-navy))]"
            </code>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[hsl(var(--ka-navy))]">
              H2: Heading Level 2 (24px)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              text-2xl / font-bold / text-[hsl(var(--ka-navy))]
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
              className="text-2xl font-bold text-[hsl(var(--ka-navy))]"
            </code>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[hsl(var(--ka-navy))]">
              H3: Heading Level 3 (20px)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              text-xl / font-semibold / text-[hsl(var(--ka-navy))]
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
              className="text-xl font-semibold text-[hsl(var(--ka-navy))]"
            </code>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">
              H4: Heading Level 4 (18px)
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              text-lg / font-semibold / text-foreground
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">Body Text</h2>
        <div className="space-y-6 bg-card rounded-lg p-6 border">
          <div>
            <p className="text-lg text-foreground">
              Large: Intro paragraphs en belangrijke tekst (18px)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              text-lg / text-foreground
            </p>
          </div>
          <div>
            <p className="text-base text-foreground">
              Base: Standaard body text en form inputs (16px)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              text-base / text-foreground
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Small: Secondary text en captions (14px)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              text-sm / text-muted-foreground
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Tiny: Timestamps, badges, micro-copy (12px)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              text-xs / text-muted-foreground
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Font Weights
        </h2>
        <div className="space-y-3 bg-card rounded-lg p-6 border">
          <p className="font-light">Light (300): Zelden gebruikt</p>
          <p className="font-normal">Regular (400): Body text (default)</p>
          <p className="font-medium">Medium (500): Semi-emphasis</p>
          <p className="font-semibold">Semibold (600): Headers, buttons</p>
          <p className="font-bold">Bold (700): Strong emphasis, H1</p>
        </div>
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4 bg-card rounded-lg p-6 border">
          <Button className="bg-[hsl(var(--ka-green))] hover:bg-[hsl(var(--ka-green))]/90">
            Primary Button
          </Button>
          <Button variant="outline">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <code className="block bg-muted p-2 rounded">
            {'<Button className="bg-[hsl(var(--ka-green))]">Primary</Button>'}
          </code>
          <code className="block bg-muted p-2 rounded">
            {'<Button variant="outline">Secondary</Button>'}
          </code>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3 bg-card rounded-lg p-6 border">
          <Badge className="bg-green-100 text-green-800">Success</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
          <Badge className="bg-red-100 text-red-800">Error</Badge>
          <Badge className="bg-blue-100 text-blue-800">Info</Badge>
          <Badge className="bg-[hsl(var(--ka-green))]/10 text-[hsl(var(--ka-green))]">
            Active
          </Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Spacing Scale
        </h2>
        <div className="space-y-2 bg-card rounded-lg p-6 border">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((space) => (
            <div key={space} className="flex items-center space-x-4">
              <code className="text-sm w-20">space-{space}</code>
              <div
                className="bg-[hsl(var(--ka-green))] h-4"
                style={{ width: `${space * 4}px` }}
              />
              <span className="text-sm text-muted-foreground">
                {space * 4}px ({space * 0.25}rem)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--ka-navy))] mb-4">
          Border Radius
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card p-6 border rounded-lg">
          {[
            { name: 'sm', value: '2px' },
            { name: 'default', value: '4px' },
            { name: 'md', value: '6px' },
            { name: 'lg', value: '8px' },
            { name: 'xl', value: '12px' },
            { name: '2xl', value: '16px' },
            { name: '3xl', value: '24px' },
            { name: 'full', value: '9999px' },
          ].map(({ name, value }) => (
            <div key={name} className="space-y-2">
              <div
                className="h-16 bg-[hsl(var(--ka-green))]"
                style={{ borderRadius: value }}
              />
              <p className="text-sm font-medium">rounded-{name}</p>
              <p className="text-xs text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
