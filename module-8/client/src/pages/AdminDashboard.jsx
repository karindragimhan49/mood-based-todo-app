import { useState } from 'react';

const DUMMY_BLOGS = [
  { id: 1, title: 'Mastering UI/UX Principles in 2024', tags: 'Design, Trends', author: 'Jane Cooper', status: 'Published', date: 'Oct 24, 2023' },
  { id: 2, title: 'Top 10 LLMs for Developers', tags: 'Technology, AI', author: 'Sam Wilson', status: 'Draft', date: 'Oct 22, 2023' },
  { id: 3, title: 'Building Scalable Microservices', tags: 'Backend, Architecture', author: 'Alex Rivera', status: 'Published', date: 'Oct 18, 2023' },
  { id: 4, title: 'The Future of Edge Computing', tags: 'Tech, Infrastructure', author: 'Morgan Lee', status: 'Archived', date: 'Oct 15, 2023' },
];

const DUMMY_USERS = [
  { id: 1, name: 'Jane Cooper', email: 'jane@example.com', role: 'Author', joined: 'Sep 1, 2023' },
  { id: 2, name: 'Sam Wilson', email: 'sam@example.com', role: 'Author', joined: 'Sep 15, 2023' },
  { id: 3, name: 'Alex Rivera', email: 'alex@example.com', role: 'Admin', joined: 'Aug 10, 2023' },
  { id: 4, name: 'Morgan Lee', email: 'morgan@example.com', role: 'Author', joined: 'Oct 1, 2023' },
];

const statusColors = {
  Published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Draft: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Archived: 'bg-slate-100 text-slate-800 dark:bg-primary/20 dark:text-slate-300',
};

const roleColors = {
  Admin: 'bg-primary/10 text-primary',
  Author: 'bg-slate-100 text-slate-700 dark:bg-primary/10 dark:text-slate-300',
};

const navItems = [
  { icon: 'description', label: 'Blogs', key: 'blogs' },
  { icon: 'group', label: 'Users', key: 'users' },
  { icon: 'analytics', label: 'Analytics', key: 'analytics' },
  { icon: 'settings', label: 'Settings', key: 'settings' },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('blogs');
  const [filter, setFilter] = useState('All Posts');

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-none">Blog Admin</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Management Portal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map(({ icon, label, key }) => (
              <button
                key={key}
                onClick={() => setActiveNav(key)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-left transition-colors ${
                  activeNav === key
                    ? 'bg-primary text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-primary/10">
            <div className="flex items-center gap-3 px-2">
              <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">person</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-semibold truncate">Alex Rivera</p>
                <p className="text-xs text-slate-500 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark px-8 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search posts, authors, or tags..."
              className="w-full bg-slate-100 dark:bg-primary/5 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-primary/20 mx-2" />
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create New</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-background-dark/50">
          <div className="max-w-7xl mx-auto">

            {/* ── Blogs Tab ── */}
            {activeNav === 'blogs' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Blog Posts</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                      Manage and publish your site's content
                    </p>
                  </div>
                  <div className="flex bg-white dark:bg-primary/5 p-1 rounded-lg border border-slate-200 dark:border-primary/20">
                    {['All Posts', 'Published', 'Drafts'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          filter === f
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/20">
                          {['Title', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                            <th
                              key={h}
                              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${h === 'Actions' ? 'text-right' : ''}`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                        {DUMMY_BLOGS.filter(
                          (b) =>
                            filter === 'All Posts' ||
                            (filter === 'Published' && b.status === 'Published') ||
                            (filter === 'Drafts' && b.status === 'Draft')
                        ).map((blog) => (
                          <tr
                            key={blog.id}
                            className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {blog.title}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {blog.tags}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-primary text-sm">
                                    person
                                  </span>
                                </div>
                                <span className="text-sm font-medium">{blog.author}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[blog.status]}`}
                              >
                                {blog.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                              {blog.date}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Showing 1 to {DUMMY_BLOGS.length} of {DUMMY_BLOGS.length} results
                    </p>
                    <div className="flex gap-2">
                      <button disabled className="px-3 py-1 text-sm border border-slate-200 dark:border-primary/20 rounded-lg disabled:opacity-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm border border-slate-200 dark:border-primary/20 rounded-lg bg-white dark:bg-primary/10 font-bold">
                        1
                      </button>
                      <button className="px-3 py-1 text-sm border border-slate-200 dark:border-primary/20 rounded-lg hover:bg-white dark:hover:bg-primary/10">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Users Tab ── */}
            {activeNav === 'users' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Users</h2>
                  <p className="text-slate-500 dark:text-slate-400">Manage registered authors and admins</p>
                </div>
                <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/20">
                        {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                      {DUMMY_USERS.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 group">
                          <td className="px-6 py-4 font-semibold">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{user.joined}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg" title="Edit">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg" title="Delete">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Analytics Tab ── */}
            {activeNav === 'analytics' && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">analytics</span>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Analytics coming soon</p>
              </div>
            )}

            {/* ── Settings Tab ── */}
            {activeNav === 'settings' && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">settings</span>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Settings coming soon</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
