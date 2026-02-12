import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews, selectReviews } from '../features/reviewSlice';
import ReviewStars from '../components/ReviewStars';
import ReviewSection from '../components/ReviewSection';
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

  useEffect(() => {
  dispatch(fetchReviews()); 
}, [dispatch]);
  


  const product = useSelector(selectCurrentProduct);
  const isLoading = useSelector(selectProductLoading);
  const allProducts = useSelector(selectAllProducts) || [];

const { items: reviews, loading, error } = useSelector(selectReviews);



const productReviews = reviews.filter(r => r.product_id === product?.id);

const avgRating = productReviews.length 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;


 
  const [selectedQuantity, setSelectedQuantity] = useState(1);


  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
 
      if (allProducts.length === 0) {
        dispatch(fetchProducts({ background: true }));
      }
    }
  }, [dispatch, id, allProducts.length]);


  
  useEffect(() => {
    setSelectedQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

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
        message: `Woot! ${product.name} is now in your cart! 🐾`,
      }));
    }
  };

  // Loading 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center">
        <div className="animate-bounce text-6xl mb-4">🦴</div>
        <p className="text-[#2D1B69] font-black animate-pulse uppercase tracking-widest">Fetching the good stuff...</p>
      </div>
    );
  }

  // Not Found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border-4 border-yellow-400 max-w-md w-full">
          <span className="text-6xl block mb-4">😿</span>
          <h2 className="text-3xl font-black text-[#2D1B69] mb-4">Lost in the Dog Park?</h2>
          <p className="text-gray-500 mb-8">We couldn't find that product anywhere.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="w-full py-4 bg-[#2D1B69] text-white rounded-full font-black hover:bg-orange-600 transition-all shadow-lg"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-20">
      {/* Breadcrumb Navbar */}
      <nav className="bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => navigate('/products')} 
            className="group flex items-center gap-2 text-[#2D1B69] font-bold hover:text-orange-600 transition-colors"
          >
            <span className="bg-orange-100 p-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">&larr;</span> 
            Back to Products
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Decorative Background Blob */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full -z-10 opacity-30"></div>
              
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border-8 border-white aspect-square relative group">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
                    <span className="text-9xl">🐾</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-orange-50">
              
              {/* Category Badge */}
              <div className="mb-6">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-[#2D1B69]">
                  {product.category?.name || 'General'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">{product.name}</h1>
              <p className="text-3xl font-light text-blue-600 mb-8">
                Ksh. {product.price?.toLocaleString()}
              </p>

                {/* Star Rating */}
                {avgRating > 0 && (
                  <div className="flex items-center mb-4 space-x-2">
                    <ReviewStars rating={avgRating} size={5} />
                    <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
                  </div>
                )}

              <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-50 py-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-xs font-black text-[#2D1B69] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Product Details
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* ACTION AREA */}
              <div className="bg-[#FFFBF0] p-6 rounded-[2rem] border border-orange-100 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#2D1B69] uppercase">Quantity</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    product.stock_quantity > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
                  </span>
                </div>

                {product.stock_quantity > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border-2 border-orange-100 rounded-full p-1 w-36 shadow-inner">
                      <button 
                        onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-500 hover:text-white rounded-full text-[#2D1B69] font-black transition-all"
                      >−</button>
                      <div className="flex-1 text-center font-black text-[#2D1B69]">{selectedQuantity}</div>
                      <button 
                        onClick={() => setSelectedQuantity(q => Math.min(product.stock_quantity, q + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-500 hover:text-white rounded-full text-[#2D1B69] font-black transition-all"
                      >+</button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-4 bg-[#2D1B69] text-white rounded-full font-black text-lg shadow-lg hover:bg-orange-600 transition-all transform active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}

                {!product.stock_quantity && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center font-bold">
                    This item is currently out of paw-reach!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <section className="mt-16">
          <ReviewSection productId={id} />
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-black text-[#2D1B69] mb-2">You Might Also Wag About</h2>
              <div className="h-1.5 w-24 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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