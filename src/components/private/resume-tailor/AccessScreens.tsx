import type { FormEvent } from 'react';

export function PrivateToolNotConfigured() {
  return (
    <main className="private-tailor-page min-h-screen bg-[#f6f4ef] p-6 text-[#171717]">
      <div className="mx-auto max-w-xl rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Private tool is not configured</h1>
        <p className="mt-2 text-sm text-[#666]">
          Set PRIVATE_RESUME_PASSWORD before using this page.
        </p>
      </div>
    </main>
  );
}

export function PrivatePasswordGate({
  password,
  error,
  isAuthenticating,
  onPasswordChange,
  onSubmit,
}: {
  password: string;
  error: string;
  isAuthenticating: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <main className="private-tailor-page grid min-h-screen place-items-center bg-[#f6f4ef] p-6 text-[#171717]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Private Resume Tailor</h1>
        <p className="mt-2 text-sm text-[#666]">Enter the private password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={event => onPasswordChange(event.target.value)}
          className="mt-5 h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-[#0a72ef]"
          autoComplete="current-password"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isAuthenticating}
          className="mt-5 h-11 w-full cursor-pointer rounded-md bg-[#171717] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAuthenticating ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </main>
  );
}
