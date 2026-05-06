import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';

const sortOptions = [
  ['newest', 'Newest'],
  ['priceAsc', 'Price: Low to High'],
  ['priceDesc', 'Price: High to Low'],
  ['rating', 'Top rated'],
  ['popular', 'Popular'],
];

export default function Products() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items, pagination, loading, categories } = useSelector((s) => s.products);
  const [showFilter, setShowFilter] = useState(false);

  const query = useMemo(
    () => ({
      q: params.get('q') || '',
      category: params.get('category') || 'all',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      sort: params.get('sort') || 'newest',
      page: params.get('page') || '1',
      featured: params.get('featured') || '',
      trending: params.get('trending') || '',
      limit: 12,
    }),
    [params]
  );

  useEffect(() => {
    dispatch(fetchProducts(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v == null || v === 'all') next.delete(k);
      else next.set(k, v);
    });
    if (!('page' in patch)) next.set('page', '1');
    setParams(next, { replace: true });
  };

  return (
    <div className="container-x py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {query.q ? `Results for “${query.q}”` : 'All products'}
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            {pagination.total} item{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilter(true)} className="btn-outline lg:hidden">
            <Filter size={16} /> Filters
          </button>
          <select
            value={query.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="input w-auto py-2"
          >
            {sortOptions.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters */}
        <aside
          className={`${
            showFilter ? 'fixed inset-0 z-40 bg-white p-5 overflow-y-auto' : 'hidden'
          } lg:block lg:relative lg:p-0 lg:bg-transparent lg:z-auto`}
        >
          <div className="flex items-center justify-between mb-4 lg:mb-3">
            <h3 className="font-semibold">Filters</h3>
            <button
              className="lg:hidden btn-ghost p-2"
              onClick={() => setShowFilter(false)}
              aria-label="close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="card p-4 space-y-5 sticky top-20">
            <div>
              <p className="text-sm font-semibold mb-2">Category</p>
              <div className="space-y-1.5 text-sm">
                {[['all', 'All'], ...categories.map((c) => [c, c])].map(([v, l]) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={query.category === v}
                      onChange={() => update({ category: v })}
                      className="accent-brand-600"
                    />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Price (₹)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={query.minPrice}
                  onChange={(e) => update({ minPrice: e.target.value })}
                  className="input py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={query.maxPrice}
                  onChange={(e) => update({ maxPrice: e.target.value })}
                  className="input py-2"
                />
              </div>
            </div>

            <button
              onClick={() => setParams({})}
              className="btn-outline w-full text-sm"
            >
              Clear filters
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : items.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-ink-500 text-sm mt-1">Try a different search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }).map((_, i) => {
                const p = i + 1;
                const active = +query.page === p;
                return (
                  <button
                    key={p}
                    onClick={() => update({ page: p })}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-brand-600 text-white'
                        : 'bg-white border border-ink-200 hover:bg-ink-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
