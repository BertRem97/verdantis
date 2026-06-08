import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Comparison } from '../lib/types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;

      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!catData) {
        setLoading(false);
        return;
      }

      setCategory(catData);

      const { data: compData } = await supabase
        .from('comparisons')
        .select('*')
        .eq('category_id', catData.id)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (compData) setComparisons(compData);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Categorie niet gevonden</h2>
          <Link to="/categories" className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Terug naar categorieen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-gray-600 transition-colors">Categorieen</Link>
          <span>/</span>
          <span className="text-gray-700">{category.name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{category.name}</h1>
          <p className="mt-2 text-gray-500">{category.description}</p>
        </div>

        {comparisons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Nog geen vergelijkingen in deze categorie.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((comp) => (
              <Link
                key={comp.id}
                to={`/vergelijking/${comp.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="p-6">
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

        <div className="mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Alle categorieen
          </Link>
        </div>
      </div>
    </div>
  );
}
