import { useEffect, useState } from 'react';
import ProductSelect from './components/ProductSelect.jsx';
import Calculator from './components/Calculator.jsx';
import InstallBar from './components/InstallBar.jsx';

export default function App() {
  const [product, setProduct] = useState(null); // null = home screen

  // Make the phone's Back button/gesture return to the product list.
  useEffect(() => {
    const onPop = (e) => setProduct(e.state?.product ?? null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = (id) => {
    window.history.pushState({ product: id }, '');
    setProduct(id);
  };
  const back = () => {
    if (window.history.state?.product) window.history.back();
    else setProduct(null);
  };

  return (
    <main className="app">
      {product ? <Calculator key={product} productId={product} onBack={back} /> : <ProductSelect onSelect={open} />}
      <InstallBar />
    </main>
  );
}