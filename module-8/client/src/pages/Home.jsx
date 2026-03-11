import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../api/blogs';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAygHYt17Ypmk0UOVNauLtHpKn_Kcli24CC27U4Kh4ZTjsTkcgS1bBc0aTQCGcBqdQ--Z4q1yfL_w6xQ3b9Tn27klm0JzQiVQ-kbBa1Kv80I4o5vi14DrKK8mgPbzuvjxejHws2afZcMa-4IP14fuRCg6tJEdYZqYDRh4pA7kqA7Jbf6CBlukf3MGB2bmkV5mH4WH47rCW-vZIS4F7Crz-GcR13SmBbBZGsRORICqbkVw3lwkJfHPWlUAW79ujJ-CSh-zdQCcNd7GfU';

const stackItems = [
  { icon: 'code', label: 'React' },
  { icon: 'palette', label: 'Tailwind' },
  { icon: 'dns', label: 'Node.js' },
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'terminal', label: 'TypeScript' },
  { icon: 'cloud', label: 'AWS' },
];

const projects = [
  {
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization platform built with Next.js and D3.js.',
    tags: ['React', 'D3.js'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMztq01ufBrakWNCtdKymsphoGahNswdNLCrT40Q2mOVpXl-OZa1HfAPQu-usDn5tgN3NhtWIBmBvNu1wXGzkgdOKd3cUVT7t1CCeRHMhPxI8ZK_sEbz0VKpCdJzrEAfICCMtOmKl3kA_5eWcsoVzWG-vYVQ0iT1VK2DtMM1NM0Q04ucvc2Ji_K6zEM3uBrNmpK0qb8J4ShVF4nwg4SiNS5qjRtyGpsh-hHm7NI-VdlYFbtCyCCuJ8XcUsvFdi8lxnBFZd8FpLvLXy',
  },
  {
    title: 'E-Commerce App',
    description: 'Mobile-first shopping experience with Stripe integration.',
    tags: ['Node.js', 'Stripe'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcT18bWxWRlqqoBFhdw7vl9CX0mgiSTPIITiMAP4oqvErrRL23uHdg8bdnY8G9Gl-6tfLBIJ-CWwpUffWgb7F451D0RyPqIP7Ivhkh9hqAu4kC8fRdvDpnkDnwEGhK0uvdgKwoo_MaweJYm5lLi2RjV0JsmR9CQiEOqRBWXrSAPM6lsvh4SeapZAlWU9-AVxSWP3AIw6PX0XH9knaM2_GhaqoEYlH4LYWKM_LxCAosNnAikVUODWaMtgXNxaK1a9edTXbnXDmSThhc',
  },
  {
    title: 'Dev Flow Tool',
    description: 'Developer productivity tool for automating repetitive CLI tasks.',
    tags: ['Golang', 'CLI'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-t34FtFJSnd7BQopT040y4lL7pjZHbA0LXjSl_mfWNwvWU_xsx0joUg8NzwqrQlAjj_mWGqPvN0IxjPsmK2QsGMGqob20gzxJ6f3ykI8WYhqEiFKnLy_gCxmV-EqfSq8xfFdkFopXldhK1ljDVFgcLpdr7GeYW4aIDFy_k_SPojKueb0YPjoReIjctN0jSYM6cl3iC9qVQAmiSUglyf-dgh1XC8DnDGDPtMs4OlyDb0t0VUEoXr7dVocQkClwOUnukW69mjeoiVcN',
  },
];

function ProjectCard({ project }) {
  return (
    <div className="group bg-white dark:bg-primary/5 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all">
      <div
        className="aspect-video bg-slate-200 dark:bg-slate-800 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('${project.img}')` }}
      >
        <div className="w-full h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            to="/projects"
            className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {project.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{project.description}</p>
        <div className="flex gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs()
      .then((data) => setBlogs(data.slice(0, 2)))
      .catch(() => setBlogs([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* ── Hero ── */}
      <section className="py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center" id="home">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
              Available for new opportunities
            </span>
            <h1 className="text-slate-900 dark:text-slate-100 text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Hi, I'm a <span className="text-primary">Developer</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
              Building scalable web applications with modern technologies. Focused on clean code,
              performance, and user-centric design.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              View Projects{' '}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              to="/blogs"
              className="border border-slate-300 dark:border-primary/30 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-primary/10 h-12 px-8 rounded-lg font-bold transition-all"
            >
              Read Blog
            </Link>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div
            className="relative aspect-square w-full bg-slate-200 dark:bg-primary/10 rounded-xl overflow-hidden shadow-2xl bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMG}')` }}
          />
        </div>
      </section>

      {/* ── About & Skills ── */}
      <section
        className="py-20 border-t border-slate-200 dark:border-primary/10"
        id="about"
      >
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full" />
              About Me
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              <p>
                I am a passionate Full-Stack Software Engineer with expertise in building robust
                backends and responsive frontends. I love solving complex problems and staying
                up-to-date with the latest industry trends.
              </p>
              <p>
                With over 5 years of experience in the tech industry, I've worked with startups and
                established companies to deliver high-quality software solutions that drive business
                growth.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-sm">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {stackItems.map(({ icon, label }) => (
                <span
                  key={label}
                  className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section
        className="py-20 border-t border-slate-200 dark:border-primary/10"
        id="projects"
      >
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Featured Projects
            </h2>
            <p className="text-slate-500 mt-2">A selection of my recent work</p>
          </div>
          <Link
            to="/projects"
            className="text-primary font-bold flex items-center gap-1 hover:underline"
          >
            View all <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section
        className="py-20 border-t border-slate-200 dark:border-primary/10"
        id="blog"
      >
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              Latest Writing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              I share my thoughts on web development, software architecture, and the future of tech.
            </p>
            <Link
              to="/blogs"
              className="text-primary font-bold flex items-center gap-2 group"
            >
              Explore all articles{' '}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="md:w-2/3 space-y-6">
            {blogs.length === 0 ? (
              /* Fallback static entries */
              [
                {
                  id: null,
                  title: 'Mastering React Server Components',
                  content: 'Exploring the shift from client-side to server-side rendering in modern React apps.',
                  created_at: '2023-10-24',
                },
                {
                  id: null,
                  title: 'Clean Code in Node.js Applications',
                  content: 'Best practices for maintaining scalable and readable backend codebases.',
                  created_at: '2023-09-12',
                },
              ].map((b) => (
                <article
                  key={b.title}
                  className="p-6 rounded-xl border border-slate-200 dark:border-primary/10 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all flex flex-col md:flex-row md:items-center gap-6"
                >
                  <span className="text-slate-400 dark:text-slate-600 font-mono text-sm whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {b.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">{b.content}</p>
                  </div>
                </article>
              ))
            ) : (
              blogs.map((b) => (
                <Link
                  key={b.id}
                  to={`/blogs/${b.id}`}
                  className="block p-6 rounded-xl border border-slate-200 dark:border-primary/10 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <span className="text-slate-400 dark:text-slate-600 font-mono text-sm whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {b.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{b.content}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
