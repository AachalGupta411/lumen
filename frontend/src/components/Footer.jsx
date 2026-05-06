import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="container-x py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-display font-extrabold">
              L
            </div>
            <span className="font-display font-extrabold text-xl">Lumen</span>
          </div>
          <p className="mt-3 text-ink-600 max-w-xs">
            A modern shopping experience — curated products, lightning-fast cart, beautiful UX.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-ink-900 mb-3">Shop</h4>
          <ul className="space-y-2 text-ink-600">
            <li><Link to="/products" className="hover:text-ink-900">All products</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-ink-900">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-ink-900">Fashion</Link></li>
            <li><Link to="/products?category=Shoes" className="hover:text-ink-900">Shoes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-ink-900 mb-3">Company</h4>
          <ul className="space-y-2 text-ink-600">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-ink-900 mb-3">Stay updated</h4>
          <p className="text-ink-600 mb-3">Get the best deals straight to your inbox.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="input" placeholder="you@example.com" />
            <button className="btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Lumen Commerce. Crafted with care.
      </div>
    </footer>
  );
}
