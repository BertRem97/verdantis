import { Link } from 'react-router-dom';
import { BarChart3, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Verdantis<span className="text-emerald-400"></span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Onafhankelijke vergelijkingen van de beste diensten en producten. Wij helpen jou de juiste keuze te maken.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categorieen</h4>
            <ul className="space-y-2.5">
              {['Webhosting', 'VPN Diensten', 'Website Builders', 'E-mail Marketing', 'SEO Tools'].map((c) => (
                <li key={c}>
                  <Link to="/categories" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Vergelijkingen</h4>
            <ul className="space-y-2.5">
              {['Beste Webhosting', 'Beste VPN Diensten', 'Beste Website Builders'].map((c) => (
                <li key={c}>
                  <Link to="/vergelijkingen" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Nieuwsbrief</h4>
            <p className="text-sm text-gray-400 mb-4">
              Ontvang de nieuwste vergelijkingen en tips in je inbox.
            </p>
            <Link
              to="/inschrijven"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all"
            >
              <Mail className="w-4 h-4" />
              Inschrijven
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Verdantis. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-gray-600">
            Affiliate disclaimer: Wij verdienen commissie bij aankoop via onze links. Dit beinvloedt niet onze beoordelingen.
          </p>
        </div>
      </div>
    </footer>
  );
}
