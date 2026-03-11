import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-primary/5 border-t border-slate-200 dark:border-primary/10 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Left — tagline + socials */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Let's build something <span className="text-primary">together</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Looking for a dedicated developer to join your team or have a project in mind? Reach out
            and let's discuss!
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:hello@devportfolio.dev"
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-xl">alternate_email</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
          </div>
        </div>

        {/* Right — quick contact form */}
        <div className="bg-white dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-primary/20 shadow-xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-slate-50 dark:bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 dark:bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="How can I help you?"
                className="w-full bg-slate-50 dark:bg-primary/10 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} DevPortfolio. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
