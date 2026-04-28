import { useState } from 'react';
import { functionsClient } from '../lib/functions';
import { toast } from 'sonner';

export function TrendsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ topic: string; opportunityScore: number }>>([]);

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Escanear tendências</h2>
      <button
        className="rounded bg-indigo-600 px-4 py-2 text-white"
        onClick={async () => {
          setLoading(true);
          try {
            const data = await functionsClient.scanYoutubeTrends({
              niche: 'finance',
              language: 'pt',
              country: 'BR',
              keywords: ['investimentos', 'renda extra'],
              maxResults: 10,
            });
            setResults((data as { opportunities: Array<{ topic: string; opportunityScore: number }> }).opportunities ?? []);
            toast.success('Tendências escaneadas');
          } catch (error) {
            toast.error((error as Error).message);
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Escaneando...' : 'Escanear tendências'}
      </button>
      <div className="space-y-2">
        {results.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma oportunidade ainda.</p>
        ) : (
          results.map((item, index) => (
            <div key={`${item.topic}-${index}`} className="rounded border p-3">
              <p className="font-medium">{item.topic}</p>
              <p className="text-sm">Score: {item.opportunityScore.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
