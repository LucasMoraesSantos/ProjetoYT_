import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-semibold">Editorial Automation App</h1>
        <p className="mb-4 text-sm text-slate-500">Faça login para acessar seu painel editorial.</p>
        <button
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white"
          onClick={async () => {
            await loginWithGoogle();
            navigate('/dashboard');
          }}
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
