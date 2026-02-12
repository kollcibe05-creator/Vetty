import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../features/cartSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans">
      {/* 1. HERO SECTION - */}
      <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <span className="text-orange-600 font-bold uppercase tracking-wider text-xs">Happy Pets, Happier You</span>
          <h1 className="text-6xl font-black text-[#2D1B69] leading-tight tracking-tighter">
            Life is Better <br /> with <span className="text-orange-500">Pets.</span>
          </h1>
          <p className="text-gray-600 max-w-md leading-relaxed font-medium">
            Welcome to Vetty! We make pet ownership simple, convenient, and fun. From professional veterinary care to premium pet products.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => navigate('/services')} 
              className="px-10 py-4 bg-[#2D1B69] text-white rounded-full font-bold hover:bg-purple-900 transition-all shadow-lg text-sm"
            >
              Book A Service
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="px-10 py-4 border-2 border-[#2D1B69] text-[#2D1B69] rounded-full font-bold hover:bg-white/50 transition-all text-sm"
            >
              Shop Products
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-b-[12px] border-r-[12px] border-orange-400 transform rotate-2">
            <img 
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80" 
              alt="Happy Dogs" 
              className="w-full h-[450px] object-cover -rotate-2 scale-110"
            />
          </div>
        </div>
      </section>

      {/* 2. ABOUT US - */}
      <section className="container mx-auto px-6 py-24 flex flex-col md:flex-row-reverse items-center gap-16">
        <div className="md:w-1/2">
          <span className="text-orange-600 font-bold uppercase tracking-widest text-[10px]">About Us</span>
          <h2 className="text-5xl font-black text-[#2D1B69] mt-2 mb-6 tracking-tighter leading-tight">
            We want to make pets as happy as they make us.
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            We understand pet ownership can be challenging. Whether you are struggling to find reliable veterinary care or need premium food delivered to your door, Vetty is your trusted partner.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              'Professional veterinary services with compassionate care.',
              'Wide range of pet care products from trusted brands.',
              'Simple online appointment scheduling and M-Pesa payments.'
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 font-semibold text-sm">
                <span className="text-green-500 text-lg">✓</span> {text}
              </li>
            ))}
          </ul>
          <button className="text-orange-600 font-black text-sm hover:gap-4 transition-all flex items-center gap-2 group">
            Learn More <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        <div className="md:w-1/2">
          <div className="rounded-tl-[10rem] rounded-br-[10rem] rounded-tr-[3rem] rounded-bl-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" 
              alt="Happy Cat" 
              className="w-full h-[550px] object-cover" 
            />
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS - */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold uppercase text-[10px] tracking-[0.3em]">Testimonials</span>
            <h2 className="text-4xl font-black text-[#2D1B69] mt-2 tracking-tighter">Hear what our customers say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <TestimonialCard 
              name="Grace Olango" 
              role="Dog Owner" 
              text="My pet has never felt that safe and secure under full care. I love the grooming and boarding packages they offer. Just perfect!" 
              initial="G"
            />
            <TestimonialCard 
              name="Bryan" 
              role="Cat Owner" 
              text="We have a pure white Maltese that loves to play in the garden. Vetty's grooming services are a lifesaver. Highly recommended!" 
              initial="B"
            />
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION - */}
      <section className="bg-[#2D1B69] py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Ready to give your pet the best life?
          </h2>
          <p className="text-purple-200 mb-12 text-lg font-medium opacity-80">
            Join thousands of happy pet owners who trust Vetty for their needs.
          </p>
          <button className="px-14 py-5 bg-orange-500 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:scale-105 transition-all shadow-2xl">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

const TestimonialCard = ({ name, role, text, initial }) => (
  <div className="bg-orange-600 p-12 rounded-[3rem] text-white relative shadow-2xl transform hover:-translate-y-2 transition-all">
    <div className="absolute top-6 left-8 text-6xl opacity-20 font-serif">“</div>
    <p className="mb-10 font-bold leading-relaxed text-lg relative z-10 italic">
      {text}
    </p>
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-yellow-400 text-[#2D1B69] rounded-full flex items-center justify-center font-black text-xl shadow-inner">
        {initial}
      </div>
      <div>
        <h4 className="font-black text-base uppercase tracking-tighter">{name}</h4>
        <p className="text-xs text-orange-200 font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </div>
);

export default Home;