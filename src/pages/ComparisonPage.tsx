import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Trophy,
  Award,
  Medal,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ComparisonWithProducts, Product } from '../lib/types';
import RatingStars from '../components/RatingStars';
import SignupForm from '../components/SignupForm';

const rankIcons: Record<number, React.ElementType> = {
  1: Trophy,
  2: Award,
  3: Medal,
};

const rankLabels: Record<number, string> = {
  1: '1e plaats',
  2: '2e plaats',
  3: '3e plaats',
};

const rankStyles: Record<number, string> = {
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-gray-50 border-gray-200',
  3: 'bg-orange-50 border-orange-200',
};

const rankBadgeStyles: Record<number, string> = {
  1: 'bg-amber-500 text-white',
  2: 'bg-gray-400 text-white',
  3: 'bg-orange-400 text-white',
};

export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [comparison, setComparison] = useState<ComparisonWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;

      const { data: compData } = await supabase
        .from('comparisons')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!compData) {
        setLoading(false);
        return;
      }

      const { data: cpData } = await supabase
        .from('comparison_products')
        .select('*, product:products(*)')
        .eq('comparison_id', compData.id)
        .order('rank');

      setComparison({
        ...compData,
        products: (cpData || []) as (ComparisonWithProducts['products'][number])[],
      } as ComparisonWithProducts);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Vergelijking niet gevonden</h2>
          <p className="mt-2 text-gray-500">Deze vergelijking bestaat niet of is niet gepubliceerd.</p>
          <Link
            to="/vergelijkingen"
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Terug naar vergelijkingen
          </Link>
        </div>
      </div>
    );
  }

  const rankedProducts = comparison.products
    .filter((cp) => cp.product)
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/vergelijkingen" className="hover:text-gray-600 transition-colors">Vergelijkingen</Link>
          <span>/</span>
          <span className="text-gray-700">{comparison.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md mb-3">
            {comparison.category?.name}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {comparison.title}
          </h1>
          <p className="mt-3 text-lg text-gray-500">{comparison.subtitle}</p>
        </header>

        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">{comparison.intro}</p>
        </div>

        {/* Product Cards */}
        <div className="space-y-6">
          {rankedProducts.map((cp) => {
            const product = cp.product as Product;
            const RankIcon = rankIcons[cp.rank] || Medal;

            return (
              <div
                key={cp.id}
                className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${rankStyles[cp.rank] || 'border-gray-100'}`}
              >
                {/* Rank badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${rankBadgeStyles[cp.rank] || 'bg-gray-300 text-gray-700'}`}
                  >
                    <RankIcon className="w-3.5 h-3.5" />
                    {rankLabels[cp.rank] || `${cp.rank}e plaats`}
                  </span>
                  {product.badge && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                      <p className="mt-2 text-gray-500">{product.description}</p>
                      <div className="mt-3">
                        <RatingStars rating={product.rating} />
                      </div>
                      {cp.verdict && (
                        <div className="mt-4 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <p className="text-sm text-emerald-800 font-medium">
                            <Trophy className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                            {cp.verdict}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="lg:w-80 flex-shrink-0 space-y-5">
                      {/* Features */}
                      {product.features.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kenmerken</h4>
                          <ul className="space-y-1.5">
                            {product.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pros / Cons */}
                      <div className="grid grid-cols-2 gap-4">
                        {product.pros.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Voordelen</h4>
                            <ul className="space-y-1.5">
                              {product.pros.map((p, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm text-gray-600">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.cons.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nadelen</h4>
                            <ul className="space-y-1.5">
                              {product.cons.map((c, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-sm text-gray-600">
                                  <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        </div>
                        <a
                          href={product.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                            cp.rank === 1
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          Bekijk aanbod <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conclusion */}
        {comparison.conclusion && (
          <div className="mt-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Conclusie</h2>
            <p className="text-gray-600 leading-relaxed">{comparison.conclusion}</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold text-gray-900">Blijf op de hoogte</h3>
            <p className="mt-2 text-sm text-gray-500">
              Ontvang nieuwe vergelijkingen en exclusieve aanbiedingen in je inbox.
            </p>
            <div className="mt-6">
              <SignupForm source={`comparison_${slug}`} variant="compact" />
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            to="/vergelijkingen"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Alle vergelijkingen
          </Link>
        </div>
      </div>
    </div>
  );
}
