import React, { useState, useEffect } from 'react';
import { IoMailOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoginSocialFacebook } from 'reactjs-social-login';
import config from '../../config';
import Logo from "../../assets/logo.svg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const loginTranslations = {
  en: {
    title: "Login Or Signup",
    welcome: "Welcome to Lorepa",
    emailLabel: "Email",
    emailPlaceholder: "Email Address",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    loginBtn: "Login",
    or: "Or",
    continueWithGoogle: "Continue with Google",
    continueWithFacebook: "Continue with Facebook",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    loginSuccess: "Login Successful",
    loginFailed: "Login failed",
    googleAuthFailed: "Google Authentication Failed",
    facebookLoginFailed: "Facebook login failed",
  },
  es: {
    title: "Iniciar sesión o registrarse",
    welcome: "Bienvenido a Lorepa",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Dirección de correo electrónico",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Contraseña",
    loginBtn: "Iniciar sesión",
    or: "O",
    continueWithGoogle: "Continuar con Google",
    continueWithFacebook: "Continuar con Facebook",
    noAccount: "¿No tienes una cuenta?",
    signup: "Registrarse",
    loginSuccess: "Inicio de sesión exitoso",
    loginFailed: "Inicio de sesión fallido",
    googleAuthFailed: "Autenticación de Google fallida",
    facebookLoginFailed: "Inicio de sesión con Facebook fallido",
  },
  cn: {
    title: "登录或注册",
    welcome: "欢迎来到 Lorepa",
    emailLabel: "电子邮件",
    emailPlaceholder: "电子邮件地址",
    passwordLabel: "密码",
    passwordPlaceholder: "密码",
    loginBtn: "登录",
    or: "或",
    continueWithGoogle: "使用 Google 继续",
    continueWithFacebook: "使用 Facebook 继续",
    noAccount: "没有账户？",
    signup: "注册",
    loginSuccess: "登录成功",
    loginFailed: "登录失败",
    googleAuthFailed: "谷歌身份验证失败",
    facebookLoginFailed: "Facebook 登录失败",
  },
  fr: {
    title: "Connexion ou inscription",
    welcome: "Bienvenue sur Lorepa",
    emailLabel: "E-mail",
    emailPlaceholder: "Adresse e-mail",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Se connecter",
    or: "Ou",
    continueWithGoogle: "Continuer avec Google",
    continueWithFacebook: "Continuer avec Facebook",
    noAccount: "Vous n'avez pas de compte ?",
    signup: "S'inscrire",
    loginSuccess: "Connexion réussie",
    loginFailed: "Échec de la connexion",
    googleAuthFailed: "Échec de l'authentification Google",
    facebookLoginFailed: "Échec de la connexion avec Facebook",
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return loginTranslations[storedLang] || loginTranslations.fr;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      setTranslations(loginTranslations[storedLang] || loginTranslations.fr);
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const role = params.get('role');
    const googleLogin = params.get('googleLogin');

    if (googleLogin === 'success' && userId && role) {
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      toast.success(translations.loginSuccess);

      const navigateTo = localStorage.getItem("naviagte");
      if (navigateTo) {
        nav(navigateTo);
      } else {
        if (role === 'owner') nav("/seller/dashboard/home");
        else nav("/user/dashboard/home");
      }
    } else if (params.get('error') === 'google_failed') {
      toast.error(translations.googleAuthFailed);
    }
  }, [nav, translations.loginSuccess, translations.googleAuthFailed]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      const res = await axios.post(`${config.baseUrl}/account/login`, { email, password });
      if (res.data?.code === 200) {
        localStorage.setItem('userId', res.data.data._id);
        localStorage.setItem('role', res.data.data.role);
        toast.success(translations.loginSuccess);
        setTimeout(() => {
          if (localStorage.getItem("naviagte")) {
            nav(localStorage.getItem("naviagte"));
          } else {
            nav("/");
          }
        }, 2000);
      } else {
        toast.error(res.data?.msg || translations.loginFailed);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.loginFailed);
    }
  };

  const handleGoogleRedirect = () => {
    window.location.href = `${config.baseUrl}/account/google`;
  };

  const handleFacebookAuth = async ({ data }) => {
    if (!data.email) {
      toast.error(translations.facebookLoginFailed);
      return;
    }
    const fbEmail = data.email;
    const fbPassword = data.id;
    try {
      const res = await axios.post(`${config.baseUrl}/account/login`, { email: fbEmail, password: fbPassword });
      localStorage.setItem('userId', res.data.data._id);
      toast.success(translations.loginSuccess);
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.loginFailed);
    }
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center mobile-px relative py-12'>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className='absolute top-6 left-6 lg:top-8 lg:left-12 mb-4 lg:mb-0'>
        <Link to={"/"}><img src={Logo} alt="logo" className='h-16 sm:h-20 w-auto' /></Link>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className='p-6 sm:p-8 md:p-10 w-full max-w-md'>
        <motion.h2 variants={fadeInUp} className='text-xl mb-2'>{translations.title}</motion.h2>
        <motion.p variants={fadeInUp} className='text-sm mb-8'>{translations.welcome}</motion.p>

        <motion.form onSubmit={handleLogin} className='space-y-4' variants={stagger}>
          <motion.div variants={fadeInUp} className="mobile-form-group">
            <label className='mobile-form-label'>{translations.emailLabel}</label>
            <input type='text' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={translations.emailPlaceholder} className='mobile-input' />
          </motion.div>
          <motion.div variants={fadeInUp} className="mobile-form-group">
            <label className='mobile-form-label'>{translations.passwordLabel}</label>
            <input type='password' required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={translations.passwordPlaceholder} className='mobile-input' />
          </motion.div>
          <motion.div variants={fadeInUp} className="text-right mb-4 -mt-3">
            <Link to="/forget-password" alt="Forgot Password?" className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm">
              Forgot Password?
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <button type='submit' className='mobile-btn-primary w-full'>{translations.loginBtn}</button>
          </motion.div>
        </motion.form>

        <motion.div variants={fadeInUp} className='relative mt-6 mb-6'>
          <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-gray-300' /></div>
          <div className='relative flex justify-center text-sm'><span className='px-2 bg-white text-gray-500'>{translations.or}</span></div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleRedirect}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            <FaGoogle className="text-red-500 w-5 h-5" />
            {translations.continueWithGoogle}
          </button>
          {/* <LoginSocialFacebook
            appId="1463083271394413"
            fields="name,email,picture"
            onResolve={handleFacebookAuth}
            onReject={() => toast.error(translations.facebookLoginFailed)}
          >
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-700 text-white rounded-md">
              <FaFacebookF /> {translations.continueWithFacebook}
            </button>
          </LoginSocialFacebook> */}
        </div>
        <motion.div variants={fadeInUp} className='mt-8 text-center text-sm'>
          <p>{translations.noAccount} <Link to={"/register"} className='text-blue-600 hover:text-blue-500'>{translations.signup}</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
