import { LoginForm } from '../components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50/50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 shadow-sm ring-1 ring-orange-100">
            TasteGood Team
          </span>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Manage TasteGood with ease
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to track reservations, refresh menus, and support guests in seconds.
          </p>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/80 p-4 text-left shadow-sm ring-1 ring-orange-100">
              <p className="text-sm font-semibold text-amber-700">Reservation overview</p>
              <p className="text-sm text-muted-foreground">See booking status and special requests at a glance.</p>
            </div>
            <div className="rounded-xl bg-white/80 p-4 text-left shadow-sm ring-1 ring-orange-100">
              <p className="text-sm font-semibold text-amber-700">Menu control</p>
              <p className="text-sm text-muted-foreground">Update dishes and promos without interrupting service.</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <LoginForm className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}
