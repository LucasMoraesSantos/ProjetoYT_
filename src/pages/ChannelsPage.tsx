import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChannel, deleteChannel, listChannels } from '../lib/firestore';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';
import { Channel } from '../types';

const schema = z.object({
  name: z.string().min(2),
  niche: z.string().min(2),
  language: z.string().min(2),
  countryTarget: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export function ChannelsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Channel[]>([]);
  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function load() {
    if (!user) return;
    setItems(await listChannels(user.uid));
  }

  useEffect(() => {
    void load();
  }, [user]);

  return (
    <div className="space-y-6">
      <form
        className="grid gap-3 rounded-xl bg-white p-4 shadow md:grid-cols-4 dark:bg-slate-900"
        onSubmit={handleSubmit(async (values) => {
          if (!user) return;
          await createChannel(user.uid, values);
          toast.success('Canal criado com sucesso');
          reset();
          await load();
        })}
      >
        <input className="rounded border p-2" placeholder="Nome" {...register('name')} />
        <input className="rounded border p-2" placeholder="Nicho" {...register('niche')} />
        <input className="rounded border p-2" placeholder="Idioma" {...register('language')} />
        <input className="rounded border p-2" placeholder="País" {...register('countryTarget')} />
        <button className="rounded bg-indigo-600 px-4 py-2 text-white md:col-span-4">Criar canal</button>
      </form>
      <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
        <h2 className="mb-3 font-semibold">Canais</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-500">{item.niche} • {item.language} • {item.countryTarget}</p>
              </div>
              <button
                className="rounded bg-rose-500 px-3 py-1 text-white"
                onClick={async () => {
                  if (!confirm('Tem certeza que deseja excluir?')) return;
                  await deleteChannel(item.id);
                  toast.success('Canal excluído');
                  await load();
                }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
