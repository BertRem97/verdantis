import { Mail, Bell, Gift, TrendingUp } from 'lucide-react';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Bell className="w-3.5 h-3.5" />
              Nieuwsbrief
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Mis geen enkele{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                vergelijking
              </span>
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Schrijf je in voor onze nieuwsbrief en blijf op de hoogte van de nieuwste vergelijkingen, tips en exclusieve aanbiedingen. Gratis en zonder spam.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: TrendingUp,
                  title: 'Nieuwe vergelijkingen',
                  desc: 'Als eerste weten wanneer we een nieuwe vergelijking publiceren.',
                },
                {
                  icon: Gift,
                  title: 'Exclusieve aanbiedingen',
                  desc: 'Speciale kortingen en deals die alleen voor abonnees beschikbaar zijn.',
                },
                {
                  icon: Mail,
                  title: 'Maximaal 2x per maand',
                  desc: 'Geen dagelijkse spam, alleen relevante updates.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Inschrijven</h2>
            <p className="text-sm text-gray-500 mb-6">Vul je gegevens in en ontvang onze nieuwsbrief.</p>
            <SignupForm source="signup_page" variant="full" />
            <p className="mt-4 text-xs text-gray-400 text-center">
              We respecteren je privacy. Uitschrijven kan altijd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
