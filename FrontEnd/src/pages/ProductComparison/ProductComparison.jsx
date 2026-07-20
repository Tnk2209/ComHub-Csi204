import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, X, ArrowLeft } from 'lucide-react';
import { useCompare } from '../../contexts/CompareContext';
import * as productService from '../../services/productService.js';

function ProductComparison({ onNavigate }) {
  const { t } = useTranslation();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compareItems.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    Promise.all(compareItems.map((item) => productService.get(item.id)))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [compareItems]);

  const allSpecKeys = [...new Set(products.flatMap((p) => Object.keys(p.specifications || {})))];

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-8">
        <BarChart3 className="w-16 h-16 text-app-text-muted mb-4" />
        <p className="text-app-text-muted text-lg mb-6">{t('compare.empty')}</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('compare.go_to_catalog')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue" />
            <h1 className="text-3xl font-bold text-app-text">{t('compare.title')}</h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-sm text-red hover:text-red/80 font-medium transition-colors"
          >
            {t('compare.clear_all')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-app-text-muted">Loading...</p>
          </div>
        ) : (
          <div className="bg-app-surface rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-app-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-app-text-muted w-40">
                      {t('compare.spec')}
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-center min-w-[200px]">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold text-app-text">{product.name}</span>
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="p-1 text-app-text-muted hover:text-red transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-blue font-bold text-lg mt-1">
                          ฿{Number(product.price).toLocaleString()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {allSpecKeys.map((key) => (
                    <tr key={key} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-app-text">{key}</td>
                      {products.map((product) => (
                        <td key={product.id} className="px-6 py-3 text-sm text-center text-app-text">
                          {String(product.specifications?.[key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductComparison;
