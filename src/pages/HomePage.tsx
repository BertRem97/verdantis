import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Server,
  Shield,
  Layout,
  Mail,
  Search,
  TrendingUp,
  CheckCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Comparison, Product } from '../lib/types';
import RatingStars from '../components/RatingStars';
import SignupForm from '../components/SignupForm';

const iconMap: Record<string, React.ElementType> = {
  Server,
  Shield,
  Layout,
  Mail,
  Search,
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [comparisons, setComparisons] = useState<(Comparison & { category: Category })[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const [catRes, compRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase
          .from('comparisons')
          .select('*, category:categories(*)')
          .eq('featured', true)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('products')
          .select('*')
          .eq('badge', 'Beste Keuze')
          .order('rating', { ascending: false })
          .limit(3),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (compRes.data) setComparisons(compRes.data as (Comparison & { category: Category })[]);
      if (prodRes.data) setTopProducts(prodRes.data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Onafhankelijke vergelijkingen
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Vind de beste{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                diensten
              </span>{' '}
              voor jouw behoeften
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Vergelijk providers op prijs, kwaliteit en prestaties. Wij helpen je met eerlijke, objectieve vergelijkingen zodat je de juiste keuze kunt maken.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/vergelijkingen"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200"
              >
                Bekijk vergelijkingen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Ontdek categorieen
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                100% gratis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Objectief
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Actueel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Verken categorieen</h2>
            <p className="mt-3 text-gray-500">Vergelijk de beste diensten per categorie</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Server;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group relative p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Comparisons */}
      {comparisons.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Populaire vergelijkingen</h2>
                <p className="mt-3 text-gray-500">Ontdek welke diensten het beste scoren</p>
              </div>
              <Link
                to="/vergelijkingen"
                className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                Alles bekijken <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {comparisons.map((comp) => (
                <Link
                  key={comp.id}
                  to={`/vergelijking/${comp.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300"
                >
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="p-6">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md mb-3">
                      {comp.category?.name}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {comp.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{comp.subtitle}</p>
                    <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                      Lees vergelijking <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Picks */}
      {topProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Onze beste keuzes</h2>
              <p className="mt-3 text-gray-500">De best scorende diensten per categorie</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300"
                >
                  {product.badge && (
                    <span className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
                      {product.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="mt-3">
                    <RatingStars rating={product.rating} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">{product.price}</span>
                    <a
                      href={product.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Bekijk aanbod
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Hoe werkt het?</h2>
            <p className="mt-3 text-gray-500">In drie stappen naar de beste keuze</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Search,
                title: 'Kies een categorie',
                desc: 'Blader door onze categorieen en vind het type dienst dat je zoekt.',
              },
              {
                step: '2',
                icon: TrendingUp,
                title: 'Vergelijk providers',
                desc: 'Lees onze objectieve vergelijkingen en bekijk de voor- en nadelen van elke provider.',
              },
              {
                step: '3',
                icon: Star,
                title: 'Maak je keuze',
                desc: 'Kies de provider die het beste past bij jouw behoeften en budget.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="w-8 h-8 mx-auto -mt-8 mb-4 bg-emerald-600 rounded-full text-white text-sm font-bold flex items-center justify-center ring-4 ring-gray-50">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Mis geen enkele vergelijking</h2>
          <p className="mt-3 text-emerald-100 max-w-lg mx-auto">
            Schrijf je in voor onze nieuwsbrief en ontvang de nieuwste vergelijkingen, tips en exclusieve aanbiedingen.
          </p>
          <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl p-6 shadow-2xl shadow-black/20">
            <SignupForm source="homepage_cta" variant="full" />
          </div>
        </div>
      </section>
    </div>
  );
}
