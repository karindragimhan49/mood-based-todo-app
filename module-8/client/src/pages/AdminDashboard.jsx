import { useState, useEffect, useCallback } from 'react';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../api/blogs';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/users';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const statusColors = {
  Published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Draft: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Archived: 'bg-slate-100 text-slate-800 dark:bg-primary/20 dark:text-slate-300',
};

const navItems = [
  { icon: 'description', label: 'Blogs', key: 'blogs' },
  { icon: 'group', label: 'Users', key: 'users' },
  { icon: 'analytics', label: 'Analytics', key: 'analytics' },
  { icon: 'settings', label: 'Settings', key: 'settings' },
];

const EMPTY_BLOG = { title: '', content: '', user_id: '' };
const EMPTY_USER = { name: '', email: '' };

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Modal wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-primary/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Confirm Delete Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-semibold">{message}</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Input helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-400';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN COMPONENT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('blogs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* â”€â”€ Blogs state â”€â”€ */
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(null);
  const [blogFilter, setBlogFilter] = useState('All Posts');
  const [blogSearch, setBlogSearch] = useState('');

  /* â”€â”€ Users state â”€â”€ */
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [userSearch, setUserSearch] = useState('');

  /* â”€â”€ Modal state â”€â”€ */
  const [blogModal, setBlogModal] = useState(null);   // null | 'create' | { id, title, content }
  const [userModal, setUserModal] = useState(null);   // null | 'create' | { id, name, email }
  const [deleteTarget, setDeleteTarget] = useState(null); // null | { type, id, label }
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  /* â”€â”€ Blog form â”€â”€ */
  const [blogForm, setBlogForm] = useState(EMPTY_BLOG);
  /* â”€â”€ User form â”€â”€ */
  const [userForm, setUserForm] = useState(EMPTY_USER);

  /* â”€â”€ Toast â”€â”€ */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* â”€â”€ Fetch blogs â”€â”€ */
  const fetchBlogs = useCallback(() => {
    setBlogsLoading(true);
    getAllBlogs()
      .then((data) => { setBlogs(data); setBlogsLoading(false); })
      .catch((err) => { setBlogsError(err.message); setBlogsLoading(false); });
  }, []);

  /* â”€â”€ Fetch users â”€â”€ */
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    getAllUsers()
      .then((data) => { setUsers(data); setUsersLoading(false); })
      .catch((err) => { setUsersError(err.message); setUsersLoading(false); });
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* â”€â”€â”€ Blog CRUD â”€â”€â”€ */
  const openCreateBlog = () => {
    setBlogForm({ ...EMPTY_BLOG });
    setFormError('');
    setBlogModal('create');
  };
  const openEditBlog = (blog) => {
    setBlogForm({ title: blog.title, content: blog.content || '', user_id: blog.user_id || '' });
    setFormError('');
    setBlogModal({ id: blog.id });
  };
  const handleSaveBlog = async () => {
    if (!blogForm.title.trim()) return setFormError('Title is required.');
    if (!blogForm.content.trim()) return setFormError('Content is required.');
    if (blogModal === 'create' && !blogForm.user_id) return setFormError('User ID is required.');
    setSaving(true);
    setFormError('');
    try {
      if (blogModal === 'create') {
        await createBlog({ title: blogForm.title.trim(), content: blogForm.content.trim(), user_id: Number(blogForm.user_id) });
        showToast('Blog created successfully!');
      } else {
        await updateBlog(blogModal.id, { title: blogForm.title.trim(), content: blogForm.content.trim() });
        showToast('Blog updated successfully!');
      }
      setBlogModal(null);
      fetchBlogs();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  /* â”€â”€â”€ User CRUD â”€â”€â”€ */
  const openCreateUser = () => {
    setUserForm({ ...EMPTY_USER });
    setFormError('');
    setUserModal('create');
  };
  const openEditUser = (user) => {
    setUserForm({ name: user.name, email: user.email });
    setFormError('');
    setUserModal({ id: user.id });
  };
  const handleSaveUser = async () => {
    if (!userForm.name.trim()) return setFormError('Name is required.');
    if (!userForm.email.trim()) return setFormError('Email is required.');
    setSaving(true);
    setFormError('');
    try {
      if (userModal === 'create') {
        await createUser({ name: userForm.name.trim(), email: userForm.email.trim() });
        showToast('User added successfully!');
      } else {
        await updateUser(userModal.id, { name: userForm.name.trim(), email: userForm.email.trim() });
        showToast('User updated successfully!');
      }
      setUserModal(null);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  /* â”€â”€â”€ Delete â”€â”€â”€ */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'blog') {
        await deleteBlog(deleteTarget.id);
        fetchBlogs();
        showToast('Blog deleted.');
      } else {
        await deleteUser(deleteTarget.id);
        fetchUsers();
        showToast('User deleted.');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  /* â”€â”€â”€ Filtered data â”€â”€â”€ */
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      !blogSearch ||
      b.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.author_name?.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesFilter =
      blogFilter === 'All Posts' ||
      (blogFilter === 'Published' && !b.draft) ||
      (blogFilter === 'Drafts' && b.draft);
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  /* â”€â”€â”€ "Create New" handler â”€â”€â”€ */
  const handleCreateNew = () => {
    if (activeNav === 'blogs') openCreateBlog();
    else if (activeNav === 'users') openCreateUser();
  };

  /* â”€â”€â”€ Header search value â”€â”€â”€ */
  const headerSearch = activeNav === 'blogs' ? blogSearch : userSearch;
  const setHeaderSearch = activeNav === 'blogs' ? setBlogSearch : setUserSearch;

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â• RENDER â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">

      {/* â”€â”€ Mobile overlay â”€â”€ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* â”€â”€ Sidebar â”€â”€ */}
      <aside
        className={`fixed md:relative z-40 h-full flex-shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col transition-transform duration-300 w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-bold leading-none truncate">Blog Admin</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Management Portal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 flex-1">
            {navItems.map(({ icon, label, key }) => (
              <button
                key={key}
                onClick={() => { setActiveNav(key); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-left transition-colors w-full ${
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

          <div className="mt-auto pt-5 border-t border-slate-200 dark:border-primary/10">
            <div className="flex items-center gap-3 px-2">
              <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
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

      {/* â”€â”€ Main â”€â”€ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark px-4 md:px-6 flex items-center gap-3 justify-between flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/10"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder={activeNav === 'blogs' ? 'Search posts, authors...' : 'Search users...'}
              className="w-full bg-slate-100 dark:bg-primary/5 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {(activeNav === 'blogs' || activeNav === 'users') && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="hidden sm:inline">Create New</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-background-dark/50">
          <div className="max-w-7xl mx-auto">

            {/* â”€â”€ BLOGS TAB â”€â”€ */}
            {activeNav === 'blogs' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">Blog Posts</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and publish your site's content</p>
                  </div>
                  <div className="flex bg-white dark:bg-primary/5 p-1 rounded-lg border border-slate-200 dark:border-primary/20 self-start sm:self-auto">
                    {['All Posts', 'Published', 'Drafts'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setBlogFilter(f)}
                        className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${
                          blogFilter === f
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {blogsError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {blogsError} â€” make sure the backend server is running.
                  </div>
                )}

                <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  {blogsLoading ? (
                    <div className="p-12 flex items-center justify-center gap-3 text-slate-400">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Loading blogs...
                    </div>
                  ) : filteredBlogs.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-5xl">description</span>
                      <p>No blogs found.</p>
                      <button onClick={openCreateBlog} className="text-primary font-semibold text-sm hover:underline">
                        Create your first blog
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/20">
                              {['Title', 'Author', 'Status', 'Date', 'Actions'].map((h) => (
                                <th
                                  key={h}
                                  className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${h === 'Actions' ? 'text-right' : ''}`}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                            {filteredBlogs.map((blog) => (
                              <tr key={blog.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                                <td className="px-5 py-4 max-w-xs">
                                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{blog.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5 truncate">ID: {blog.id}</p>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[120px]">
                                      {blog.author_name || `User #${blog.user_id}`}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors['Published']}`}>
                                    Published
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                                  {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'â€”'}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => openEditBlog(blog)}
                                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                      onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, label: blog.title })}
                                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="md:hidden divide-y divide-slate-100 dark:divide-primary/10">
                        {filteredBlogs.map((blog) => (
                          <div key={blog.id} className="p-4 flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">{blog.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {blog.author_name || `User #${blog.user_id}`} Â· {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'â€”'}
                                </p>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusColors['Published']}`}>
                                Published
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditBlog(blog)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'blog', id: blog.id, label: blog.title })}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Pagination footer */}
                  {!blogsLoading && filteredBlogs.length > 0 && (
                    <div className="px-5 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between flex-wrap gap-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing {filteredBlogs.length} of {blogs.length} posts
                      </p>
                      <button
                        onClick={fetchBlogs}
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* â”€â”€ USERS TAB â”€â”€ */}
            {activeNav === 'users' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">Users</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Manage registered authors and admins</p>
                </div>

                {usersError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {usersError} â€” make sure the backend server is running.
                  </div>
                )}

                <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  {usersLoading ? (
                    <div className="p-12 flex items-center justify-center gap-3 text-slate-400">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Loading users...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-5xl">group</span>
                      <p>No users found.</p>
                      <button onClick={openCreateUser} className="text-primary font-semibold text-sm hover:underline">
                        Add the first user
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/20">
                              {['Name', 'Email', 'Joined', 'Actions'].map((h) => (
                                <th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'â€”'}
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openEditUser(user)}
                                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                      onClick={() => setDeleteTarget({ type: 'user', id: user.id, label: user.name })}
                                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="md:hidden divide-y divide-slate-100 dark:divide-primary/10">
                        {filteredUsers.map((user) => (
                          <div key={user.id} className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary">person</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditUser(user)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'user', id: user.id, label: user.name })}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {!usersLoading && filteredUsers.length > 0 && (
                    <div className="px-5 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between flex-wrap gap-2">
                      <p className="text-sm text-slate-500">Showing {filteredUsers.length} of {users.length} users</p>
                      <button onClick={fetchUsers} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                        <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* â”€â”€ ANALYTICS TAB â”€â”€ */}
            {activeNav === 'analytics' && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                <span className="material-symbols-outlined text-6xl">analytics</span>
                <p className="text-lg font-medium">Analytics coming soon</p>
              </div>
            )}

            {/* â”€â”€ SETTINGS TAB â”€â”€ */}
            {activeNav === 'settings' && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                <span className="material-symbols-outlined text-6xl">settings</span>
                <p className="text-lg font-medium">Settings coming soon</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* â•â•â•â• BLOG MODAL â•â•â•â• */}
      {blogModal && (
        <Modal
          title={blogModal === 'create' ? 'Create New Blog' : 'Edit Blog'}
          onClose={() => setBlogModal(null)}
        >
          <div className="flex flex-col gap-4">
            <Field label="Title">
              <input
                type="text"
                className={inputCls}
                placeholder="Blog post title"
                value={blogForm.title}
                onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <Field label="Content">
              <textarea
                className={inputCls}
                rows={5}
                placeholder="Write your blog content here..."
                value={blogForm.content}
                onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>
            {blogModal === 'create' && (
              <Field label="User ID (Author)">
                <select
                  className={inputCls}
                  value={blogForm.user_id}
                  onChange={(e) => setBlogForm((f) => ({ ...f, user_id: e.target.value }))}
                >
                  <option value="">â€” Select an author â€”</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} (ID: {u.id})</option>
                  ))}
                </select>
              </Field>
            )}
            {formError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> {formError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBlogModal(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-primary/20 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                {blogModal === 'create' ? 'Create Blog' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* â•â•â•â• USER MODAL â•â•â•â• */}
      {userModal && (
        <Modal
          title={userModal === 'create' ? 'Add New User' : 'Edit User'}
          onClose={() => setUserModal(null)}
        >
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <input
                type="text"
                className={inputCls}
                placeholder="Full name"
                value={userForm.name}
                onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={inputCls}
                placeholder="email@example.com"
                value={userForm.email}
                onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            {formError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> {formError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setUserModal(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-primary/20 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                {userModal === 'create' ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* â•â•â•â• DELETE CONFIRM â•â•â•â• */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.label}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* â•â•â•â• TOAST â•â•â•â• */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
