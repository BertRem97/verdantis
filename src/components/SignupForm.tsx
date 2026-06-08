import { useState } from 'react';
import { Mail, User, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignupFormProps {
  source?: string;
  variant?: 'full' | 'compact';
}

export default function SignupForm({ source = 'website', variant = 'full' }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('signups').insert({
      email: email.trim(),
      name: name.trim() || null,
      source,
    });

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('Dit e-mailadres is al ingeschreven.');
      } else {
        setErrorMsg('Er ging iets mis. Probeer het opnieuw.');
      }
      setStatus('error');
      return;
    }

    setStatus('success');
    setName('');
    setEmail('');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-emerald-800">Succesvol ingeschreven!</p>
          <p className="text-sm text-emerald-600">Je ontvangt binnenkort onze nieuwsbrief.</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Je e-mailadres"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Inschrijven...
            </>
          ) : (
            'Inschrijven'
          )}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-600 sm:col-span-2">{errorMsg}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Naam (optioneel)</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Je naam"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="je@email.nl"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Inschrijven...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Schrijf je in
          </>
        )}
      </button>
    </form>
  );
}
