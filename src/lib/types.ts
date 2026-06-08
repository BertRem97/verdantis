export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  price: string;
  rating: number;
  affiliate_url: string;
  logo_url: string | null;
  badge: string | null;
  display_order: number;
}

export interface Comparison {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  subtitle: string;
  intro: string;
  conclusion: string;
  featured: boolean;
  published: boolean;
}

export interface ComparisonProduct {
  id: string;
  comparison_id: string;
  product_id: string;
  rank: number;
  verdict: string;
}

export interface ComparisonWithProducts extends Comparison {
  products: (ComparisonProduct & { product: Product })[];
  category: Category;
}
