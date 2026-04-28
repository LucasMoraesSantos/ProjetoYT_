import { toast } from 'sonner';
import { functionsClient } from '../lib/functions';

export function ScriptsPage() {
  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Roteiros com IA</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white"
          onClick={async () => {
            try {
              await functionsClient.generateScript({ channelId: 'demo', topic: 'Tema de exemplo', targetDurationMinutes: 8 });
              toast.success('Roteiro solicitado.');
            } catch (error) {
              toast.error((error as Error).message);
            }
          }}
        >
          Gerar roteiro
        </button>
        <button
          className="rounded bg-slate-700 px-4 py-2 text-white"
          onClick={async () => {
            try {
              await functionsClient.reviewScript({ scriptId: 'demo-script' });
              toast.success('Revisão solicitada.');
            } catch (error) {
              toast.error((error as Error).message);
            }
          }}
        >
          Revisar roteiro
        </button>
      </div>
      <p className="text-sm text-slate-500">Editor, geração de títulos, descrição, tags e capítulos preparados para integração completa.</p>
    </div>
  );
}
