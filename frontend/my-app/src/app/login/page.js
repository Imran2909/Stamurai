"use client";
import { useState } from "react";
import { message } from "antd";
import styles from "../styles/login.module.css";
import Image from "next/image";
import LoginBanner from "../images/Login banner.jpg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../redux/action";
import { LOGIN_REQUEST, LOGIN_SUCCESS, STOP } from "../redux/actionTypes";

export default function LoginPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loading = useSelector((state) => state.user.isLoading);
  console.log(loading);
  const [isLogin, setIsLogin] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  console.log(user);
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
    try {
      const successMessage = (message) => {
        messageApi.open({
          type: "success",
          content: message,
        });
      };
      const errorMessage = (message) => {
        messageApi.open({
          type: "error",
          content: message,
        });
      };
      if (!isLogin && formData.password !== formData.confirmPassword) {
        errorMessage("Passwords don't match");
        dispatch({type:STOP})
        return
      }
      if (!isLogin && !formData.agreeTerms) {
        errorMessage("You must agree to the terms");
        dispatch({type:STOP})  
        return
      }
      if (isLogin) {
        const result1 = await dispatch(
          loginUser(formData.username, formData.password)
        );
        if (result1.success) {
          successMessage( result1.message );
          window.location.href = "/";
        } else {
          errorMessage( result1.message )
        }
      } else {
        const result = await dispatch(
          signupUser(formData.username, formData.email, formData.password)
        );
        if (result.success) {
          successMessage(result.message);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeTerms: false,
          });
          setIsLogin(true);
        } else {
          errorMessage(result.message)
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
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
