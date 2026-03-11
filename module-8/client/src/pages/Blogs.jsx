import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../api/blogs';

const CATEGORIES = ['All Posts', 'Design', 'Development', 'Tutorials', 'Career'];

/**
 * Map blog titles/content to a simple category label for display.
 * In production this would come from the API.
 */
function guessCategory(blog, idx) {
  const cats = ['Development', 'Design', 'Career', 'Tutorial', 'Insight', 'Tutorial'];
  return cats[idx % cats.length];
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Posts');

  useEffect(() => {
    getAllBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex flex-col max-w-7xl mx-auto w-full px-6 md:px-20 py-12">
        {/* Page Heading */}
        <section className="flex flex-col gap-4 mb-12">
          <h1 className="text-slate-900 dark:text-white text-5xl font-black leading-tight tracking-tight">
            My Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Deep dives into software engineering, UI design systems, and the future of creative
            technology.
          </p>
        </section>

        {/* Category Nav */}
        <nav className="flex border-b border-slate-200 dark:border-primary/20 mb-10 overflow-x-auto">
          <div className="flex gap-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-4 font-medium text-sm uppercase tracking-wider transition-colors border-b-2 ${
                  activeCategory === cat
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        {loading && (
          <p className="text-slate-500 text-center py-20">Loading blogs…</p>
        )}
        {error && (
          <p className="text-red-500 text-center py-20">Failed to load blogs: {error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => {
              const category = guessCategory(blog, idx);
              const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <article
                  key={blog.id}
                  className="flex flex-col bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden group hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded tracking-widest">
                        {category}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">• {date}</span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {blog.content}
                    </p>
                    {blog.user && (
                      <p className="text-xs text-slate-400 mb-3">By {blog.user.name}</p>
                    )}
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="flex items-center gap-2 text-primary font-bold text-sm group/btn"
                    >
                      Read More
                      <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <p className="text-slate-500 text-center py-20">No blog posts found.</p>
        )}
      </main>
    </div>
  );
}
