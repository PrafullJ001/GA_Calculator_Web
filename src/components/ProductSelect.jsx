import { PRODUCTS } from '../utils/calc.js';

function LeafMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M31 22c0-9 6-14 15-14 0 9-6 14-15 14z" fill="#F0CB63" />
      <g fill="#fff"><circle cx="21" cy="30" r="8" /><circle cx="37" cy="30" r="8" /><circle cx="29" cy="44" r="8" /></g>
    </svg>
  );
}

function ProductCard({ product, accent, onSelect }) {
  return (
    <button type="button" className={`tile tile--${accent}`} onClick={() => onSelect(product.id)}>
      <span className="tile__name">{product.name}</span>
      <span className="tile__go">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

export default function ProductSelect({ onSelect }) {
  return (
    <section className="screen home" aria-labelledby="home-title">
      <div className="home__top">
        <span className="home__logo"><LeafMark /></span>
        ProGibb GA
      </div>
      <h1 id="home-title" className="home__title"><span>GA</span> Calculator</h1>
      <p className="home__sub">Choose your product to get the dosage.</p>

      <div className="tiles">
        <ProductCard product={PRODUCTS.solid} accent="a" onSelect={onSelect} />
        <ProductCard product={PRODUCTS.liquid} accent="b" onSelect={onSelect} />
      </div>
    </section>
  );
}