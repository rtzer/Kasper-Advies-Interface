import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import KaspersNavigation from '@/components/layout/KaspersNavigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactKaspers = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    telefoon: '',
    bericht: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Bericht verzonden!",
      description: "We nemen binnen 48 uur contact met u op.",
    });

    setFormData({ naam: '', email: '', telefoon: '', bericht: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact | Kaspers Advies Stadskanaal | 0599-123 456</title>
        <meta 
          name="description" 
          content="Neem contact op met Kaspers Advies. Binnen 48 uur reactie. Ook aan huis in Groningen en Drenthe. Bel 0599-123 456." 
        />
        <link rel="canonical" href="https://kaspersadvies.nl/contact-kaspers" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <KaspersNavigation />

        {/* Hero */}
        <section className="bg-gradient-to-br from-ka-green/5 via-background to-ka-gray-50 py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ka-navy mb-6">
                Neem Contact Op
              </h1>
              <p className="text-xl sm:text-2xl text-ka-gray-600 mb-8">
                Binnen 48 uur reactie. Gratis kennismaking.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-ka-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-ka-green" />
                  </div>
                  <h3 className="text-lg font-bold text-ka-navy mb-2">
                    Bel Direct
                  </h3>
                  <a 
                    href="tel:+31599123456" 
                    className="text-ka-green hover:text-ka-green-dark font-semibold text-lg block mb-2"
                  >
                    0599-123 456
                  </a>
                  <p className="text-sm text-ka-gray-600">
                    Ma-vr: 9:00 - 17:00
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-ka-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-ka-red" />
                  </div>
                  <h3 className="text-lg font-bold text-ka-navy mb-2">
                    WhatsApp
                  </h3>
                  <a 
                    href="https://wa.me/31599123456" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ka-green hover:text-ka-green-dark font-semibold text-lg block mb-2"
                  >
                    Stuur een bericht
                  </a>
                  <p className="text-sm text-ka-gray-600">
                    Ook 's avonds bereikbaar
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-ka-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-ka-navy" />
                  </div>
                  <h3 className="text-lg font-bold text-ka-navy mb-2">
                    E-mail
                  </h3>
                  <a 
                    href="mailto:info@kaspersadvies.nl" 
                    className="text-ka-green hover:text-ka-green-dark font-semibold block mb-2 text-sm"
                  >
                    info@kaspersadvies.nl
                  </a>
                  <p className="text-sm text-ka-gray-600">
                    Binnen 48u antwoord
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-ka-navy mb-6">
                    Stuur een Bericht
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="naam">Naam *</Label>
                        <Input 
                          id="naam"
                          value={formData.naam}
                          onChange={(e) => setFormData({...formData, naam: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefoon">Telefoon *</Label>
                        <Input 
                          id="telefoon"
                          type="tel"
                          value={formData.telefoon}
                          onChange={(e) => setFormData({...formData, telefoon: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bericht">Uw vraag of opmerking</Label>
                      <Textarea 
                        id="bericht"
                        value={formData.bericht}
                        onChange={(e) => setFormData({...formData, bericht: e.target.value})}
                        rows={6}
                        className="mt-2"
                        placeholder="Vertel ons waar we u mee kunnen helpen..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-ka-red hover:bg-ka-red-dark text-white"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Verstuur Bericht
                    </Button>

                    <p className="text-sm text-ka-gray-600 text-center">
                      * Verplichte velden. We nemen binnen 48 uur contact met u op.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Kantoor Info */}
        <section className="py-16 lg:py-24 bg-ka-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-ka-navy mb-12 text-center">
                Ons Kantoor
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-8">
                    <MapPin className="w-10 h-10 text-ka-green mb-4" />
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      Adres
                    </h3>
                    <p className="text-ka-gray-700 leading-relaxed">
                      Hoofdstraat 123<br />
                      9501 AA Stadskanaal<br />
                      Groningen
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <Clock className="w-10 h-10 text-ka-green mb-4" />
                    <h3 className="text-xl font-bold text-ka-navy mb-4">
                      Openingstijden
                    </h3>
                    <div className="space-y-2 text-ka-gray-700">
                      <div className="flex justify-between">
                        <span>Maandag - Vrijdag</span>
                        <span className="font-semibold">9:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zaterdag - Zondag</span>
                        <span>Gesloten</span>
                      </div>
                      <p className="text-sm text-ka-gray-600 mt-4">
                        * Ook buiten kantooruren bereikbaar voor noodgevallen
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8 bg-ka-green/5 border-ka-green">
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-ka-gray-700">
                    <strong>Ook aan huis:</strong> Binnen 50km komen we bij u langs. 
                    Groningen, Assen, Veendam, Hoogezand, Winschoten en Emmen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactKaspers;
