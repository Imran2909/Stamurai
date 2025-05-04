'use client';
import { useState } from 'react';
import styles from '../styles/login.module.css';
import Image from 'next/image';
import LoginBanner from '../images/Login banner.jpg';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? 'Login' : 'Signup', formData);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.bannerContainer}>
        <Image
          src={LoginBanner}
          alt="Login Banner"
          className={styles.bannerImage}
          priority
          fill
          sizes="100vw"
        />
      </div>

      <div className={styles.formWrapper}>
        {/* Login Form */}
        <div className={`${styles.formCard} ${!isLogin ? styles.flipped : ''}`}>
          <div className={`${styles.formSide} ${styles.front}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.formTitle}>Login</h2>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Login
              </button>
              
              <p className={styles.switchText}>
                Dont have an account?{' '}
                <button 
                  type="button" 
                  className={styles.switchButton}
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>

          {/* Signup Form */}
          <div className={`${styles.formSide} ${styles.back}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.formTitle}>Sign Up</h2>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">I agree to the Terms</label>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Sign Up
              </button>
              
              <p className={styles.switchText}>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className={styles.switchButton}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}