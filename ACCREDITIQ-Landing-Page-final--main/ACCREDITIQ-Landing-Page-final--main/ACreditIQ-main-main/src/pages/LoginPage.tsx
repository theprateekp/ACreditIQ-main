import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoginError, clearLoginError, selectLoginError } from '@/store/authSlice';
import { MOCK_USERS } from '@/data/mockData';
import './LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);
  const [lightLevel, setLightLevel] = useState('0');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mirrors Auth.login() from dashboard-helpers.js:
  // find user by email (case-insensitive) + matching password
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearLoginError());

    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLoginError('Invalid email or password.'));
    }
  };

  return (
    <div className="login-page-wrapper" data-light={lightLevel}>
      {/* Slider form above lamp */}
      <form className="slider-form" onSubmit={(e) => e.preventDefault()}>
        <div className="icon sun">
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
        </div>
        <input
          type="range"
          value={lightLevel}
          min="0"
          max="10"
          onChange={(e) => setLightLevel(e.target.value)}
        />
      </form>

      {/* Lamp in the center */}
      <div className="lamp-wrapper">
        <div className="lamp-rope"></div>
        <div className="lamp">
          <div className="lamp-part -top">
            <div className="lamp-part -top-part"></div>
            <div className="lamp-part -top-part right"></div>
          </div>
          <div className="lamp-part -body"></div>
          <div className="lamp-part -body right"></div>
          <div className="lamp-part -bottom"></div>
          <div className="blub"></div>
        </div>
        <div className="wall-light-shadow"></div>
      </div>

      {/* Login form below lamp */}
      <div className="login-form">
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email:</label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@college.edu"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && (
            <div className="login-error">{loginError}</div>
          )}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="login-hint">
          <p>Super Admin: admin@college.edu / admin123</p>
          <p>Faculty: priya@college.edu / faculty123</p>
        </div>
      </div>
    </div>
  );
}
