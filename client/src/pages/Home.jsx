import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      
      {/* --- SECTION 1: HERO (Top Banner) --- */}
      <section className="relative bg-[#FFFBF0] pt-10 pb-20 md:pt-20 md:pb-32">
        {/* Background Blob Shape (Yellow) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-yellow-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
          
          {/* Left: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 block">
              Happy Pets, Happier You
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#2D1B69] leading-tight mb-6">
              Life is Better <br /> with <span className="text-orange-500">Pets.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
              Welcome to Vetty! We make pet ownership simple, convenient, and fun. 
              From professional veterinary care to premium pet products, we have everything your furry friend needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/services" 
                className="px-8 py-4 bg-[#2D1B69] text-white font-bold rounded-full hover:bg-purple-800 transition shadow-lg transform hover:-translate-y-1"
              >
                Book A Service
              </Link>
              <Link 
                to="/products" 
                className="px-8 py-4 bg-white text-[#2D1B69] border-2 border-[#2D1B69] font-bold rounded-full hover:bg-gray-50 transition transform hover:-translate-y-1"
              >
                Shop Products
              </Link>
            </div>
          </div>

          {/* Right: Hero Image with Organic Background */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative">
              {/* Orange decorative blob behind image */}
              <div className="absolute top-4 right-4 w-full h-full bg-orange-400 rounded-[2rem] transform rotate-3 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80" 
                alt="Happy dog and owner" 
                className="w-full h-[400px] md:h-[500px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ABOUT (Split Layout) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          
          {/* Left: Image with organic shape */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-100 rounded-full -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1443&q=80" 
              alt="Cat playing" 
              className="rounded-tr-[100px] rounded-bl-[100px] rounded-tl-3xl rounded-br-3xl shadow-xl w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className="w-full md:w-1/2">
            <span className="text-orange-500 font-bold uppercase text-sm mb-2 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D1B69] mb-6 leading-tight">
              We want to make pets as happy as they make us.
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              We understand pet ownership can be challenging. Whether you are struggling to find reliable veterinary care or need premium food delivered to your door, Vetty is your trusted partner.
            </p>
            
            <div className="space-y-4">
              <FeatureItem text="Professional veterinary services with compassionate care." />
              <FeatureItem text="Wide range of pet care products from trusted brands." />
              <FeatureItem text="Simple online appointment scheduling and M-Pesa payments." />
            </div>

            <button className="mt-8 text-orange-600 font-bold text-lg hover:text-orange-700 flex items-center group">
              Learn More 
              <span className="ml-2 group-hover:translate-x-1 transition">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: SERVICES (Yellow Cards) --- */}
      <section className="py-24 bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <span className="text-orange-500 font-bold uppercase text-sm">What We Offer</span>
              <h2 className="text-4xl font-bold text-[#2D1B69] mt-2">Because every pet deserves the best care</h2>
            </div>
            <Link to="/services" className="hidden md:inline-block text-[#2D1B69] font-bold border-b-2 border-orange-500 hover:text-orange-600 transition">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Veterinary Care" 
              desc="Professional checkups, vaccinations, and surgeries for your beloved pets."
              img="https://images.unsplash.com/photo-1628009368231-760335298457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            />
            <ServiceCard 
              title="Pet Grooming" 
              desc="Tired of dealing with dirty, matted fur? Let us take the hassle out of grooming."
              img="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            />
            <ServiceCard 
              title="Pet Store" 
              desc="Browse our inventory of premium foods, toys, and accessories."
              img="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 4: TESTIMONIALS (Orange Cards) --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -right-20 top-40 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase text-sm">Testimonials</span>
            <h2 className="text-4xl font-bold text-[#2D1B69] mt-2">Hear what our customers say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard 
              name="Grace Olango" 
              role="Dog Owner"
              text="My pet has never felt that safe and secure under full care. I love the grooming and boarding packages they offer. Just perfect!"
            />
            <TestimonialCard 
              name="Bryan" 
              role="Cat Owner"
              text="We have a pure white Maltese that loves to play in the garden. Vetty's grooming services are a lifesaver. Highly recommended!"
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 5: CTA (Bottom Banner) --- */}
      <section className="py-20 bg-[#2D1B69] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to give your pet the best life?</h2>
          <p className="text-purple-200 text-lg mb-8">Join thousands of happy pet owners who trust Vetty for their needs.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const FeatureItem = ({ text }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-gray-700 text-lg">{text}</span>
  </div>
);

const ServiceCard = ({ title, desc, img }) => (
  <div className="group bg-yellow-400 rounded-[2rem] overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 cursor-pointer">
    <div className="h-64 overflow-hidden relative">
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition z-10"></div>
      <img src={img} alt={title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold text-[#2D1B69] mb-3">{title}</h3>
      <p className="text-[#2D1B69] opacity-80 mb-6 leading-relaxed">{desc}</p>
      <span className="inline-block bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-sm">
        Learn More
      </span>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="bg-orange-600 p-10 rounded-[2rem] text-white relative shadow-xl transform hover:-translate-y-1 transition duration-300">
    <div className="text-8xl absolute -top-4 left-6 text-orange-700 opacity-50 font-serif leading-none">"</div>
    <p className="text-xl relative z-10 mb-8 font-medium leading-relaxed pt-4">{text}</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center text-orange-800 font-bold text-xl">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-lg">{name}</h4>
        <span className="text-orange-200 text-sm">{role}</span>
      </div>
    </div>
  </div>
);

export default Home;