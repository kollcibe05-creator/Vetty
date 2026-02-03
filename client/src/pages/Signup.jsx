import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signup({ username, email, password })).then((action) => {
            if (action.meta.requestStatus === 'fulfilled') {
                navigate('/login');
            
            }
        });
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <buton type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </buton>
            </form>
            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}
export default Signup;
    