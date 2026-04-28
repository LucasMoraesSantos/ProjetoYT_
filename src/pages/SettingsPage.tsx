export function SettingsPage() {
  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Configurações</h2>
      <p className="text-sm">Status das Functions: pronto para deploy.</p>
      <div className="flex gap-2">
        <button className="rounded bg-slate-700 px-3 py-2 text-white">Escanear tendências agora</button>
        <button className="rounded bg-slate-700 px-3 py-2 text-white">Sincronizar analytics agora</button>
        <button className="rounded bg-slate-700 px-3 py-2 text-white">Gerar insights agora</button>
      </div>
    </div>
  );
}
