import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import toast from 'react-hot-toast';
import {
  FiTruck, FiAward, FiHeadphones, FiMenu,
  FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiChevronDown, FiArrowRight, FiMapPin, FiHome,
} from 'react-icons/fi';
import { CiGlobe } from 'react-icons/ci';
import Logo from '../../assets/logo.svg';

const card = 'bg-white rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.16)]';
const pill = 'h-10 w-10 rounded-[12px] bg-white/70 backdrop-blur-sm border border-[#2563EB]/25 text-[#2563EB] flex items-center justify-center lg:bg-white/15 lg:border-white/90 lg:text-white';
const navOutline = 'hidden md:flex h-11 px-5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] text-[14px] font-semibold items-center hover:bg-[#2563EB]/10 lg:border-white lg:text-white lg:hover:bg-white/10';
const bar = 'bg-black/55 backdrop-blur-[20px] border border-white/20';
const glassField = 'peer w-full h-11 pl-11 pr-10 pt-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[14px] text-black outline-none transition-colors focus:border-[#2563EB]';

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.5-6.6 6.5l6.3 5.3C37.4 41.4 44 36.5 44 24c0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

const registerTranslations = {
  en: {
    title: "Create Your Account",
    subtitle: "Join thousands of satisfied customers",
    kicker: "TRAILER RENTAL, REINVENTED",
    headlineBefore: "Trailers nearby.",
    headlineAccent: "Easy rental.",
    headlineAfter: "Quebec’s first community!",
    desc: "Create your account and start your journey today.",
    f1t: "Secure & Trusted", f1d: "Your data is always safe",
    f2t: "Quick & Easy", f2d: "Sign up in just seconds",
    f3t: "Verified Platform", f3d: "Trusted by 100+ members",
    f4t: "Active Community", f4d: "Join thousands of satisfied customers",
    b1t: "Wide Selection", b1d: "Browse from thousands of trailers",
    b2t: "Best Prices", b2d: "Competitive rates guaranteed",
    b3t: "24/7 Support", b3d: "We're here to help anytime",
    badge: "Rated 5.0/5 by 100+ members",
    s1v: "+100", s1l: "Active members",
    s2v: "Quebec", s2l: "Local community",
    s3v: "5.0/5", s3l: "Average rating",
    continueWithGoogle: "Continue with Google",
    or: "OR",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email",
    country: "Country",
    state: "State",
    city: "City",
    postalCode: "Postal Code",
    address: "Address",
    address2: "Address 2",
    password: "Password",
    confirmPassword: "Confirm Password",
    role: "Role",
    renter: "Locataire",
    owner: "Propriétaire",
    registerBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Log in",
    logIn: "Log In",
    signUpNav: "Sign Up",
    successToast: "Account created successfully!",
    failToast: "Registration failed",
    errorToast: "Something went wrong",
    googleSignupFail: "Google signup failed",
    facebookSignupFail: "Facebook signup failed",
    googleSelected: "Google account selected. Please fill the remaining details.",
    facebookSelected: "Facebook account selected. Please fill the remaining details.",
    passwordMismatch: "Passwords do not match",
    whoAreWe: "Who are we",
    contactUs: "Contact us",
    calculator: "How much can you earn?",
    langEn: "English", langEs: "Spanish", langCn: "Chinese", langFr: "French",
    dashboard: "Dashboard",
    logout: "Logout",
  },
  es: {
    title: "Crea tu cuenta",
    subtitle: "Únete a miles de clientes satisfechos",
    kicker: "ALQUILER DE REMOLQUES, REINVENTADO",
    headlineBefore: "Remolques cerca.",
    headlineAccent: "Alquiler fácil.",
    headlineAfter: "¡Primera comunidad quebequense!",
    desc: "Crea tu cuenta y empieza tu viaje hoy.",
    f1t: "Seguro y de confianza", f1d: "Tus datos siempre están a salvo",
    f2t: "Rápido y fácil", f2d: "Regístrate en segundos",
    f3t: "Plataforma verificada", f3d: "Confiada por más de 100 miembros",
    f4t: "Comunidad activa", f4d: "Únete a miles de clientes satisfechos",
    b1t: "Gran selección", b1d: "Miles de remolques",
    b2t: "Mejores precios", b2d: "Tarifas competitivas",
    b3t: "Soporte 24/7", b3d: "Estamos para ayudarte",
    badge: "Valorado 5.0/5 por más de 100 miembros",
    s1v: "+100", s1l: "Miembros activos",
    s2v: "Quebec", s2l: "Comunidad local",
    s3v: "5.0/5", s3l: "Valoración media",
    continueWithGoogle: "Continuar con Google",
    or: "O",
    fullName: "Nombre completo",
    phone: "Número de teléfono",
    email: "Correo electrónico",
    country: "País",
    state: "Estado",
    city: "Ciudad",
    postalCode: "Código Postal",
    address: "Dirección",
    address2: "Dirección 2",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    role: "Rol",
    renter: "Arrendatario",
    owner: "Propietario",
    registerBtn: "Crear cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signIn: "Iniciar sesión",
    logIn: "Iniciar sesión",
    signUpNav: "Registrarse",
    successToast: "¡Cuenta creada con éxito!",
    failToast: "Registro fallido",
    errorToast: "Algo salió mal",
    googleSignupFail: "Registro con Google fallido",
    facebookSignupFail: "Registro con Facebook fallido",
    googleSelected: "Cuenta de Google seleccionada. Por favor, rellene los detalles restantes.",
    facebookSelected: "Cuenta de Facebook seleccionada. Por favor, rellene los detalles restantes.",
    passwordMismatch: "Las contraseñas no coinciden",
    whoAreWe: "¿Quiénes somos?",
    contactUs: "Contáctanos",
    calculator: "¿Cuánto se gana?",
    langEn: "Inglés", langEs: "Español", langCn: "Chino", langFr: "Francés",
    dashboard: "Panel de Control",
    logout: "Cerrar sesión",
  },
  cn: {
    title: "创建账户",
    subtitle: "加入成千上万满意的客户",
    kicker: "拖车租赁，全新体验",
    headlineBefore: "附近拖车。",
    headlineAccent: "轻松租赁。",
    headlineAfter: "魁北克首个社区！",
    desc: "创建账户，立即开始。",
    f1t: "安全可信", f1d: "您的数据始终安全",
    f2t: "快速简单", f2d: "几秒即可注册",
    f3t: "认证平台", f3d: "超过1万用户信赖",
    f4t: "活跃社区", f4d: "加入成千上万满意客户",
    b1t: "丰富选择", b1d: "浏览数千辆拖车",
    b2t: "最优价格", b2d: "有竞争力的价格",
    b3t: "全天候支持", b3d: "随时为您提供帮助",
    badge: "超过 100 位会员评分 5.0/5",
    s1v: "+100", s1l: "活跃会员",
    s2v: "Quebec", s2l: "本地社区",
    s3v: "5.0/5", s3l: "平均评分",
    continueWithGoogle: "使用 Google 继续",
    or: "或",
    fullName: "全名",
    phone: "电话号码",
    email: "电子邮件",
    country: "国家",
    state: "州/省",
    city: "城市",
    postalCode: "邮政编码",
    address: "地址",
    address2: "地址 2",
    password: "密码",
    confirmPassword: "确认密码",
    role: "角色",
    renter: "租客",
    owner: "车主",
    registerBtn: "创建账户",
    alreadyHaveAccount: "已有账户？",
    signIn: "登录",
    logIn: "登录",
    signUpNav: "注册",
    successToast: "账户创建成功！",
    failToast: "注册失败",
    errorToast: "出了点问题",
    googleSignupFail: "谷歌注册失败",
    facebookSignupFail: "Facebook 注册失败",
    googleSelected: "已选择谷歌账户。请填写剩余信息。",
    facebookSelected: "已选择 Facebook 账户。请填写剩余信息。",
    passwordMismatch: "两次密码不一致",
    whoAreWe: "我们是谁",
    contactUs: "联系我们",
    calculator: "能赚多少？",
    langEn: "英语", langEs: "西班牙语", langCn: "中文", langFr: "法语",
    dashboard: "仪表板",
    logout: "注销",
  },
  fr: {
    title: "Créer votre compte",
    subtitle: "Rejoignez la première communauté québécoise",
    kicker: "LA LOCATION DE REMORQUES, RÉINVENTÉE",
    headlineBefore: "Remorques proches.",
    headlineAccent: "Location facile.",
    headlineAfter: "Première communauté, Québécoise !",
    desc: "Créez votre compte pour accéder à vos réservations, gérer vos annonces et prendre la route en toute confiance.",
    f1t: "Sécurisé et fiable", f1d: "Vos données sont toujours protégées",
    f2t: "Rapide et simple", f2d: "Inscrivez-vous en quelques secondes",
    f3t: "Plateforme vérifiée", f3d: "Approuvée par +100 membres",
    f4t: "Communauté active", f4d: "La première communauté québécoise",
    b1t: "Large sélection", b1d: "Parcourez des milliers de remorques.",
    b2t: "Meilleurs prix", b2d: "Des tarifs compétitifs au Québec.",
    b3t: "Assistance 24/7", b3d: "Nous sommes là pour vous aider.",
    badge: "Noté 5.0/5 par +100 membres",
    s1v: "+100", s1l: "Membres actifs",
    s2v: "Québec", s2l: "Communauté locale",
    s3v: "5.0/5", s3l: "Note moyenne",
    continueWithGoogle: "Continuer avec Google",
    or: "OU",
    fullName: "Nom complet",
    phone: "Numéro de téléphone",
    email: "E-mail",
    country: "Pays",
    state: "Province",
    city: "Ville",
    postalCode: "Code postal",
    address: "Adresse",
    address2: "Adresse 2",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    role: "Rôle",
    renter: "Locataire",
    owner: "Propriétaire",
    registerBtn: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signIn: "Se connecter",
    logIn: "Connexion",
    signUpNav: "S'inscrire",
    successToast: "Compte créé avec succès !",
    failToast: "Échec de l'inscription",
    errorToast: "Quelque chose a mal tourné",
    googleSignupFail: "Échec de l'inscription Google",
    facebookSignupFail: "Échec de l'inscription Facebook",
    googleSelected: "Compte Google sélectionné. Veuillez remplir les détails restants.",
    facebookSelected: "Compte Facebook sélectionné. Veuillez remplir les détails restants.",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    whoAreWe: "Qui sommes-nous",
    contactUs: "Nous contacter",
    calculator: "Ça rapporte combien ?",
    langEn: "Anglais", langEs: "Espagnol", langCn: "Chinois", langFr: "Français",
    dashboard: "Tableau de Bord",
    logout: "Se déconnecter",
  },
};

// Label floats to the top once the control holds a value; a <select> never matches
// :placeholder-shown, so its label stays pinned up like the Role field in the design.
const Field = ({ icon: Icon, label, right, required = true, children }) => (
  <div className="relative">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-black/70 pointer-events-none">
      <Icon className="w-[17px] h-[17px]" strokeWidth={1.8} />
    </span>
    {children}
    <label className="pointer-events-none absolute left-11 top-[5px] text-[9px] font-medium text-black/60 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px] peer-focus:top-[5px] peer-focus:translate-y-0 peer-focus:text-[9px]">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {right}
  </div>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('renter');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return registerTranslations[storedLang] || registerTranslations.fr;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      setTranslations(registerTranslations[storedLang] || registerTranslations.fr);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('app-language-changed', handleStorageChange);
    const savedEmail = localStorage.getItem('socialEmail');
    const savedPass = localStorage.getItem('socialPassword');
    const savedName = localStorage.getItem('socialName');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(savedPass);
      setConfirmPassword(savedPass);
      if (savedName) setName(savedName);
    }
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-language-changed', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const roleParam = params.get('role');
    const googleLogin = params.get('googleLogin');

    if (googleLogin === 'success' && userId && roleParam) {
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', roleParam);
      toast.success(translations.successToast);
      nav(localStorage.getItem('naviagte') || '/');
    } else if (params.get('error') === 'google_failed') {
      toast.error(translations.googleSignupFail);
    }
  }, [nav, translations.successToast, translations.googleSignupFail]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (password !== confirmPassword) {
      toast.error(translations.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${config.baseUrl}/account/register`, {
        name, phone, email, password, role, country, state, city, postalCode, address, street,
      });
      if (res.data?.status === 200 || res.data?.code === 200) {
        localStorage.removeItem('socialEmail');
        localStorage.removeItem('socialPassword');
        localStorage.removeItem('socialName');
        localStorage.setItem('userId', res.data.data._id);
        localStorage.setItem('role', res.data.data.role);
        localStorage.setItem('uEmail', email);
        toast.success(translations.successToast);
        setTimeout(() => nav('/verify'), 2000);
      } else {
        toast.error(res.data?.msg || translations.failToast);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.errorToast);
    } finally {
      setLoading(false);
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

  const eyeBtn = (on, set) => (
    <button type="button" onClick={() => set(!on)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 hover:text-black" aria-label="Toggle password">
      {on ? <FiEye className="w-[18px] h-[18px]" /> : <FiEyeOff className="w-[18px] h-[18px]" />}
    </button>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden text-black bg-gradient-to-b from-[#F5F9FF] via-[#DBEAFE] to-[#BFDBFE] lg:bg-[url('/signup.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat"
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
            <Link to="/login" className={navOutline}>{translations.logIn}</Link>
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

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_min(100%,640px)] gap-5 lg:gap-10 items-stretch">
          <div className="w-full min-w-0 flex flex-col items-start text-left pt-1 lg:pt-10 lg:pl-8 lg:justify-between">
            <div>
              <p className="text-[#2563EB] text-[11px] sm:text-[12px] font-bold tracking-[0.18em]">{translations.kicker}</p>
              <h1 className="mt-2 max-w-[520px] text-[28px] sm:text-[40px] xl:text-[48px] font-extrabold leading-[1.12] tracking-tight text-[#0A0F18]">
                <span className="block">{translations.headlineBefore}</span>
                <span className="block">{translations.headlineAccent}</span>
                <span className="block text-[#2563EB]">{translations.headlineAfter}</span>
              </h1>
              <p className="mt-3 max-w-[380px] text-[#0A0F18]/70 text-[14px] sm:text-[16px] leading-[1.55]">{translations.desc}</p>
              <img src="/signup.png" alt="" className="lg:hidden mt-5 w-full h-44 object-cover rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.18)]" />
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

          <div className={`${card} w-full max-w-[440px] lg:max-w-none px-5 sm:px-6 py-5 sm:py-6 text-black`}>
            <div className="flex flex-col items-center mb-3">
              <span className="h-14 w-14 rounded-full border-2 border-[#93C5FD] bg-[#EFF6FF] flex items-center justify-center">
                <FiUser className="w-6 h-6 text-[#2563EB]" strokeWidth={1.7} />
              </span>
              <h2 className="mt-3 text-[22px] leading-tight font-extrabold tracking-tight text-black text-center">{translations.title}</h2>
              <p className="text-[13px] text-black/60 mt-1 text-center">{translations.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => { window.location.href = `${config.baseUrl}/account/google`; }}
              className="w-full h-11 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center gap-3 text-[14px] font-semibold text-black transition hover:bg-black/[0.02]"
            >
              <GoogleG /> {translations.continueWithGoogle}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px flex-1 bg-black/15" />
              <span className="text-[11px] font-semibold tracking-wider text-black/50">{translations.or}</span>
              <div className="h-px flex-1 bg-black/15" />
            </div>

            <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field icon={FiUser} label={translations.fullName}>
                <input required placeholder=" " value={name} onChange={(e) => setName(e.target.value)} className={glassField} />
              </Field>
              <Field icon={FiPhone} label={translations.phone}>
                <input type="tel" required placeholder=" " value={phone} onChange={(e) => setPhone(e.target.value)} className={glassField} />
              </Field>
              <div className="sm:col-span-2">
                <Field icon={FiMail} label={translations.email}>
                  <input type="email" required placeholder=" " value={email} disabled={!!localStorage.getItem('socialEmail')} onChange={(e) => setEmail(e.target.value)} className={`${glassField} disabled:opacity-70`} />
                </Field>
              </div>
              <Field icon={FiMapPin} label={translations.country}>
                <input required placeholder=" " value={country} onChange={(e) => setCountry(e.target.value)} className={glassField} />
              </Field>
              <Field icon={FiMapPin} label={translations.state}>
                <input required placeholder=" " value={state} onChange={(e) => setState(e.target.value)} className={glassField} />
              </Field>
              <Field icon={FiMapPin} label={translations.city}>
                <input required placeholder=" " value={city} onChange={(e) => setCity(e.target.value)} className={glassField} />
              </Field>
              <Field icon={FiMapPin} label={translations.postalCode}>
                <input required placeholder=" " value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={glassField} />
              </Field>
              <div className="sm:col-span-2">
                <Field icon={FiHome} label={translations.address}>
                  <input required placeholder=" " value={address} onChange={(e) => setAddress(e.target.value)} className={glassField} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field icon={FiHome} label={translations.address2} required={false}>
                  <input placeholder=" " value={street} onChange={(e) => setStreet(e.target.value)} className={glassField} />
                </Field>
              </div>
              <Field icon={FiLock} label={translations.password} right={eyeBtn(showPass, setShowPass)}>
                <input type={showPass ? 'text' : 'password'} required placeholder=" " value={password} disabled={!!localStorage.getItem('socialPassword')} onChange={(e) => setPassword(e.target.value)} className={`${glassField} disabled:opacity-70`} />
              </Field>
              <Field icon={FiLock} label={translations.confirmPassword} right={eyeBtn(showConfirm, setShowConfirm)}>
                <input type={showConfirm ? 'text' : 'password'} required placeholder=" " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={glassField} />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  icon={FiBriefcase}
                  label={translations.role}
                  right={<FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/50 pointer-events-none" />}
                >
                  <select required value={role} onChange={(e) => setRole(e.target.value)} className={`${glassField} appearance-none`}>
                    <option value="renter">{translations.renter}</option>
                    <option value="owner">{translations.owner}</option>
                  </select>
                </Field>
              </div>
              <button type="submit" disabled={loading} className="sm:col-span-2 w-full h-11 mt-1 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-70 disabled:pointer-events-none text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition">
                {loading && <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />}
                {translations.registerBtn}
                {!loading && <FiArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="mt-2 text-center text-[13px] text-black/70">
              {translations.alreadyHaveAccount}{' '}
              <Link to="/login" className="text-[#2563EB] font-semibold">{translations.signIn}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
