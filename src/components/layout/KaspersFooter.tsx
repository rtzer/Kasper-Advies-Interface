import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const KaspersFooter = () => {
  return (
    <footer className="bg-ka-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Bedrijfsinfo */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-ka-green">Kaspers Advies</h3>
            <p className="text-ka-gray-200 mb-4">
              Uw betrouwbare belastingadviseur in Stadskanaal en omgeving sinds 2009.
            </p>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <span className="text-lg font-semibold">⭐ Trustoo 9,3</span>
            </div>
            <p className="text-sm text-ka-gray-300">
              Geregistreerd Belastingadviseur
            </p>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Diensten</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/diensten-mkb" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Voor MKB
                </Link>
              </li>
              <li>
                <Link 
                  to="/diensten-zzp" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Voor ZZP-ers
                </Link>
              </li>
              <li>
                <Link 
                  to="/diensten-particulieren" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Voor Particulieren
                </Link>
              </li>
              <li>
                <Link 
                  to="/werkwijze" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Werkwijze
                </Link>
              </li>
            </ul>
          </div>

          {/* Over & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Over Ons</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/over-kaspers-advies" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Over Kaspers Advies
                </Link>
              </li>
              <li>
                <Link 
                  to="/werkgebied" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Werkgebied
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact-kaspers" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  Privacy & AVG
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                <div>
                  <a 
                    href="tel:+31599123456" 
                    className="text-ka-gray-200 hover:text-ka-green transition-colors"
                  >
                    0599-123 456
                  </a>
                  <p className="text-sm text-ka-gray-300">Ma-Vr 9:00-17:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                <a 
                  href="mailto:info@kaspersadvies.nl" 
                  className="text-ka-gray-200 hover:text-ka-green transition-colors"
                >
                  info@kaspersadvies.nl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                <div className="text-ka-gray-200">
                  <p>Hoofdstraat 123</p>
                  <p>9501 AA Stadskanaal</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-ka-green shrink-0 mt-0.5" />
                <div className="text-ka-gray-200">
                  <p className="font-semibold text-ka-green">48-uurs reactiegarantie</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ka-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-ka-gray-300">
              © {new Date().getFullYear()} Kaspers Advies. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link 
                to="/algemene-voorwaarden" 
                className="text-sm text-ka-gray-300 hover:text-ka-green transition-colors"
              >
                Algemene Voorwaarden
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-ka-gray-300 hover:text-ka-green transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default KaspersFooter;
