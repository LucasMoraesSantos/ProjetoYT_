import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { StatCard } from '../components/StatCard';

const data = [
  { niche: 'Finanças', score: 84 },
  { niche: 'Mistério', score: 77 },
  { niche: 'Tech', score: 69 },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Total de canais" value={3} />
        <StatCard title="Roteiros criados" value={19} />
        <StatCard title="Produções em andamento" value={7} />
        <StatCard title="Vídeos publicados" value={12} />
        <StatCard title="Oportunidades encontradas" value={34} />
        <StatCard title="Próximos agendados" value={4} />
      </div>
      <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Top nichos por score</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="niche" />
              <YAxis />
              <Bar dataKey="score" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
