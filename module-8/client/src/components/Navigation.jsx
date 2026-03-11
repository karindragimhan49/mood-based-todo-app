import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`text-sm font-medium transition-colors ${
            pathname === to
              ? 'text-primary border-b-2 border-primary pb-0.5'
              : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
