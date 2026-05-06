import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="text-ink-500 mt-1">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Back to home
      </Link>
    </div>
  );
}
