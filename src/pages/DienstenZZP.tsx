import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Phone, 
  Calendar,
  TrendingUp,
  FileText,
  Calculator,
  Target,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KaspersNavigation from '@/components/layout/KaspersNavigation';

const DienstenZZP = () => {
  return (
    <>
      <Helmet>
        <title>ZZP Groeibegeleiding | Administratie voor Gevestigde ZZP-ers | Kaspers Advies</title>
        <meta 
          name="description" 
          content="Groeibegeleiding voor ZZP-ers die 3-5+ jaar actief zijn. Administratie, groeiplan en schaaladvies. Direct contact met Harm-Jan." 
        />
        <link rel="canonical" href="https://kaspersadvies.nl/diensten-zzp" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <KaspersNavigation />

        {/* Hero */}
        <section className="bg-gradient-to-br from-ka-red/5 via-background to-ka-gray-50 py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-ka-red/10 text-ka-red border-ka-red">
                ZZP Diensten
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ka-navy mb-6 leading-tight">
                Groeibegeleiding voor Gevestigde ZZP-ers
              </h1>
              <p className="text-xl sm:text-2xl text-ka-gray-600 mb-8">
                Voor zelfstandigen die minimaal 3-5 jaar draaien. Administratie én advies voor de volgende stap.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-ka-red hover:bg-ka-red-dark text-white px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/contact-kaspers">
                    <Calendar className="mr-2 h-5 w-5" />
                    Gratis kennismaking
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-ka-navy text-ka-navy hover:bg-ka-navy hover:text-white px-8 py-6 text-lg"
                  asChild
                >
                  <a href="tel:+31599123456">
                    <Phone className="mr-2 h-5 w-5" />
                    0599-123 456
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Voor Wie */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-6 text-center">
                Perfect voor Gevestigde ZZP-ers
              </h2>
              <p className="text-lg text-ka-gray-600 text-center mb-12">
                Geen startersbegeleiding. Wel groeibegeleiding.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-ka-red/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      ✓ U herkent zich als:
                    </h3>
                    <ul className="space-y-3 text-ka-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>3-5+ jaar actief als zelfstandige</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>Groeiend in omzet en opdrachten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>Geen tijd voor administratie</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>Denkt na over BV of personeel</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-ka-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      ZZP-ers die we helpen:
                    </h3>
                    <ul className="space-y-2 text-ka-gray-700">
                      <li>• Aannemers en installateurs</li>
                      <li>• Adviseurs en consultants</li>
                      <li>• ICT'ers en programmeurs</li>
                      <li>• Grafisch ontwerpers</li>
                      <li>• Fysiotherapeuten</li>
                      <li>• Fotografen en creatieven</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Diensten */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-12 text-center">
              Wat We Voor U Doen
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-ka-green/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-ka-green" />
                  </div>
                  <h3 className="text-xl font-bold text-ka-navy mb-3">
                    Administratie
                  </h3>
                  <p className="text-ka-gray-600 mb-4">
                    Boekhouding en btw-aangiftes. Alles op tijd en foutloos.
                  </p>
                  <ul className="space-y-2">
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Facturen verwerken</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>BTW-aangiftes per kwartaal</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Bankboek bijhouden</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-ka-green/10 rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-ka-green" />
                  </div>
                  <h3 className="text-xl font-bold text-ka-navy mb-3">
                    Belastingaangifte
                  </h3>
                  <p className="text-ka-gray-600 mb-4">
                    Zakelijk én privé. Gecombineerd of apart.
                  </p>
                  <ul className="space-y-2">
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>IB-aangifte (inkomstenbelasting)</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Zelfstandigenaftrek optimaal benutten</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Privé-zakelijk combinatie</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow border-2 border-ka-red/30">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-ka-red/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-ka-red" />
                  </div>
                  <h3 className="text-xl font-bold text-ka-navy mb-3">
                    Groeiplan & Schaaladvies
                  </h3>
                  <p className="text-ka-gray-600 mb-4">
                    Meedenken over de volgende stap. Van eenmanszaak naar BV of personeel in dienst.
                  </p>
                  <ul className="space-y-2">
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>BV oprichten - wanneer slim?</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Eerste medewerker in dienst</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Groeiscenario's doorrekenen</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-ka-green/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-ka-green" />
                  </div>
                  <h3 className="text-xl font-bold text-ka-navy mb-3">
                    Fiscaal Advies
                  </h3>
                  <p className="text-ka-gray-600 mb-4">
                    Slim omgaan met de Belastingdienst. Geen gedoe.
                  </p>
                  <ul className="space-y-2">
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Auto van de zaak of privé?</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Investeringsaftrek (KIA, MIA)</span>
                    </li>
                    <li className="text-sm text-ka-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                      <span>Pensioen opbouwen als ZZP-er</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-ka-navy via-ka-navy-dark to-ka-navy text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <Lightbulb className="w-16 h-16 text-ka-red mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Klaar voor de Volgende Stap?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Gratis kennismaking. We bespreken uw groeiplan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-ka-red hover:bg-ka-red-dark text-white px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/contact-kaspers">
                    <Calendar className="mr-2 h-5 w-5" />
                    Plan een gesprek
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-ka-navy px-8 py-6 text-lg"
                  asChild
                >
                  <a href="tel:+31599123456">
                    <Phone className="mr-2 h-5 w-5" />
                    Bel: 0599-123 456
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DienstenZZP;
