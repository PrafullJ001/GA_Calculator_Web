export default function ResultCard({ product, ppm, grams, acresText, rText }) {
  // Show the product name without the "(Solid)" / "(Liquid)" part
  const productName = product.name.replace(/\s*\([^)]*\)\s*$/, '');

  return (
    <section className="result" aria-live="polite" aria-label="Result">
      <div className="result__hero">
        <p className="result__label">Required Quantity</p>
        <p className="result__value">
          {grams.toFixed(2)} <span>gm</span>
        </p>
      </div>
      <dl className="result__meta">
        <div className="result__item result__item--wide">
          <dt>Product</dt>
          <dd>{productName}</dd>
        </div>
        <div className="result__item">
          <dt>Area · Acre</dt>
          <dd>{acresText}</dd>
        </div>
        <div className="result__item">
          <dt>Area · R (Guntha)</dt>
          <dd>{rText}</dd>
        </div>
        <div className="result__item result__item--wide result__item--accent">
          <dt>PPM</dt>
          <dd>{ppm}</dd>
        </div>
      </dl>
    </section>
  );
}