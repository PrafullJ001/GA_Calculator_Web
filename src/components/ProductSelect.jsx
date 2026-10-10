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
  // "ProGibb Easy GA" -> light part "ProGibb", bold coloured part "Easy GA"
  const rest = product.name.replace(/^ProGibb\s*/, '');
  return (
    <button type="button" className={`pcard pcard--${accent}`} onClick={() => onSelect(product.id)}>
      <span className="pcard__name">
        ProGibb <strong>{rest}</strong>
      </span>
      <span className="pcard__cta">Select</span>
    </button>
  );
}

export default function ProductSelect({ onSelect }) {
  return (
    <section className="screen home" aria-labelledby="home-title">
      <div className="hero-panel">
        <div className="masthead">
          <span className="masthead__brand"><LeafMark /> ProGibb GA</span>
          <span className="masthead__label">Dosage Calculator</span>
        </div>
        <h1 id="home-title"><span className="hero-ga">GA</span> Calculator</h1>
        <p className="hero-panel__sub">Calculate the required dosage for your farm.</p>
      </div>

      <div className="pgrid">
        <ProductCard product={PRODUCTS.solid} accent="solid" onSelect={onSelect} />
        <ProductCard product={PRODUCTS.liquid} accent="liquid" onSelect={onSelect} />
      </div>
    </section>
  );
}