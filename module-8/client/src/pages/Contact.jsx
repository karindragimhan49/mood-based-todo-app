import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd POST to your API here.
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-16">
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
          Let's connect
        </span>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight mt-4">
          Contact <span className="text-primary">Me</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left — contact details */}
        <div className="space-y-8">
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox
            is always open!
          </p>

          {[
            { icon: 'alternate_email', label: 'Email', value: 'hello@devportfolio.dev' },
            { icon: 'public', label: 'Website', value: 'www.devportfolio.dev' },
            { icon: 'location_on', label: 'Location', value: 'San Francisco, CA' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — contact form */}
        <div className="bg-white dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-primary/20 shadow-xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <span className="material-symbols-outlined text-primary text-6xl">check_circle</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Message Sent!
              </h3>
              <p className="text-slate-500 text-center">
                Thanks for reaching out. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="How can I help you?"
                  className="w-full bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 p-3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
