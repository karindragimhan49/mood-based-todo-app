const stackItems = [
  { icon: 'code', label: 'React', detail: 'Building dynamic, component-driven UIs.' },
  { icon: 'palette', label: 'Tailwind CSS', detail: 'Utility-first rapid styling.' },
  { icon: 'dns', label: 'Node.js', detail: 'Scalable server-side JavaScript.' },
  { icon: 'database', label: 'PostgreSQL', detail: 'Relational data at scale.' },
  { icon: 'terminal', label: 'TypeScript', detail: 'Type-safe JavaScript development.' },
  { icon: 'cloud', label: 'AWS', detail: 'Cloud infrastructure and deployments.' },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-16">
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
          Get to know me
        </span>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight mt-4">
          About <span className="text-primary">Me</span>
        </h1>
      </div>

      {/* Bio */}
      <div className="grid md:grid-cols-2 gap-16 mb-20">
        <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          <p>
            I am a passionate Full-Stack Software Engineer with expertise in building robust backends
            and responsive frontends. I love solving complex problems and staying up-to-date with
            the latest industry trends.
          </p>
          <p>
            With over 5 years of experience in the tech industry, I've worked with startups and
            established companies to deliver high-quality software solutions that drive real business
            growth.
          </p>
          <p>
            When I'm not coding, I write about software architecture on my blog, contribute to
            open-source projects, and mentor junior developers breaking into the industry.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { value: '5+', label: 'Years Experience' },
            { value: '30+', label: 'Projects Delivered' },
            { value: '10k+', label: 'Blog Readers' },
            { value: '15+', label: 'Happy Clients' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl p-6 text-center"
            >
              <p className="text-4xl font-black text-primary">{value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-primary rounded-full" />
          Tech Stack
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map(({ icon, label, detail }) => (
            <div
              key={label}
              className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl p-6 flex items-start gap-4 hover:border-primary transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
