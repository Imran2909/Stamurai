"use client";
import { useState } from "react";
import { message } from "antd";
import styles from "../styles/login.module.css";
import Image from "next/image";
import LoginBanner from "../images/Login banner.jpg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/action";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { isLoading, user, isError } = useSelector(state => state.user);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      throw new Error("Passwords don't match");
    }

    if (!isLogin && !formData.agreeTerms) {
      throw new Error("You must agree to the terms");
    }

    if (isLogin) {
      const result = await dispatch(loginUser(formData.username, formData.password));
      if (result.success) {
        alert("login")
        message.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        message.error(result.message || 'Login failed');
      }
    } else {
      // Signup logic (optional: implement signup action too)
      const response = await fetch('http://localhost:5000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      message.success('Account created successfully!');
      setIsLogin(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
    }
  } catch (error) {
    console.error('Error:', error);
    message.error(error.message);
  } finally {
    setLoading(false);
  }
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
        <div className={`${styles.formCard} ${!isLogin ? styles.flipped : ""}`}>
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Processing..." : "Login"}
              </button>

              <p className={styles.switchText}>
                Dont have an account?{" "}
                <button
                  type="button"
                  className={styles.switchButton}
                  onClick={() => setIsLogin(false)}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <label htmlFor="agreeTerms">I agree to the Terms</label>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>

              <p className={styles.switchText}>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.switchButton}
                  onClick={() => setIsLogin(true)}
                  disabled={loading}
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
