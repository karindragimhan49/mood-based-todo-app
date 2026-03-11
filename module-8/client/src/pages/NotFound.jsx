import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-6 text-center">
      <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-5xl">error</span>
      </div>
      <div>
        <h1 className="text-8xl font-black text-primary">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
      >
        <span className="material-symbols-outlined text-base">home</span>
        Back to Home
      </Link>
    </div>
  );
}
