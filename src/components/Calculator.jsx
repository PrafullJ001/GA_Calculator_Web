import { useEffect, useRef, useState } from 'react';
import ResultCard from './ResultCard.jsx';
import { PRODUCTS, parsePositive, formatNumber, rToAcre, acreToR, requiredGrams } from '../utils/calc.js';

const MESSAGES = {
  area: {
    empty: 'Enter the farm area in R or Acre.',
    invalid: 'Enter a valid positive number.',
    zero: 'Area must be greater than zero.',
  },
  ppm: {
    empty: 'Enter the required PPM.',
    invalid: 'Enter a valid positive number.',
    zero: 'PPM must be greater than zero.',
  },
};

export default function Calculator({ productId, onBack }) {
  const product = PRODUCTS[productId];
  const [source, setSource] = useState('ac'); // which area field the user typed in last
  const [r, setR] = useState('');
  const [ac, setAc] = useState('');
  const [ppmRaw, setPpmRaw] = useState('');
  const [touched, setTouched] = useState({ area: false, ppm: false });
  const [result, setResult] = useState(null); // filled only after pressing Calculate
  const firstInput = useRef(null);
  const againBtn = useRef(null);

  // Phone Back button / gesture closes the result window and returns to the form.
  useEffect(() => {
    const onPop = (e) => { if (!e.state?.result) setResult(null); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // When the result window opens: go to the top and focus its button.
  useEffect(() => {
    if (result) {
      window.scrollTo?.(0, 0);
      againBtn.current?.focus();
    }
  }, [result]);

  const touch = (k) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }));

  function onR(v) {
    touch('area');
    setResult(null);
    setSource('r');
    setR(v);
    const p = parsePositive(v);
    setAc(p.status === 'ok' ? formatNumber(rToAcre(p.value)) : ''); // clear the twin when invalid/empty
  }

  function onAc(v) {
    touch('area');
    setResult(null);
    setSource('ac');
    setAc(v);
    const p = parsePositive(v);
    setR(p.status === 'ok' ? formatNumber(acreToR(p.value)) : '');
  }

  const areaParsed = parsePositive(source === 'r' ? r : ac);
  const ppmParsed = parsePositive(ppmRaw);
  const acres =
    areaParsed.status === 'ok' ? (source === 'r' ? rToAcre(areaParsed.value) : areaParsed.value) : null;

  const areaError = touched.area && areaParsed.status !== 'ok' ? MESSAGES.area[areaParsed.status] : '';
  const ppmError = touched.ppm && ppmParsed.status !== 'ok' ? MESSAGES.ppm[ppmParsed.status] : '';

  const valid = acres !== null && ppmParsed.status === 'ok';

  function onSubmit(e) {
    e.preventDefault();
    setTouched({ area: true, ppm: true });
    if (!valid) { setResult(null); return; }
    window.history.pushState({ product: productId, result: true }, '');
    setResult({
      grams: requiredGrams(acres, ppmParsed.value, product.factor),
      acresText: formatNumber(acres, 4),
      rText: formatNumber(acreToR(acres), 4),
      ppmText: formatNumber(ppmParsed.value, 4),
    });
  }

  function reset() {
    const wasOpen = Boolean(result);
    setR(''); setAc(''); setPpmRaw(''); setSource('ac');
    setTouched({ area: false, ppm: false });
    setResult(null);
    if (wasOpen && window.history.state?.result) window.history.back(); // drop the result entry
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
    setTimeout(() => firstInput.current?.focus(), 0);
  }

  // Full-screen result window
  if (result) {
    return (
      <section className="screen result-screen" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <h1 id="result-title" className="result-screen__title">Dosage Result</h1>
        <ResultCard
          product={product}
          acresText={result.acresText}
          rText={result.rText}
          ppm={result.ppmText}
          grams={result.grams}
        />
        <button type="button" ref={againBtn} className="btn btn--light" onClick={reset}>Check Another</button>
      </section>
    );
  }

  return (
    <section className="screen calc" aria-labelledby="calc-title">
      <div className="topbar">
        <button type="button" className="back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back
        </button>
      </div>

      <h1 id="calc-title" className="calc-title">{product.name.replace(/\s*\([^)]*\)\s*$/, '')}</h1>

      <form className="card" onSubmit={onSubmit} noValidate>
        <fieldset className="area">
          <legend>Farm area <small>(enter either one)</small></legend>
          <div className="area__row">
            <label className="field">
              <span>R (Guntha)</span>
              <input
                inputMode="decimal" autoComplete="off" placeholder="0"
                ref={firstInput} value={r} onChange={(e) => onR(e.target.value)}
                aria-invalid={Boolean(areaError)} aria-describedby={areaError ? 'area-err' : undefined}
              />
            </label>
            <span className="area__eq" aria-hidden="true">=</span>
            <label className="field">
              <span>Acre (Ac)</span>
              <input
                inputMode="decimal" autoComplete="off" placeholder="0"
                value={ac} onChange={(e) => onAc(e.target.value)}
                aria-invalid={Boolean(areaError)} aria-describedby={areaError ? 'area-err' : undefined}
              />
            </label>
          </div>
          <p className="area__note">1 Acre = 40 R</p>
          {areaError && <p id="area-err" className="error" role="alert">{areaError}</p>}
        </fieldset>

        <label className="field field--block">
          <span>Required PPM</span>
          <input
            inputMode="decimal" autoComplete="off" placeholder="e.g. 10"
            value={ppmRaw}
            onChange={(e) => { touch('ppm'); setResult(null); setPpmRaw(e.target.value); }}
            aria-invalid={Boolean(ppmError)} aria-describedby={ppmError ? 'ppm-err' : undefined}
          />
          {ppmError && <p id="ppm-err" className="error" role="alert">{ppmError}</p>}
        </label>

        <div className="actions">
          <button type="submit" className="btn btn--primary">Calculate</button>
          <button type="button" className="btn btn--ghost" onClick={reset}>Check Another</button>
        </div>
      </form>
    </section>
  );
}