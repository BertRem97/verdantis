import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Comparison, Category } from '../lib/types';

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<(Comparison & { category: Category })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [compRes, catRes] = await Promise.all([
        supabase
          .from('comparisons')
          .select('*, category:categories(*)')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('display_order'),
      ]);
      if (compRes.data) setComparisons(compRes.data as (Comparison & { category: Category })[]);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeCategory === 'all'
      ? comparisons
      : comparisons.filter((c) => c.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Alle vergelijkingen</h1>
          <p className="mt-2 text-gray-500">
            Ontdek objectieve vergelijkingen van de beste diensten en producten
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Alles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
                <div className="h-5 w-3/4 bg-gray-100 rounded mb-3" />
                <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Geen vergelijkingen gevonden.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp) => (
              <Link
                key={comp.id}
                to={`/vergelijking/${comp.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="p-6">
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md mb-3">
                    {comp.category?.name}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {comp.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{comp.subtitle}</p>
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2">{comp.intro}</p>
                  <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    Lees vergelijking <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
