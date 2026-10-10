import { PRODUCTS } from '../utils/calc.js';

function LeafMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M31 22c0-9 6-14 15-14 0 9-6 14-15 14z" fill="#F0CB63" />
      <g fill="#fff"><circle cx="21" cy="30" r="8" /><circle cx="37" cy="30" r="8" /><circle cx="29" cy="44" r="8" /></g>
    </svg>
  );
}

function GranuleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="16" cy="30" r="5" /><circle cx="28" cy="32" r="5" /><circle cx="22" cy="21" r="5" />
        <circle cx="34" cy="21" r="3.5" /><circle cx="12" cy="19" r="3" /><circle cx="35" cy="34" r="2.5" opacity=".6" />
      </g>
    </svg>
  );
}

function DropIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M24 6c6 8 12 14.5 12 22a12 12 0 0 1-24 0c0-7.5 6-14 12-22z" />
      <path fill="#fff" opacity=".45" d="M18 28a6 6 0 0 0 5 5.9c-4-.9-6.5-3.5-6.6-6.700z" />
    </svg>
  );
}

function ProductCard({ product, form, icon, onSelect }) {
  return (
    <button type="button" className="pcard" onClick={() => onSelect(product.id)}>
      <span className="pcard__icon">{icon}</span>
      <span className="pcard__tag">{form}</span>
      <span className="pcard__name">{product.name}</span>
      <span className="pcard__cta">
        Select
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
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
        <h1 id="home-title">ProGibb GA Dosage Calculator</h1>
        <p className="hero-panel__sub">Calculate the required dosage for your farm.</p>
      </div>

      <div className="pgrid">
        <ProductCard product={PRODUCTS.solid} form="Solid" icon={<GranuleIcon />} onSelect={onSelect} />
        <ProductCard product={PRODUCTS.liquid} form="Liquid" icon={<DropIcon />} onSelect={onSelect} />
      </div>
    </section>
  );
}