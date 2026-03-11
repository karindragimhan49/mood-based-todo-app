const projects = [
  {
    title: 'Analytics Dashboard',
    description:
      'Real-time data visualization platform featuring interactive D3.js charts, live WebSocket feeds, and role-based access control built with Next.js.',
    tags: ['React', 'D3.js', 'WebSockets', 'Next.js'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMztq01ufBrakWNCtdKymsphoGahNswdNLCrT40Q2mOVpXl-OZa1HfAPQu-usDn5tgN3NhtWIBmBvNu1wXGzkgdOKd3cUVT7t1CCeRHMhPxI8ZK_sEbz0VKpCdJzrEAfICCMtOmKl3kA_5eWcsoVzWG-vYVQ0iT1VK2DtMM1NM0Q04ucvc2Ji_K6zEM3uBrNmpK0qb8J4ShVF4nwg4SiNS5qjRtyGpsh-hHm7NI-VdlYFbtCyCCuJ8XcUsvFdi8lxnBFZd8FpLvLXy',
    link: '#',
  },
  {
    title: 'E-Commerce App',
    description:
      'Mobile-first shopping experience with Stripe payment integration, product search, cart management, and order tracking.',
    tags: ['Node.js', 'Stripe', 'MongoDB', 'React Native'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcT18bWxWRlqqoBFhdw7vl9CX0mgiSTPIITiMAP4oqvErrRL23uHdg8bdnY8G9Gl-6tfLBIJ-CWwpUffWgb7F451D0RyPqIP7Ivhkh9hqAu4kC8fRdvDpnkDnwEGhK0uvdgKwoo_MaweJYm5lLi2RjV0JsmR9CQiEOqRBWXrSAPM6lsvh4SeapZAlWU9-AVxSWP3AIw6PX0XH9knaM2_GhaqoEYlH4LYWKM_LxCAosNnAikVUODWaMtgXNxaK1a9edTXbnXDmSThhc',
    link: '#',
  },
  {
    title: 'Dev Flow Tool',
    description:
      'Developer productivity CLI tool for automating repetitive tasks — scaffolding, linting, deployment pipelines, and more.',
    tags: ['Golang', 'CLI', 'Docker', 'CI/CD'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-t34FtFJSnd7BQopT040y4lL7pjZHbA0LXjSl_mfWNwvWU_xsx0joUg8NzwqrQlAjj_mWGqPvN0IxjPsmK2QsGMGqob20gzxJ6f3ykI8WYhqEiFKnLy_gCxmV-EqfSq8xfFdkFopXldhK1ljDVFgcLpdr7GeYW4aIDFy_k_SPojKueb0YPjoReIjctN0jSYM6cl3iC9qVQAmiSUglyf-dgh1XC8DnDGDPtMs4OlyDb0t0VUEoXr7dVocQkClwOUnukW69mjeoiVcN',
    link: '#',
  },
  {
    title: 'Portfolio CMS',
    description:
      'Headless CMS for managing portfolio content — projects, blogs, and media — with a React admin interface and REST API.',
    tags: ['Express', 'PostgreSQL', 'React', 'AWS S3'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygHYt17Ypmk0UOVNauLtHpKn_Kcli24CC27U4Kh4ZTjsTkcgS1bBc0aTQCGcBqdQ--Z4q1yfL_w6xQ3b9Tn27klm0JzQiVQ-kbBa1Kv80I4o5vi14DrKK8mgPbzuvjxejHws2afZcMa-4IP14fuRCg6tJEdYZqYDRh4pA7kqA7Jbf6CBlukf3MGB2bmkV5mH4WH47rCW-vZIS4F7Crz-GcR13SmBbBZGsRORICqbkVw3lwkJfHPWlUAW79ujJ-CSh-zdQCcNd7GfU',
    link: '#',
  },
];

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-16">
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
          What I've built
        </span>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight mt-4">
          My <span className="text-primary">Projects</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 max-w-2xl">
          A selection of real-world applications I've designed and developed from scratch.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group bg-white dark:bg-primary/5 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary transition-all shadow-sm"
          >
            <div
              className="aspect-video bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url('${project.img}')` }}
            >
              <div className="w-full h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={project.link}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-lg"
                >
                  View Project
                </a>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {project.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold uppercase tracking-wide text-primary bg-primary/10 px-3 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
