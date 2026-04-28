import { useAuth } from '../lib/auth';
import { uploadUserFile } from '../lib/storage';
import { toast } from 'sonner';

const statuses = [
  'idea_discovered',
  'idea_approved',
  'script_generating',
  'script_ready',
  'video_in_production',
  'video_ready',
  'youtube_uploading',
  'youtube_scheduled',
  'published',
  'failed',
];

export function ProductionsPage() {
  const { user } = useAuth();

  async function handleUpload(category: 'videos' | 'thumbnails', file?: File) {
    if (!file || !user) return;
    const result = await uploadUserFile(user.uid, category, file);
    toast.success(`Upload concluído: ${result.path}`);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        {statuses.map((status) => (
          <div key={status} className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
            <h3 className="mb-2 text-sm font-semibold">{status}</h3>
            <p className="text-xs text-slate-500">Arraste cards aqui (Kanban preparado).</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 rounded-xl bg-white p-4 shadow md:grid-cols-2 dark:bg-slate-900">
        <label className="rounded border p-3">
          Upload vídeo final
          <input type="file" className="mt-2 block" accept="video/*" onChange={(e) => void handleUpload('videos', e.target.files?.[0])} />
        </label>
        <label className="rounded border p-3">
          Upload thumbnail
          <input type="file" className="mt-2 block" accept="image/*" onChange={(e) => void handleUpload('thumbnails', e.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}
