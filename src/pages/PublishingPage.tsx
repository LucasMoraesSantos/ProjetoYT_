export function PublishingPage() {
  return (
    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Publicação assistida</h2>
      <p className="mt-2 text-sm">Publicação automática requer OAuth do YouTube.</p>
      <p className="mt-1 text-sm text-slate-500">Liste produções video_ready, copie título, descrição e tags e publique manualmente no YouTube Studio.</p>
    </div>
  );
}
