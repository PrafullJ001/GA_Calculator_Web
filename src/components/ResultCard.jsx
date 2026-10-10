export default function ResultCard({ product, ppm, grams, acresText }) {
  return (
    <section className="result" aria-live="polite" aria-label="Result">
      <p className="result__label">Required Quantity</p>
      <p className="result__value">
        {grams.toFixed(2)} <span>gm</span>
      </p>
      <dl className="result__meta">
        <div><dt>Product</dt><dd>{product.name}</dd></div>
        <div><dt>Area</dt><dd>{acresText} Acre</dd></div>
        <div><dt>PPM</dt><dd>{ppm}</dd></div>
      </dl>
    </section>
  );
}