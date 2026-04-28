export function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
