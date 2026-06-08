import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server, Shield, Layout, Mail, Search, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';

const iconMap: Record<string, React.ElementType> = {
  Server,
  Shield,
  Layout,
  Mail,
  Search,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<(Category & { comparison_count: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (catData) {
        const withCounts = await Promise.all(
          catData.map(async (cat) => {
            const { count } = await supabase
              .from('comparisons')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', cat.id)
              .eq('published', true);
            return { ...cat, comparison_count: count || 0 };
          })
        );
        setCategories(withCounts);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Categorieen</h1>
          <p className="mt-2 text-gray-500">
            Blader door onze categorieen en vind de vergelijking die bij jou past
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-xl mb-4" />
                <div className="h-5 w-2/3 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Server;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-100/80 hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {cat.comparison_count} vergelijking{cat.comparison_count !== 1 ? 'en' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                      Bekijk <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
