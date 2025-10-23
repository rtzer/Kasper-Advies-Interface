import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X, Star, Clock, MapPin, Award, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const KaspersNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/over-kaspers-advies', label: 'Over Ons' },
    { 
      label: 'Diensten',
      submenu: [
        { path: '/diensten-mkb', label: 'MKB' },
        { path: '/diensten-zzp', label: 'ZZP' },
        { path: '/diensten-particulieren', label: 'Particulieren' },
      ]
    },
    { path: '/werkwijze', label: 'Werkwijze' },
    { path: '/werkgebied', label: 'Werkgebied' },
    { path: '/contact-kaspers', label: 'Contact' },
  ];

  return (
    <>
      {/* USP Top Bar */}
      <div className="bg-ka-green text-white py-2 text-xs sm:text-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-white" />
              <span className="font-medium">Trustoo 9,3</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>48-uurs reactie</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Ook aan huis</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>16+ jaar ervaring</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Geregistreerd Belastingadviseur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b-2 border-ka-green/20 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo */}
            <Link to="/kaspers-advies" className="flex items-center">
              <img 
                src="/src/assets/logo-kaspers-advies.jpg" 
                alt="Kaspers Advies - Belastingadviseur Stadskanaal" 
                className="h-10 lg:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                link.submenu ? (
                  <div key={index} className="relative group">
                    <button className="text-ka-navy hover:text-ka-green font-medium transition-colors py-2">
                      {link.label}
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-ka-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          className={`block px-4 py-3 text-sm hover:bg-ka-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            isActive(sublink.path) ? 'text-ka-green font-semibold' : 'text-ka-navy'
                          }`}
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-ka-green'
                        : 'text-ka-navy hover:text-ka-green'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}

              <Button 
                size="lg" 
                className="bg-ka-green hover:bg-ka-green-dark text-white font-semibold shadow-md hover:shadow-lg transition-all"
                asChild
              >
                <a href="tel:+31599123456">
                  <Phone className="mr-2 h-5 w-5" />
                  0599-123 456
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-ka-navy" />
              ) : (
                <Menu className="h-6 w-6 text-ka-navy" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-ka-gray-200">
              {navLinks.map((link, index) => (
                link.submenu ? (
                  <div key={index} className="mb-2">
                    <div className="px-4 py-2 text-ka-navy font-semibold text-sm">
                      {link.label}
                    </div>
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.path}
                        to={sublink.path}
                        className={`block px-8 py-2 text-sm ${
                          isActive(sublink.path)
                            ? 'text-ka-green font-semibold bg-ka-gray-50'
                            : 'text-ka-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 ${
                      isActive(link.path)
                        ? 'text-ka-green font-semibold bg-ka-gray-50'
                        : 'text-ka-navy'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              <div className="px-4 pt-4 border-t border-ka-gray-200 mt-4">
                <Button 
                  className="w-full bg-ka-green hover:bg-ka-green-dark text-white font-semibold"
                  asChild
                >
                  <a href="tel:+31599123456">
                    <Phone className="mr-2 h-4 w-4" />
                    Bel Direct: 0599-123 456
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default KaspersNavigation;
