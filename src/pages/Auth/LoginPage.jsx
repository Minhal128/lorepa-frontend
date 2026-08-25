import React, { useState, useEffect } from 'react';
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LoginSocialFacebook } from 'reactjs-social-login';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMenu, FiArrowRight,
  FiTruck, FiAward, FiHeadphones,
} from 'react-icons/fi';
import { CiGlobe } from 'react-icons/ci';
import config from '../../config';
import Logo from '../../assets/logo.svg';
import { fetchOnboarding } from '../../helpers/onboarding';

// The card sits over the dim sky / dark grass half of login.png (measured luminance
// 40-130), so it needs the opaque /70 frost, not the /45 the bright OTP background took.
const card = 'bg-white rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.16)]';
const pill = 'h-10 w-10 rounded-[12px] bg-white/70 backdrop-blur-sm border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center lg:bg-white/15 lg:border-white/90 lg:text-white';
const navOutline = 'hidden md:flex h-11 px-5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] text-[14px] font-semibold items-center hover:bg-[#2563EB]/10 lg:border-white lg:text-white lg:hover:bg-white/10';
const bar = 'bg-black/55 backdrop-blur-[20px] border border-white/20';
const field = 'w-full h-12 pl-11 rounded-xl bg-white border border-[#E5E7EB] text-[14px] text-black placeholder:text-black/40 outline-none focus:border-[#2563EB]';

// ponytail: same mark as RegisterPage; 8 inline lines beat a shared component for two callers
const GoogleG = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.6 6.5l6.3 5.3C37.4 41.4 44 36.5 44 24c0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

const loginTranslations = {
  en: {
    title: "Login Or Signup",
    welcome: "Welcome to Lorepa",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginBtn: "Sign In",
    or: "OR",
    continueWithGoogle: "Continue with Google",
    continueWithFacebook: "Continue with Facebook",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    loginSuccess: "Login Successful",
    loginFailed: "Login failed",
    googleAuthFailed: "Google Authentication Failed",
    facebookLoginFailed: "Facebook login failed",
    kicker: "TRAILER RENTAL, REINVENTED",
    h1a: "Glad to see you again",
    h1b: "Your rental",
    h1c: "is waiting for you",
    desc: "Sign in to access your bookings, manage listings, and hit the road with confidence.",
    welcomeBack: "Welcome Back",
    cardSub: "Sign in to continue to Lorepa",
    rememberMe: "Remember me",
    forgot: "Forgot password?",
    signUpNav: "Sign Up",
    logInNav: "Log In",
    b1t: "Wide Selection", b1d: "Browse from thousands of trailers.",
    b2t: "Best Prices", b2d: "Competitive rates guaranteed.",
    b3t: "24/7 Support", b3d: "We're here to help anytime.",
    whoAreWe: "Who are we",
    contactUs: "Contact us",
    calculator: "How much can you earn?",
    langEn: "English", langEs: "Spanish", langCn: "Chinese", langFr: "French",
  },
  es: {
    title: "Iniciar sesión o registrarse",
    welcome: "Bienvenido a Lorepa",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Introduce tu correo",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
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
    kicker: "ALQUILER DE REMOLQUES, REINVENTADO",
    h1a: "Remolques cerca.",
    h1b: "Alquiler fácil.",
    h1c: "¡Primera comunidad quebequense!",
    desc: "Inicia sesión para ver tus reservas, gestionar anuncios y salir a la carretera con confianza.",
    welcomeBack: "Bienvenido de nuevo",
    cardSub: "Inicia sesión para continuar en Lorepa",
    rememberMe: "Recordarme",
    forgot: "¿Olvidaste tu contraseña?",
    signUpNav: "Registrarse",
    logInNav: "Iniciar sesión",
    b1t: "Amplia Selección", b1d: "Explora entre miles de remolques.",
    b2t: "Mejores Precios", b2d: "Tarifas competitivas garantizadas.",
    b3t: "Soporte 24/7", b3d: "Estamos aquí para ayudarte.",
    whoAreWe: "Quiénes somos",
    contactUs: "Contáctanos",
    calculator: "¿Cuánto puedes ganar?",
    langEn: "Inglés", langEs: "Español", langCn: "Chino", langFr: "Francés",
  },
  cn: {
    title: "登录或注册",
    welcome: "欢迎来到 Lorepa",
    emailLabel: "电子邮件地址",
    emailPlaceholder: "请输入您的邮箱",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入您的密码",
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
    kicker: "拖车租赁，焕然一新",
    h1a: "附近拖车。",
    h1b: "轻松租赁。",
    h1c: "魁北克首个社区！",
    desc: "登录即可查看预订、管理房源，安心上路。",
    welcomeBack: "欢迎回来",
    cardSub: "登录以继续使用 Lorepa",
    rememberMe: "记住我",
    forgot: "忘记密码？",
    signUpNav: "注册",
    logInNav: "登录",
    b1t: "多样选择", b1d: "浏览数千辆拖车。",
    b2t: "优惠价格", b2d: "保证有竞争力的价格。",
    b3t: "全天候支持", b3d: "我们随时为您提供帮助。",
    whoAreWe: "关于我们",
    contactUs: "联系我们",
    calculator: "您能赚多少？",
    langEn: "英语", langEs: "西班牙语", langCn: "中文", langFr: "法语",
  },
  fr: {
    title: "Content de vous revoir",
    welcome: "Votre location. N'attends plus que vous.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "Entrez votre e-mail",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    loginBtn: "Se connecter",
    or: "OU",
    continueWithGoogle: "Continuer avec Google",
    continueWithFacebook: "Continuer avec Facebook",
    noAccount: "Vous n'avez pas de compte ?",
    signup: "S'inscrire",
    loginSuccess: "Connexion réussie",
    loginFailed: "Échec de la connexion",
    googleAuthFailed: "Échec de l'authentification Google",
    facebookLoginFailed: "Échec de la connexion avec Facebook",
    kicker: "LA LOCATION DE REMORQUES, RÉINVENTÉE",
    h1a: "Content de vous revoir",
    h1b: "Votre location",
    h1c: "N'attends plus que vous.",
    desc: "Connectez-vous pour accéder à vos réservations, gérer vos annonces et prendre la route en toute confiance.",
    welcomeBack: "Bon retour",
    cardSub: "Connectez-vous pour continuer sur Lorepa",
    rememberMe: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    signUpNav: "S'inscrire",
    logInNav: "Connexion",
    b1t: "Large Sélection", b1d: "Parcourez des milliers de remorques.",
    b2t: "Meilleurs Prix", b2d: "Des tarifs compétitifs garantis.",
    b3t: "Assistance 24/7", b3d: "Nous sommes là pour vous aider.",
    whoAreWe: "Qui sommes-nous",
    contactUs: "Contactez-nous",
    calculator: "Combien pouvez-vous gagner ?",
    langEn: "Anglais", langEs: "Espagnol", langCn: "Chinois", langFr: "Français",
  }
};

const getDashboardPath = (role) => (
  role === 'owner' ? "/seller/dashboard/home" : "/user/dashboard/home"
);

const goAfterAuth = async (nav, role) => {
  const navigateTo = localStorage.getItem("naviagte");
  if (navigateTo) {
    nav(navigateTo);
    return;
  }
  if (role !== 'owner') {
    nav(getDashboardPath(role));
    return;
  }
  try {
    const progress = await fetchOnboarding(localStorage.getItem('userId'));
    nav(progress.percent < 100 ? '/onboarding' : getDashboardPath(role));
  } catch {
    nav(getDashboardPath(role));
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberEmail') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => !!localStorage.getItem('rememberEmail'));
  const [showPass, setShowPass] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
    window.addEventListener('app-language-changed', handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-language-changed', handleStorageChange);
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
      goAfterAuth(nav, role);
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
        // only the address is kept, never the password
        if (remember) localStorage.setItem('rememberEmail', email);
        else localStorage.removeItem('rememberEmail');
        toast.success(translations.loginSuccess);
        setTimeout(() => goAfterAuth(nav, res.data.data.role), 2000);
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
      localStorage.setItem('role', res.data.data.role);
      toast.success(translations.loginSuccess);
      await goAfterAuth(nav, res.data.data.role);
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.loginFailed);
    }
  };

  const handleLanguageChange = (langSymbol) => {
    localStorage.setItem('lang', langSymbol);
    localStorage.setItem('i18nextLng', langSymbol);
    window.dispatchEvent(new CustomEvent('app-language-changed', { detail: { lang: langSymbol } }));
    setShowLanguages(false);
    window.location.reload();
  };

  const bottom = [
    { Icon: FiTruck, t: translations.b1t, d: translations.b1d },
    { Icon: FiAward, t: translations.b2t, d: translations.b2d },
    { Icon: FiHeadphones, t: translations.b3t, d: translations.b3d },
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden text-black bg-gradient-to-b from-[#F5F9FF] via-[#DBEAFE] to-[#BFDBFE] lg:bg-[url('/login.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat"
    >
      <div className="relative z-10 w-full min-h-screen flex flex-col px-4 sm:px-8 lg:px-12 pb-8">
        <header className="shrink-0 flex items-center justify-between py-2">
          <Link to="/" className="shrink-0">
            <img src={Logo} alt="Lorepa" className="h-11 sm:h-16 lg:h-20 w-auto" />
          </Link>
          <div className="relative flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setShowLanguages((v) => !v)} className={pill} aria-label="Change language">
              <CiGlobe className="w-5 h-5" />
            </button>
            <Link to="/register" className={navOutline}>{translations.signUpNav}</Link>
            <button type="button" onClick={() => setShowMenu((v) => !v)} className={pill} aria-label="Menu">
              <FiMenu className="w-5 h-5" />
            </button>
            {showLanguages && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white overflow-hidden z-30 shadow-lg">
                {[['en', translations.langEn], ['es', translations.langEs], ['cn', translations.langCn], ['fr', translations.langFr]].map(([code, label]) => (
                  <button key={code} onClick={() => handleLanguageChange(code)} className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-black/5">
                    {label}
                  </button>
                ))}
              </div>
            )}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white overflow-hidden z-30 shadow-lg">
                {[['/who', translations.whoAreWe], ['/contact', translations.contactUs], ['/calculator', translations.calculator]].map(([to, label]) => (
                  <Link key={to} to={to} className="block px-4 py-2.5 text-sm text-black hover:bg-black/5">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-5 lg:gap-10 items-stretch">
          <div className="w-full min-w-0 flex flex-col items-start text-left pt-1 lg:pt-10 lg:pl-8 lg:justify-between">
            <div>
              <p className="text-[#2563EB] text-[11px] sm:text-[12px] font-bold tracking-[0.18em]">{translations.kicker}</p>
              <h1 className="mt-2 max-w-[520px] text-[28px] sm:text-[40px] xl:text-[48px] font-extrabold leading-[1.12] tracking-tight text-[#0A0F18]">
                <span className="block">{translations.h1a}</span>
                <span className="block">{translations.h1b}</span>
                <span className="block text-[#2563EB]">{translations.h1c}</span>
              </h1>
              <p className="mt-3 max-w-[380px] text-[#0A0F18]/70 text-[14px] sm:text-[16px] leading-[1.55]">{translations.desc}</p>
              <img src="/login.png" alt="" className="lg:hidden mt-5 w-full h-44 object-cover rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.18)]" />
            </div>
            <div className={`${bar} hidden lg:grid mt-10 mb-6 w-full max-w-[720px] rounded-2xl px-5 py-4 grid-cols-3 gap-4 divide-x divide-white/15`}>
              {bottom.map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-3 min-w-0 pl-4 first:pl-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 text-[#2563EB]">
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[13px] leading-tight text-white">{t}</span>
                    <span className="block text-[12px] text-white/75 leading-snug mt-1">{d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${card} w-full max-w-[440px] lg:max-w-none px-5 sm:px-8 py-6 sm:py-8 text-black`}>
            <div className="flex flex-col items-center">
              <span className="h-14 w-14 rounded-full border-2 border-[#93C5FD] bg-[#EFF6FF] flex items-center justify-center">
                <FiUser className="w-7 h-7 text-[#2563EB]" strokeWidth={1.7} />
              </span>
              <h2 className="mt-3 [@media(min-height:900px)]:mt-5 text-[26px] font-extrabold tracking-tight">{translations.welcomeBack}</h2>
              <p className="text-[15px] text-black/65 mt-1.5">{translations.cardSub}</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleRedirect}
              className="w-full h-[52px] mt-4 [@media(min-height:900px)]:mt-7 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center gap-3 text-[15px] font-semibold text-black transition hover:bg-black/[0.02]"
            >
              <GoogleG /> {translations.continueWithGoogle}
            </button>

            <div className="flex items-center gap-4 my-3 [@media(min-height:900px)]:my-6">
              <div className="h-px flex-1 bg-black/15" />
              <span className="text-[12px] font-semibold tracking-wider text-black/50 uppercase">{translations.or}</span>
              <div className="h-px flex-1 bg-black/15" />
            </div>

            <form onSubmit={handleLogin} className="space-y-2.5 [@media(min-height:900px)]:space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-[13px] font-semibold text-black/80 mb-2">{translations.emailLabel}</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/45" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.emailPlaceholder}
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-[13px] font-semibold text-black/80 mb-2">{translations.passwordLabel}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/45" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={translations.passwordPlaceholder}
                    className={`${field} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/45 hover:text-black"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <FiEye className="w-[18px] h-[18px]" /> : <FiEyeOff className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-[14px] text-black/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-[18px] w-[18px] rounded accent-[#2563EB] cursor-pointer"
                  />
                  {translations.rememberMe}
                </label>
                <Link to="/forget-password" className="text-[14px] text-[#2563EB] font-medium hover:underline">
                  {translations.forgot}
                </Link>
              </div>

              <button
                type="submit"
                className="relative w-full h-[56px] !mt-5 [@media(min-height:900px)]:!mt-7 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-[16px] font-semibold flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition"
              >
                {translations.loginBtn}
                <FiArrowRight className="absolute right-6 w-5 h-5" />
              </button>
            </form>

            <p className="mt-4 [@media(min-height:900px)]:mt-6 text-center text-[15px] text-black/70">
              {translations.noAccount}{' '}
              <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">{translations.signup}</Link>
            </p>

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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
