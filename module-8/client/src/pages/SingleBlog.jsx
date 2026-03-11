import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogById } from '../api/blogs';

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlogById(id)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-lg">Loading…</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <p className="text-red-500 text-lg">{error || 'Blog post not found.'}</p>
        <Link to="/blogs" className="text-primary font-bold hover:underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const date = new Date(blog.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 pt-8">
          {/* Back button */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/blogs"
              className="flex items-center gap-2 text-primary font-semibold hover:underline group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back to Blogs
            </Link>
          </div>

          {/* Article header */}
          <div className="mb-10">
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                Blog Post
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight mb-8">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-200 dark:border-primary/10">
              {blog.user && (
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      {blog.user.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{date}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">schedule</span>
                  <span className="text-sm font-medium">
                    {Math.max(1, Math.ceil(blog.content?.split(' ').length / 200))} min read
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article content */}
          <article className="prose prose-slate dark:prose-invert max-w-none mb-16">
            {blog.content?.split('\n').map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-lg text-slate-800 dark:text-slate-200">
                  {paragraph}
                </p>
              ) : null
            )}
          </article>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-12 pb-12 border-b border-slate-200 dark:border-primary/10">
            {['#WebDev', '#Programming', '#Tech'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-slate-200 dark:bg-primary/5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 md:p-12 mb-20 text-center border border-primary/20">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Want more insights?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Explore more articles on software engineering, design, and the future of tech.
            </p>
            <Link
              to="/blogs"
              className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
