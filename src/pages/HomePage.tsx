import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Lightbulb, 
  Home, 
  Star, 
  Clock, 
  MapPin,
  Handshake,
  FileText,
  Users,
  TrendingUp,
  Phone,
  MessageCircle,
  CheckCircle,
  Award,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KaspersNavigation from '@/components/layout/KaspersNavigation';
import KaspersFooter from '@/components/layout/KaspersFooter';

const testimonials = [
  {
    quote: "Kaspers Advies heeft ons kapsalon volledig ontzorgd. Harm-Jan is altijd bereikbaar en denkt echt mee over hoe we kunnen groeien. Geen gedoe meer met administratie, daar hebben we geen tijd voor!",
    name: "Petra de Vries",
    company: "Kapsalon De Vries",
    location: "Stadskanaal",
    type: "MKB"
  },
  {
    quote: "Als aannemer zit ik niet te wachten op complexe belastingpraat. Harm-Jan legt alles helder uit en helpt me bij het opschalen van mijn bedrijf. Perfect advies op het juiste moment.",
    name: "Marco Jansen",
    company: "Bouwbedrijf Jansen",
    location: "Veendam",
    type: "ZZP"
  },
  {
    quote: "Door mijn werkzaamheden in het buitenland was mijn belastingsituatie complex. Kaspers Advies heeft alles uitgezocht en perfect geregeld. Betrouwbaar en persoonlijk, precies wat ik zocht.",
    name: "Jan Hendrik Smit",
    company: "Particulier",
    location: "Groningen",
    type: "Particulier"
  }
];

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://kaspersadvies.nl/#organization",
        "name": "Kaspers Advies",
        "url": "https://kaspersadvies.nl",
        "logo": "https://kaspersadvies.nl/logo.png",
        "image": "https://kaspersadvies.nl/office.jpg",
        "description": "Belastingadviseur en boekhouder in Stadskanaal voor MKB, ZZP-ers en particulieren. 16+ jaar ervaring, ook aan huis.",
        "priceRange": "€€",
        "telephone": "+31599123456",
        "email": "info@kaspersadvies.nl",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hoofdstraat 123",
          "addressLocality": "Stadskanaal",
          "postalCode": "9501 AA",
          "addressCountry": "NL"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "52.9922",
          "longitude": "6.9537"
        },
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "52.9922",
            "longitude": "6.9537"
          },
          "geoRadius": "50000"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "9.3",
          "reviewCount": "50",
          "bestRating": "10",
          "worstRating": "1"
        },
        "founder": {
          "@type": "Person",
          "name": "Harm-Jan Kaspers"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://kaspersadvies.nl/#localbusiness",
        "name": "Kaspers Advies - Belastingadviseur Stadskanaal",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Kaspers Advies | Belastingadviseur Stadskanaal | Trustoo 9,3</title>
        <meta 
          name="description" 
          content="Belastingadviseur en boekhouder in Stadskanaal voor MKB, ZZP-ers en particulieren. 16+ jaar ervaring, Trustoo 9,3, ook aan huis. Gratis kennismaking." 
        />
        <meta name="keywords" content="boekhouder Stadskanaal, belastingadviseur Groningen, administratiekantoor Stadskanaal, belastingadvies MKB, ZZP administratie" />
        <link rel="canonical" href="https://kaspersadvies.nl" />
        <meta property="og:title" content="Kaspers Advies | Betrouwbare Belastingadviseur Stadskanaal" />
        <meta property="og:description" content="16+ jaar ervaring, Trustoo 9,3, ook aan huis. Gratis kennismaking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kaspersadvies.nl" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <KaspersNavigation />
        {/* Hero Section */}
        <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center bg-gradient-to-br from-ka-gray-50 via-background to-ka-green/5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjIsMTgxLDcxLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-ka-green/10 text-ka-green border border-ka-green">
                <Award className="w-4 h-4 mr-2" />
                16+ jaar vertrouwd in Stadskanaal
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ka-navy mb-6 leading-tight">
                Uw administratie volledig uit handen.<br />
                <span className="text-ka-green">Direct contact met Harm-Jan.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-ka-gray-700 mb-8 leading-relaxed font-medium">
                Boekhouding, salarisadministratie en belastingadvies.<br />
                Geen callcenter, maar direct met de ondernemer die u écht helpt.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Badge variant="secondary" className="px-4 py-2 text-base bg-white border-2 border-ka-green hover:bg-ka-green/10 transition-colors cursor-pointer">
                  <Star className="w-5 h-5 mr-2 fill-amber-400 text-amber-400" />
                  Trustoo 9,3 ⭐
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base bg-white border-2 border-ka-navy hover:bg-ka-navy/10 transition-colors">
                  <Clock className="w-5 h-5 mr-2" />
                  48 uur reactiegarantie
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base bg-white border-2 border-ka-green-dark hover:bg-ka-green/10 transition-colors">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ook aan huis mogelijk
                </Badge>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-ka-green hover:bg-ka-green-dark text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/contact-kaspers">
                    <Calendar className="mr-2 h-5 w-5" />
                    Gratis kennismakingsgesprek
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-ka-navy text-ka-navy hover:bg-ka-navy hover:text-white px-8 py-6 text-lg font-semibold transition-all"
                  asChild
                >
                  <Link to="/diensten">
                    Bekijk onze diensten
                  </Link>
                </Button>
              </div>

              {/* Contact Icons */}
              <div className="flex justify-center gap-6 text-ka-gray-600">
                <a 
                  href="tel:+31599123456" 
                  className="flex items-center gap-2 hover:text-ka-green transition-colors group"
                  aria-label="Bel ons direct"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">0599-123 456</span>
                </a>
                <a 
                  href="https://wa.me/31599123456" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ka-green transition-colors group"
                  aria-label="Stuur een WhatsApp bericht"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Doelgroepen Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* MKB Card */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 hover:border-ka-green bg-gradient-to-br from-white to-ka-gray-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ka-green/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-ka-green/20 transition-colors">
                    <Building2 className="w-8 h-8 text-ka-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-ka-navy mb-4">
                    MKB Ondernemers 🏢
                  </h3>
                  <p className="text-lg text-ka-gray-600 mb-6 font-medium">
                    Complete administratie uit handen
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Boekhouding & salarisadministratie</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Jaarstukken & belastingaangiftes</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Fiscaal advies voor groei</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-ka-green hover:bg-ka-green-dark text-white" 
                    asChild
                  >
                    <Link to="/diensten-mkb">MKB Diensten</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* ZZP Card */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 hover:border-ka-green bg-gradient-to-br from-white to-ka-gray-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ka-red/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-ka-red/20 transition-colors">
                    <Lightbulb className="w-8 h-8 text-ka-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-ka-navy mb-4">
                    ZZP-ers 💡
                  </h3>
                  <p className="text-lg text-ka-gray-600 mb-6 font-medium">
                    Groeibegeleiding voor gevestigde ZZP-ers
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Administratie vanaf 3-5 jaar ervaring</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Groeiplan & schaaladvies</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Privé-zakelijk combinatie</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-ka-green hover:bg-ka-green-dark text-white" 
                    asChild
                  >
                    <Link to="/diensten-zzp">ZZP Diensten</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Particulieren Card */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 hover:border-ka-green bg-gradient-to-br from-white to-ka-gray-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-ka-navy/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-ka-navy/20 transition-colors">
                    <Home className="w-8 h-8 text-ka-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-ka-navy mb-4">
                    Particulieren 🏡
                  </h3>
                  <p className="text-lg text-ka-gray-600 mb-6 font-medium">
                    Persoonlijk advies voor uw situatie
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Belastingaangifte</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Financieel advies</span>
                    </li>
                    <li className="flex items-start gap-2 text-ka-gray-700">
                      <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                      <span>Vermogensplanning</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-ka-green hover:bg-ka-green-dark text-white" 
                    asChild
                  >
                    <Link to="/diensten-particulieren">Particulieren Diensten</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Waarom Kaspers Advies Section */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ka-navy text-center mb-4">
              Waarom klanten voor Harm-Jan kiezen
            </h2>
            <p className="text-lg text-ka-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Geen callcenter, geen wachttijden. Direct contact met de ondernemer die uw zaken regelt.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* USP's */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-ka-green">
                    <Star className="w-6 h-6 text-amber-400 shrink-0 mt-1 fill-amber-400" />
                    <div>
                      <h4 className="font-bold text-ka-navy mb-1">Trustoo 9,3 ⭐</h4>
                      <p className="text-sm text-ka-gray-700 font-medium">Hoger dan grotere kantoren</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-ka-green">
                    <Clock className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-ka-navy mb-1">48-uurs garantie</h4>
                      <p className="text-sm text-ka-gray-700 font-medium">Altijd snel antwoord</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-ka-green">
                    <MapPin className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-ka-navy mb-1">Ook aan huis</h4>
                      <p className="text-sm text-ka-gray-700 font-medium">Wij komen naar u toe</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-ka-green">
                    <Phone className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-ka-navy mb-1">Direct Harm-Jan</h4>
                      <p className="text-sm text-ka-gray-700 font-medium">Geen tussenpersonen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Card className="bg-white shadow-lg border-2 border-ka-green/20 min-h-[320px] flex flex-col">
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
                    </div>
                    <blockquote className="text-lg text-ka-gray-700 mb-6 italic flex-1">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    <div className="border-t border-ka-gray-200 pt-4">
                      <p className="font-semibold text-ka-navy">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-sm text-ka-gray-600">
                        {testimonials[currentTestimonial].company}
                      </p>
                      <p className="text-sm text-ka-gray-500">
                        {testimonials[currentTestimonial].location}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? 'bg-ka-green w-8' 
                          : 'bg-ka-gray-300 hover:bg-ka-gray-400'
                      }`}
                      aria-label={`Ga naar testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Werkwijze Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ka-navy text-center mb-16">
              Onze Werkwijze
            </h2>

            {/* Desktop Timeline */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-ka-green/20 -translate-y-1/2" />
                
                <div className="grid grid-cols-4 gap-8 relative">
                  {/* Step 1 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-full mb-6 relative z-10 shadow-lg">
                      <Handshake className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ka-navy mb-3">
                      1. Kennismaking
                    </h3>
                    <p className="text-ka-gray-600">
                      Gratis intake - fysiek of online
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-full mb-6 relative z-10 shadow-lg">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ka-navy mb-3">
                      2. Plan van Aanpak
                    </h3>
                    <p className="text-ka-gray-600">
                      Maatwerk offerte binnen 48 uur
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-full mb-6 relative z-10 shadow-lg">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ka-navy mb-3">
                      3. Samenwerking
                    </h3>
                    <p className="text-ka-gray-600">
                      48u reactiegarantie, persoonlijk contact
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-full mb-6 relative z-10 shadow-lg">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ka-navy mb-3">
                      4. Evaluatie
                    </h3>
                    <p className="text-ka-gray-600">
                      Jaarlijkse evaluatie en optimalisatie
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Vertical Flow */}
            <div className="lg:hidden space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-ka-green rounded-full shadow-lg shrink-0">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-1 flex-1 bg-ka-green/20 mt-4" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-ka-navy mb-2">
                    1. Kennismaking
                  </h3>
                  <p className="text-ka-gray-600">
                    Gratis intake - fysiek of online
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-ka-green rounded-full shadow-lg shrink-0">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-1 flex-1 bg-ka-green/20 mt-4" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-ka-navy mb-2">
                    2. Plan van Aanpak
                  </h3>
                  <p className="text-ka-gray-600">
                    Maatwerk offerte binnen 48 uur
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-ka-green rounded-full shadow-lg shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-1 flex-1 bg-ka-green/20 mt-4" />
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-ka-navy mb-2">
                    3. Samenwerking
                  </h3>
                  <p className="text-ka-gray-600">
                    48u reactiegarantie, persoonlijk contact
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-ka-green rounded-full shadow-lg shrink-0">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ka-navy mb-2">
                    4. Evaluatie
                  </h3>
                  <p className="text-ka-gray-600">
                    Jaarlijkse evaluatie en optimalisatie
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-ka-navy text-ka-navy hover:bg-ka-navy hover:text-white"
                asChild
              >
                <Link to="/werkwijze">
                  Lees meer over onze werkwijze
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Werkgebied Section */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ka-navy mb-6">
                Actief in Groningen en Drenthe
              </h2>
              <p className="text-lg text-ka-gray-700 mb-8 leading-relaxed">
                Kantoor in Stadskanaal. We werken binnen 50 kilometer. Ook aan huis wanneer het u uitkomt.
              </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Stadskanaal', 'Groningen', 'Assen', 'Veendam', 'Hoogezand', 'Winschoten', 'Emmen'].map((plaats) => (
                    <Badge 
                      key={plaats}
                      variant="secondary" 
                      className="px-4 py-2 bg-white border border-ka-green text-ka-navy hover:bg-ka-green hover:text-white transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {plaats}
                    </Badge>
                  ))}
                </div>
                <div className="p-6 bg-white rounded-lg border-2 border-ka-green/20">
                  <h3 className="font-semibold text-ka-navy mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-ka-green" />
                    Ons kantoor
                  </h3>
                  <p className="text-ka-gray-700">
                    Hoofdstraat 123<br />
                    9501 AA Stadskanaal<br />
                    <a href="tel:+31599123456" className="text-ka-green hover:underline">0599-123 456</a>
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative h-[400px] lg:h-[500px] bg-ka-gray-200 rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ka-green/5 to-ka-navy/5">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-ka-green mx-auto mb-4" />
                    <p className="text-ka-gray-600 font-medium">
                      Interactieve kaart met 50km werkgebied
                    </p>
                    <p className="text-sm text-ka-gray-500 mt-2">
                      Stadskanaal en omliggende gemeenten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-ka-navy via-ka-navy-dark to-ka-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-40"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Klaar om uw administratie uit handen te geven?
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Plan een gratis kennismakingsgesprek en ontdek hoe we u kunnen ontzorgen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-ka-red hover:bg-ka-red-dark text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  asChild
                >
                  <Link to="/contact">
                    <Calendar className="mr-2 h-5 w-5" />
                    Neem contact op
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-ka-navy px-8 py-6 text-lg font-semibold transition-all"
                  asChild
                >
                  <a href="tel:+31599123456">
                    <Phone className="mr-2 h-5 w-5" />
                    Bel direct: 0599-123 456
                  </a>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-white/90">Trustoo 9,3</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-ka-green" />
                  <span className="text-white/90">Geregistreerd Belastingadviseur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-ka-green" />
                  <span className="text-white/90">16+ jaar ervaring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sticky Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-ka-green shadow-2xl z-50">
          <Button 
            size="lg" 
            className="w-full bg-ka-red hover:bg-ka-red-dark text-white font-bold shadow-lg"
            asChild
          >
            <a href="tel:+31599123456">
              <Phone className="mr-2 h-5 w-5" />
              Bel Direct: 0599-123 456
            </a>
          </Button>
        </div>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/31599123456"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40 group"
          aria-label="Chat via WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute right-16 bg-ka-navy text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat via WhatsApp
          </span>
        </a>
        
        <KaspersFooter />
      </div>
    </>
  );
};

export default HomePage;
