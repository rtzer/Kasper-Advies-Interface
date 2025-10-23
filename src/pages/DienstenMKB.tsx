import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Phone, 
  Calendar,
  TrendingUp,
  FileText,
  Users,
  Calculator,
  PiggyBank,
  Shield,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KaspersNavigation from '@/components/layout/KaspersNavigation';

const DienstenMKB = () => {
  const diensten = [
    {
      icon: FileText,
      title: 'Boekhouding',
      description: 'Complete administratie, btw-aangiftes, en debiteuren/crediteuren. Altijd actueel en op tijd.',
      items: [
        'Inkoop- en verkoopfacturen',
        'Bankboek en kasboek',
        'BTW-aangiftes per kwartaal',
        'Debiteurenbeheer'
      ]
    },
    {
      icon: Users,
      title: 'Salarisadministratie',
      description: 'Uw personeel op tijd betaald. Alle loonaangiftes en rapportages geregeld.',
      items: [
        'Loonstroken en jaaropgaven',
        'Loonaangiftes bij Belastingdienst',
        'Pensioenaangifte',
        'Ziektewet en WIA'
      ]
    },
    {
      icon: Calculator,
      title: 'Jaarstukken & Belastingen',
      description: 'Jaarrekening op tijd klaar. Belastingaangifte zonder gedoe.',
      items: [
        'Opstellen jaarrekening',
        'Vennootschapsbelasting',
        'IB-aangifte (DGA)',
        'Balans en verlies- en winstrekening'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Fiscaal Advies',
      description: 'Meedenken over wat slim is. Geen verrassingen met de Belastingdienst.',
      items: [
        'Fiscale optimalisatie',
        'Investeringsaftrek (KIA, MIA)',
        'Auto van de zaak regeling',
        'Aanschaf inventaris'
      ]
    },
    {
      icon: PiggyBank,
      title: 'Groeiondersteuning',
      description: 'Meer omzet, een medewerker erbij, een nieuwe vestiging? We denken mee.',
      items: [
        'Financieringsadvies',
        'Groeiscenario\'s doorrekenen',
        'Extra personeel in dienst',
        'Uitbreiding locaties'
      ]
    },
    {
      icon: Shield,
      title: 'Controle & Advies',
      description: 'We checken of alles klopt. En waarschuwen als er iets mis dreigt te gaan.',
      items: [
        'Controle aangiftes',
        'Liquiditeitsbewaking',
        'Voorkom naheffingen',
        'Jaarlijks evaluatiegesprek'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>MKB Diensten | Complete Administratie | Kaspers Advies Stadskanaal</title>
        <meta 
          name="description" 
          content="Complete boekhouding, salarisadministratie en belastingen voor MKB. Binnen 48 uur reactie. Ook aan huis in Groningen en Drenthe." 
        />
        <link rel="canonical" href="https://kaspersadvies.nl/diensten-mkb" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <KaspersNavigation />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ka-green/5 via-background to-ka-gray-50 py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-ka-green/10 text-ka-green border-ka-green">
                MKB Diensten
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ka-navy mb-6 leading-tight">
                Complete Administratie uit Handen
              </h1>
              <p className="text-xl sm:text-2xl text-ka-gray-600 mb-8">
                Voor bedrijven tot 10 medewerkers. Boekhouding, salaris, jaarstukken én fiscaal advies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2 bg-white border border-ka-green">
                  <CheckCircle className="w-4 h-4 mr-2 text-ka-green" />
                  48 uur reactie
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 bg-white border border-ka-green">
                  <CheckCircle className="w-4 h-4 mr-2 text-ka-green" />
                  Ook aan huis
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 bg-white border border-ka-green">
                  <CheckCircle className="w-4 h-4 mr-2 text-ka-green" />
                  Direct contact Harm-Jan
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Voor Wie Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-6 text-center">
                Voor Wie?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="border-2 border-ka-green/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      ✓ Perfect voor u als:
                    </h3>
                    <ul className="space-y-2 text-ka-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>U geen tijd heeft voor de administratie</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>U personeel in dienst heeft</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>U wil groeien zonder administratief gedoe</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                        <span>U zekerheid wil dat alles op tijd en goed is</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-ka-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      Bedrijven die we helpen:
                    </h3>
                    <ul className="space-y-2 text-ka-gray-700">
                      <li>• Kapsalons en schoonheidssalons</li>
                      <li>• Bouwbedrijven en aannemers</li>
                      <li>• Winkels en horeca</li>
                      <li>• Installateurs en loodgieters</li>
                      <li>• Advocaten en consultants</li>
                      <li>• Transportbedrijven</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Diensten Section */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-4 text-center">
              Wat We Voor U Doen
            </h2>
            <p className="text-lg text-ka-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Complete administratie. Alles onder één dak.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {diensten.map((dienst, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-ka-green/10 rounded-lg flex items-center justify-center mb-4">
                      <dienst.icon className="w-6 h-6 text-ka-green" />
                    </div>
                    <h3 className="text-xl font-bold text-ka-navy mb-3">
                      {dienst.title}
                    </h3>
                    <p className="text-ka-gray-600 mb-4 leading-relaxed">
                      {dienst.description}
                    </p>
                    <ul className="space-y-2">
                      {dienst.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-ka-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-ka-green shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Werkwijze Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-6 text-center">
                Hoe We Samenwerken
              </h2>
              <p className="text-lg text-ka-gray-600 text-center mb-12">
                Simpel en duidelijk. Geen gedoe.
              </p>

              <div className="space-y-6">
                <Card className="border-l-4 border-ka-green">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ka-green rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ka-navy mb-2">
                          Kennismaking
                        </h3>
                        <p className="text-ka-gray-700">
                          Gratis gesprek bij u op kantoor of bij ons. We kijken wat u nodig heeft. Geen verkoop praatjes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ka-green">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ka-green rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ka-navy mb-2">
                          Offerte binnen 48 uur
                        </h3>
                        <p className="text-ka-gray-700">
                          Duidelijk prijsoverzicht. Geen verborgen kosten. Alles op maat voor uw bedrijf.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ka-green">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ka-green rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ka-navy mb-2">
                          We regelen het
                        </h3>
                        <p className="text-ka-gray-700">
                          U stuurt facturen en bankafschriften. Wij verwerken alles en houden u op de hoogte.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-ka-green">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ka-green rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ka-navy mb-2">
                          Altijd bereikbaar
                        </h3>
                        <p className="text-ka-gray-700">
                          Vraag? Binnen 48 uur antwoord. Ook 's avonds en in het weekend voor noodgevallen.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Waarom Kaspers Section */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-ka-navy mb-12 text-center">
                Waarom Kaspers Advies?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">16+ jaar ervaring</h3>
                    <p className="text-ka-gray-600">Sinds 2009 actief in Stadskanaal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">Persoonlijk contact</h3>
                    <p className="text-ka-gray-600">Direct met Harm-Jan, geen callcenter</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">48 uur reactie garantie</h3>
                    <p className="text-ka-gray-600">Geen weken wachten op antwoord</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">Ook aan huis</h3>
                    <p className="text-ka-gray-600">Binnen 50km komen we bij u langs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">Geregistreerd Belastingadviseur</h3>
                    <p className="text-ka-gray-600">Officieel erkend en verzekerd</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-ka-green shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-ka-navy mb-1">Trustoo 9,3</h3>
                    <p className="text-ka-gray-600">Uit 50+ beoordelingen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-ka-navy via-ka-navy-dark to-ka-navy text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Administratie uit handen?
              </h2>
              <p className="text-xl text-white/90 mb-10">
                Gratis kennismaking. We pakken het gewoon aan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-ka-red hover:bg-ka-red-dark text-white px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/contact-kaspers">
                    <Calendar className="mr-2 h-5 w-5" />
                    Neem contact op
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

export default DienstenMKB;
