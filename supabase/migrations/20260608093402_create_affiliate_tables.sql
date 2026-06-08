
-- Categories for organizing comparisons
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products/services being compared
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  description text,
  features text[] DEFAULT '{}',
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  price text,
  rating numeric(2,1) DEFAULT 0,
  affiliate_url text,
  logo_url text,
  badge text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Comparison pages (landing pages)
CREATE TABLE comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  subtitle text,
  intro text,
  conclusion text,
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Link comparisons to products with comparison-specific data
CREATE TABLE comparison_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES comparisons(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  rank int DEFAULT 0,
  verdict text,
  UNIQUE(comparison_id, product_id)
);

-- Newsletter signups
CREATE TABLE signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  source text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Categories: public read, admin write
CREATE POLICY "read_categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "auth_write_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: public read, admin write
CREATE POLICY "read_products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "auth_write_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Comparisons: public read, admin write
CREATE POLICY "read_comparisons" ON comparisons FOR SELECT TO anon USING (true);
CREATE POLICY "auth_write_comparisons" ON comparisons FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Comparison products: public read, admin write
CREATE POLICY "read_comparison_products" ON comparison_products FOR SELECT TO anon USING (true);
CREATE POLICY "auth_write_comparison_products" ON comparison_products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Signups: anyone can insert, no read/delete for anon
CREATE POLICY "insert_signups" ON signups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_read_signups" ON signups FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_manage_signups" ON signups FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_signups" ON signups FOR DELETE TO authenticated USING (true);

-- Seed some categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Webhosting', 'webhosting', 'Vergelijk de beste webhosting providers', 'Server', 1),
  ('VPN Diensten', 'vpn', 'Vergelijk de veiligste VPN diensten', 'Shield', 2),
  ('Website Builders', 'website-builders', 'Vergelijk de makkelijkste website builders', 'Layout', 3),
  ('E-mail Marketing', 'email-marketing', 'Vergelijk de beste e-mail marketing tools', 'Mail', 4),
  ('SEO Tools', 'seo-tools', 'Vergelijk de krachtigste SEO tools', 'Search', 5);

-- Seed some products
INSERT INTO products (name, slug, category_id, description, features, pros, cons, price, rating, affiliate_url, logo_url, badge, display_order) VALUES
  ('HostVista', 'hostvista', (SELECT id FROM categories WHERE slug='webhosting'), 'Snelle en betrouwbare webhosting met 99.9% uptime garantie.', ARRAY['Onbeperkt bandbreedte','Gratis SSL certificaat','24/7 Nederlandse support','1-klik installatie'], ARRAY['Zeer snelle servers','Uitstekende support','Goede prijs-kwaliteit'], ARRAY['Geen dedicated server optie','Beperkte VPS keuze'], '€4,99/maand', 4.5, 'https://example.com/hostvista', null, 'Beste Keuze', 1),
  ('CloudBase', 'cloudbase', (SELECT id FROM categories WHERE slug='webhosting'), 'Schaalbare cloud hosting voor groeiende bedrijven.', ARRAY['Auto-scaling','Gratis domein eerste jaar','CDN inbegrepen','Staging omgeving'], ARRAY['Zeer schaalbaar','Moderne interface','Goede CDN'], ARRAY['Prijs kan oplopen bij schaling','Compleet voor beginners'], '€7,99/maand', 4.0, 'https://example.com/cloudbase', null, null, 2),
  ('BudgetHost', 'budgethost', (SELECT id FROM categories WHERE slug='webhosting'), 'Goede hosting voor een scherpe prijs.', ARRAY['50GB opslag','Gratis SSL','E-mail hosting','cPanel'], ARRAY['Zeer voordelig','Eenvoudig in gebruik','Goede uptime'], ARRAY['Beperkte resources','Tragere support'], '€2,49/maand', 3.5, 'https://example.com/budgethost', null, 'Beste Prijs', 3),
  ('SecureVPN', 'securevpn', (SELECT id FROM categories WHERE slug='vpn'), 'Premium VPN met militaire encryptie en geen logs.', ARRAY['5000+ servers wereldwijd','Kill switch','Split tunneling','No-log beleid'], ARRAY['Sterke encryptie','Veel server locaties','Snelle verbinding'], ARRAY['Duurder dan gemiddeld','Beperkt tegelijk apparaten'], '€6,99/maand', 4.7, 'https://example.com/securevpn', null, 'Beste Keuze', 1),
  ('FastVPN', 'fastvpn', (SELECT id FROM categories WHERE slug='vpn'), 'De snelste VPN voor streaming en downloaden.', ARRAY['3000+ servers','Geen snelheidsbeperking','Streaming geoptimaliseerd','Apparaat-vriendelijk'], ARRAY['Supersnel','Goed voor streaming','Makkelijke app'], ARRAY['Minder server locaties','Zwakkere encryptie opties'], '€4,49/maand', 4.2, 'https://example.com/fastvpn', null, 'Snelste', 2),
  ('ShieldNet', 'shieldnet', (SELECT id FROM categories WHERE slug='vpn'), 'Betaalbare VPN met goede basisbeveiliging.', ARRAY['1500+ servers','Ad-blocker ingebouwd','Multi-hop','WiFi bescherming'], ARRAY['Voordelig','Ingebouwde ad-blocker','Goede basisfuncties'], ARRAY['Minder servers','Trager bij piekuren'], '€2,99/maand', 3.8, 'https://example.com/shieldnet', null, 'Beste Prijs', 3),
  ('SiteCraft', 'sitecraft', (SELECT id FROM categories WHERE slug='website-builders'), 'Intuïtieve website builder met drag-and-drop editor.', ARRAY['200+ templates','Drag & drop editor','Gratis plan beschikbaar','E-commerce ready'], ARRAY['Erg gebruiksvriendelijk','Mooie templates','Goed gratis plan'], ARRAY['Beperkte aanpassingen','Trage laadtijd bij veel content'], '€9,99/maand', 4.4, 'https://example.com/sitecraft', null, 'Beste Keuze', 1),
  ('PageForge', 'pageforge', (SELECT id FROM categories WHERE slug='website-builders'), 'Professionele website builder met geavanceerde functies.', ARRAY['Volledig aanpasbaar','Code export','Integraties','AI assistent'], ARRAY['Volledige controle','AI hulp','Exporteer code'], ARRAY['Leercurve','Duurder dan concurrenten'], '€14,99/maand', 4.1, 'https://example.com/pageforge', null, null, 2);

-- Seed a comparison page
INSERT INTO comparisons (title, slug, category_id, subtitle, intro, conclusion, featured, published) VALUES
  ('Beste Webhosting 2025', 'beste-webhosting-2025', (SELECT id FROM categories WHERE slug='webhosting'), 'Welke webhosting provider past het beste bij jou?', 'Een goede webhosting provider is essentieel voor het succes van je website. Snelheid, betrouwbaarheid en support maken het verschil. We hebben de top providers vergeleken op prijs, prestaties en klantenservice.', 'HostVista komt als beste uit de test dankzij de uitstekende combinatie van snelheid, support en prijs. Voor wie een budget optie zoekt is BudgetHost een uitstekende keuze.', true, true),
  ('Beste VPN Diensten 2025', 'beste-vpn-2025', (SELECT id FROM categories WHERE slug='vpn'), 'Bescherm je privacy met de beste VPN', 'Online privacy wordt steeds belangrijker. Een goede VPN beschermt je data en geeft je toegang tot wereldwijde content. We testen op snelheid, veiligheid en gebruiksgemak.', 'SecureVPN is onze topkeuze vanwege de sterke encryptie en uitgebreide servernetwerk. FastVPN is de beste keuze als snelheid je prioriteit is.', true, true),
  ('Beste Website Builders 2025', 'beste-website-builders-2025', (SELECT id FROM categories WHERE slug='website-builders'), 'Bouw je eigen website zonder code', 'Een website builder maakt het makkelijk om een professionele site te bouwen zonder programmeerkennis. We vergelijken de meest populaire opties.', 'SiteCraft is de meest gebruiksvriendelijke builder met prachtige templates. PageForge biedt meer controle voor wie dat wil.', true, true);

-- Link products to comparisons
INSERT INTO comparison_products (comparison_id, product_id, rank, verdict) VALUES
  ((SELECT id FROM comparisons WHERE slug='beste-webhosting-2025'), (SELECT id FROM products WHERE slug='hostvista'), 1, 'Beste algehele keuze - uitstekende balans tussen prijs en kwaliteit'),
  ((SELECT id FROM comparisons WHERE slug='beste-webhosting-2025'), (SELECT id FROM products WHERE slug='cloudbase'), 2, 'Goede keuze voor schaalbaarheid'),
  ((SELECT id FROM comparisons WHERE slug='beste-webhosting-2025'), (SELECT id FROM products WHERE slug='budgethost'), 3, 'Budget-vriendelijke optie'),
  ((SELECT id FROM comparisons WHERE slug='beste-vpn-2025'), (SELECT id FROM products WHERE slug='securevpn'), 1, 'Meest veilige VPN met uitstekende prestaties'),
  ((SELECT id FROM comparisons WHERE slug='beste-vpn-2025'), (SELECT id FROM products WHERE slug='fastvpn'), 2, 'Snelste VPN voor streaming'),
  ((SELECT id FROM comparisons WHERE slug='beste-vpn-2025'), (SELECT id FROM products WHERE slug='shieldnet'), 3, 'Goede basis VPN voor weinig'),
  ((SELECT id FROM comparisons WHERE slug='beste-website-builders-2025'), (SELECT id FROM products WHERE slug='sitecraft'), 1, 'Meest intuïtieve builder met prachtig resultaat'),
  ((SELECT id FROM comparisons WHERE slug='beste-website-builders-2025'), (SELECT id FROM products WHERE slug='pageforge'), 2, 'Voor wie meer controle wil');
