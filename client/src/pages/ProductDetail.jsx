import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProductById, 
  fetchProducts,
  selectCurrentProduct, 
  selectProductLoading, 
  selectAllProducts 
} from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux State
  const product = useSelector(selectCurrentProduct);
  const isLoading = useSelector(selectProductLoading);
  const allProducts = useSelector(selectAllProducts) || [];

  // Local State
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // 1. Data Fetching Effect
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      
      // If the user refreshed the page, 'items' might be empty. 
      // Fetch them silently so "Related Products" works.
      if (allProducts.length === 0) {
        dispatch(fetchProducts({ background: true }));
      }
    }
  }, [dispatch, id, allProducts.length]);

  // 2. UI Reset Effect (Fixes the ESLint "setState" warning)
  // We separate this so it only runs when the ID specifically changes
  
  useEffect(() => {
    setSelectedQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  // 3. Memoized Related Products
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (product?.stock_quantity > 0) {
      dispatch(addToCart({ productId: product.id, quantity: selectedQuantity }));
      dispatch(showNotification({
        type: 'success',
        title: 'Success!',
        message: `${product.name} added to cart`,
      }));
    }
  };

  // Loading View
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading details...</p>
      </div>
    );
  }

  // Not Found View
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <button onClick={() => navigate('/products')} className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar / Breadcrumb */}
      <nav className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center text-sm">
          <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
            &larr; Back to Products
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Image */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square relative group">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
              
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                  {product.category?.name || 'General'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">{product.name}</h1>
              <p className="text-3xl font-light text-blue-600 mb-8">
                Ksh. {product.price?.toLocaleString()}
              </p>

              <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-50 py-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                <p>{product.description}</p>
              </div>

              {/* Quantity & Actions */}
              <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Quantity</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock_quantity > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} Available` : 'Out of Stock'}
                  </span>
                </div>

                {product.stock_quantity > 0 && (
                  <div className="flex items-center border border-gray-200 rounded-xl w-32">
                    <button 
                      onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold text-lg"
                    >−</button>
                    <div className="flex-1 text-center font-bold text-gray-900">{selectedQuantity}</div>
                    <button 
                      onClick={() => setSelectedQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold text-lg"
                    >+</button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
                    bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200"
                >
                  {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ItemCard key={p.id} item={p} type="product" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;