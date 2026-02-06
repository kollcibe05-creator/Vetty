import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useFormik} from "formik"
import * as yup from "yup"
import { login } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
    navigate('/profile');
    }
  }, [isAuthenticated, navigate])
  
 

    const schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {

      try{
        await dispatch(login(values)).unwrap();
        resetForm()
        navigate("/")
      }catch(err){
        console.error("Login failed", err)
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Welcome Back</h2>
        <p className="description">Log in to access our splendid services and products.</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              {...formik.getFieldProps("username")}
              className={formik.touched.username && formik.errors.username ? "error-border" : ""}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error-message">{formik.errors.username}</p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
             type="password"
              {...formik.getFieldProps("password")}
              className={formik.touched.password && formik.errors.password ? "error-border" : ""}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error-message">{formik.errors.password}</p>
            )}
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
       </div>
  );
}

export default Login; 