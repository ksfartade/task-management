import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('/users/login/', { email, password });

    // Store in cookie with expiry (e.g. 1 hour)
    Cookies.set('access_token', response.data.access, { expires: 1 / 24 }); // 1 hour

    alert('Login successful');
    navigate('/tasks');
  } catch (err) {
    alert(err.response?.data?.detail || 'Login failed');
  }
};

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
