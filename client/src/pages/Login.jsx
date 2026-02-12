import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import { login } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(login(values)).unwrap();
        resetForm();
        navigate("/dashboard"); // Redirecting to the main dashboard
      } catch (err) {
        console.error("Login failed", err);
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFFBF0]">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 w-full max-w-md relative overflow-hidden">
        {/* Decorative elements to match homepage style */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/20 rounded-full -mr-12 -mt-12"></div>
        
        <div className="relative">
          <div className="text-center mb-8">
            <span className="text-4xl">🐾</span>
            <h2 className="text-3xl font-black text-[#2D1B69] mt-2">Welcome Back</h2>
            <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mt-2">
              Ready to pamper your pet?
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-[#2D1B69] uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full px-6 py-4 rounded-full border-2 transition-all outline-none ${
                  formik.touched.email && formik.errors.email 
                  ? "border-red-400 bg-red-50" 
                  : "border-gray-100 bg-gray-50 focus:border-yellow-400 focus:bg-white"
                }`}
                placeholder="hello@vetty.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-[#2D1B69] uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className={`w-full px-6 py-4 rounded-full border-2 transition-all outline-none ${
                  formik.touched.password && formik.errors.password 
                  ? "border-red-400 bg-red-50" 
                  : "border-gray-100 bg-gray-50 focus:border-yellow-400 focus:bg-white"
                }`}
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase">{formik.errors.password}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D1B69] text-white py-4 px-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#F97316] shadow-lg shadow-purple-100 transition-all transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to Vetty"}
            </button>
          </form>

          <div className="text-center mt-8 space-y-2">
            <p className="text-gray-400 text-xs font-bold">
              New to the family?{' '}
              <Link to="/signup" className="text-orange-600 hover:underline">
                Create an account
              </Link>
            </p>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-tighter">
              Or join as a <Link to="/seller-signup" className="text-[#2D1B69] font-black underline">Service Provider</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;