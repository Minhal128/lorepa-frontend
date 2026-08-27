import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiArrowRight, FiClock, FiLock, FiMenu, FiShield, FiZap, FiCheck, FiEdit2 } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import config from "../../config";
import Logo from "../../assets/logo.svg";

const glass = "bg-black/55 backdrop-blur-[20px] backdrop-saturate-150 border border-white/25";
const pill = "h-10 rounded-xl bg-white/85 backdrop-blur-md border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-black flex items-center justify-center";
const card = "bg-white/70 backdrop-blur-[20px] backdrop-saturate-150 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";
const OTP_LEN = 6;
const RESEND_COOLDOWN = 60; // seconds before Resend re-arms; code expiry comes from the API

const otpTranslations = {
  en: {
    title: "Verify OTP",
    verifyBtn: "Verify & Continue",
    resendOtp: "Resend Code",
    logIn: "Log In",
    kicker: "VERIFY YOUR NUMBER",
    headline: "Just One Step Away!",
    sentTo: "We've sent a 6-digit code to",
    cardHint: "Enter the 6-digit code sent to",
    expires: "Code expires in",
    trust: "Your verification code is safe with us. We never share your information.",
    f1t: "Secure & Private", f1d: "Your data is protected with industry-leading security.",
    f2t: "Quick Verification", f2d: "Takes less than 30 seconds to get you verified.",
    f3t: "Trusted Platform", f3d: "Join thousands of verified customers today.",
    whoAreWe: "Who are we",
    contactUs: "Contact us",
    calculator: "How much can you earn?",
    enterOtp: "Please enter OTP",
    ok: "OTP Verified",
    fail: "OTP verification failed",
    resent: "OTP resent successfully",
    resendFail: "Failed to resend OTP",
  },
  es: {
    title: "Verificar OTP",
    verifyBtn: "Verificar y continuar",
    resendOtp: "Reenviar código",
    logIn: "Iniciar sesión",
    kicker: "VERIFICA TU NÚMERO",
    headline: "¡Solo un paso más!",
    sentTo: "Hemos enviado un código de 6 dígitos a",
    cardHint: "Ingresa el código de 6 dígitos enviado a",
    expires: "El código caduca en",
    trust: "Tu código está seguro con nosotros. Nunca compartimos tu información.",
    f1t: "Seguro y privado", f1d: "Tus datos están protegidos con seguridad de primer nivel.",
    f2t: "Verificación rápida", f2d: "Toma menos de 30 segundos verificarte.",
    f3t: "Plataforma de confianza", f3d: "Únete a miles de clientes verificados hoy.",
    whoAreWe: "Quiénes somos",
    contactUs: "Contáctanos",
    calculator: "¿Cuánto puedes ganar?",
    enterOtp: "Ingresa el OTP",
    ok: "OTP verificado",
    fail: "Error al verificar OTP",
    resent: "OTP reenviado",
    resendFail: "No se pudo reenviar el OTP",
  },
  cn: {
    title: "验证 OTP",
    verifyBtn: "验证并继续",
    resendOtp: "重新发送",
    logIn: "登录",
    kicker: "验证您的号码",
    headline: "只差一步！",
    sentTo: "我们已向以下地址发送 6 位验证码",
    cardHint: "请输入发送至以下地址的 6 位验证码",
    expires: "验证码有效期",
    trust: "您的验证码由我们妥善保管，我们绝不会分享您的信息。",
    f1t: "安全私密", f1d: "您的数据受到行业领先的安全保护。",
    f2t: "快速验证", f2d: "不到 30 秒即可完成验证。",
    f3t: "值得信赖", f3d: "加入成千上万已验证的用户。",
    whoAreWe: "我们是谁",
    contactUs: "联系我们",
    calculator: "您能赚多少？",
    enterOtp: "请输入 OTP",
    ok: "OTP 已验证",
    fail: "OTP 验证失败",
    resent: "OTP 已重新发送",
    resendFail: "重新发送失败",
  },
  fr: {
    title: "Vérifier OTP",
    verifyBtn: "Vérifier et continuer",
    resendOtp: "Renvoyer le code",
    logIn: "Connexion",
    kicker: "VÉRIFIEZ VOTRE NUMÉRO",
    headline: "Plus qu'une étape !",
    sentTo: "Nous avons envoyé un code à 6 chiffres à",
    cardHint: "Entrez le code à 6 chiffres envoyé à",
    expires: "Le code expire dans",
    trust: "Votre code est en sécurité. Nous ne partageons jamais vos informations.",
    f1t: "Sécurisé et privé", f1d: "Vos données sont protégées par une sécurité de premier plan.",
    f2t: "Vérification rapide", f2d: "Moins de 30 secondes pour être vérifié.",
    f3t: "Plateforme de confiance", f3d: "Rejoignez des milliers de clients vérifiés.",
    whoAreWe: "Qui sommes-nous",
    contactUs: "Nous contacter",
    calculator: "Combien pouvez-vous gagner ?",
    enterOtp: "Veuillez entrer l'OTP",
    ok: "OTP vérifié",
    fail: "Échec de la vérification OTP",
    resent: "OTP renvoyé",
    resendFail: "Échec du renvoi de l'OTP",
  },
};

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const normalizeEmail = (e) => encodeURIComponent(String(e || "").trim().toLowerCase());
const secondsUntil = (iso) => (iso ? Math.max(0, Math.round((new Date(iso) - Date.now()) / 1000)) : 0);

const VerifyOtpPage = () => {
  const [digits, setDigits] = useState(() => Array(OTP_LEN).fill(""));
  const [left, setLeft] = useState(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [loading, setLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const inputs = useRef([]);
  const nav = useNavigate();
  const loc = useLocation();
  const isSignup = loc.pathname === "/verify";
  const email = loc.state?.email || localStorage.getItem("uEmail");
  const backTo = isSignup ? "/register" : "/forget-password";
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return otpTranslations[storedLang] || otpTranslations.fr;
  });

  useEffect(() => {
    if (!email) nav(backTo);
    const sync = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(otpTranslations[storedLang] || otpTranslations.fr);
    };
    window.addEventListener("storage", sync);
    window.addEventListener("app-language-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("app-language-changed", sync);
    };
  }, [email, nav, backTo]);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((n) => (n === null ? n : Math.max(0, n - 1)));
      setCooldown((n) => Math.max(0, n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // the code was mailed by register/forget-password, so ask the API how long it has left
  useEffect(() => {
    if (!email) return;
    let alive = true;
    axios
      .get(`${config.baseUrl}/account/otp/status/${normalizeEmail(email)}`)
      .then((r) => {
        if (!alive) return;
        const secs = secondsUntil(r.data?.data?.otpExpiresAt);
        setLeft(secs);
        // nothing valid to wait on -> let them ask for a new code straight away
        if (secs === 0) setCooldown(0);
      })
      .catch(() => alive && setLeft(0));
    return () => { alive = false; };
  }, [email]);

  const otp = digits.join("");

  const put = (i, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((d) => { const n = [...d]; n[i] = ""; return n; });
      return;
    }
    if (clean.length > 1) {
      const next = [...digits];
      clean.slice(0, OTP_LEN).split("").forEach((c, j) => { next[j] = c; });
      setDigits(next);
      inputs.current[Math.min(clean.length, OTP_LEN) - 1]?.focus();
      return;
    }
    setDigits((d) => { const n = [...d]; n[i] = clean; return n; });
    if (i < OTP_LEN - 1) inputs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verifyOtp = async () => {
    if (otp.length !== OTP_LEN) {
      toast.error(translations.enterOtp);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${config.baseUrl}/account/verify/otp`, { email, otp });
      toast.success(translations.ok);
      if (isSignup) {
        const user = res?.data?.data;
        // fall back — never overwrite a good register-time role with undefined
        const role = user?.role || localStorage.getItem("role");
        if (user?._id) localStorage.setItem("userId", String(user._id));
        if (role) localStorage.setItem("role", role);
        nav("/onboarding");
      } else {
        nav("/change-password", { state: { email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.fail);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    try {
      const res = await axios.post(`${config.baseUrl}/account/send/otp/${normalizeEmail(email)}`);
      setLeft(secondsUntil(res.data?.data?.otpExpiresAt));
      setCooldown(RESEND_COOLDOWN);
      toast.success(translations.resent);
      setDigits(Array(OTP_LEN).fill(""));
      inputs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.msg || translations.resendFail);
    }
  };

  const handleLanguageChange = (langSymbol) => {
    localStorage.setItem("lang", langSymbol);
    localStorage.setItem("i18nextLng", langSymbol);
    window.dispatchEvent(new CustomEvent("app-language-changed", { detail: { lang: langSymbol } }));
    setShowLanguages(false);
    window.location.reload();
  };

  const foot = [
    { Icon: FiShield, t: translations.f1t, d: translations.f1d },
    { Icon: FiZap, t: translations.f2t, d: translations.f2d },
    { Icon: FiCheck, t: translations.f3t, d: translations.f3d },
  ];

  const dest = email;
  const focused = digits.findIndex((d) => !d);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden text-black bg-gradient-to-b from-[#F5F9FF] via-[#DBEAFE] to-[#BFDBFE] md:bg-[url('/otp.png')] md:bg-cover md:bg-center md:bg-no-repeat"
    >
      <div className="relative z-10 w-full min-h-screen flex flex-col px-6 sm:px-8">
        <header className="shrink-0 flex items-center justify-between">
          <Link to="/" className="shrink-0">
            <img src={Logo} alt="Lorepa" className="h-16 sm:h-20 lg:h-24 w-auto" />
          </Link>
          <div className="relative flex items-center gap-4">
            <button type="button" onClick={() => setShowLanguages((v) => !v)} className={`${pill} w-10`} aria-label="Change language">
              <CiGlobe className="w-5 h-5" />
            </button>
            <Link to="/login" className={`${pill} px-4 text-[13px] font-medium`}>
              {translations.logIn}
            </Link>
            <button type="button" onClick={() => setShowMenu((v) => !v)} className={`${pill} w-10`} aria-label="Menu">
              <FiMenu className="w-5 h-5" />
            </button>
            {showLanguages && (
              <div className={`absolute right-0 top-full mt-2 w-44 rounded-xl ${card} overflow-hidden z-30`}>
                {[["en", "English"], ["es", "Spanish"], ["cn", "Chinese"], ["fr", "French"]].map(([code, label]) => (
                  <button key={code} onClick={() => handleLanguageChange(code)} className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-white/60">
                    {label}
                  </button>
                ))}
              </div>
            )}
            {showMenu && (
              <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl ${card} overflow-hidden z-30`}>
                {[["/who", translations.whoAreWe], ["/contact", translations.contactUs], ["/calculator", translations.calculator]].map(([to, label]) => (
                  <Link key={to} to={to} className="block px-4 py-2.5 text-sm text-black hover:bg-white/60">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 grid md:grid-cols-[1fr_406px] xl:grid-cols-[1fr_460px] gap-8 items-start md:pr-6">
          <div className="min-w-0 md:pl-8 self-stretch flex flex-col">
            <p className="font-sans text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase">{translations.kicker}</p>
            <h1 className="font-sans mt-1.5 text-[36px] sm:text-[44px] xl:text-[48px] font-extrabold leading-[1.08] tracking-tight text-[#0A0F18]">
              {translations.headline}
            </h1>
            <p className="mt-1 font-sans text-[#0A0F18]/70 text-[14px] max-w-[220px]">
              {translations.sentTo}{" "}
              <span className="text-[#2563EB] font-semibold inline-flex items-center gap-2">
                {dest}
                <Link to={backTo} aria-label="Edit" className="inline-flex h-6 w-6 rounded-full bg-[#DBEAFE] items-center justify-center">
                  <FiEdit2 className="w-3 h-3" />
                </Link>
              </span>
            </p>

            <img src="/otp.png" alt="" className="md:hidden mt-5 w-full h-44 object-cover rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.18)]" />

            <div className={`${glass} mt-auto mb-2 md:mb-12 md:-ml-8 w-full md:w-[calc(100%+2rem)] max-w-[720px] rounded-2xl px-5 py-3.5 grid grid-cols-1 lg:grid-cols-3 gap-4`}>
              {foot.map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[12px] leading-tight text-white">{t}</span>
                    <span className="block text-[11px] text-white/70 leading-snug mt-0.5">{d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full min-h-[560px] md:min-h-[624px] rounded-[32px] bg-white md:bg-white/45 backdrop-blur-[24px] border border-white/70 shadow-[0_16px_50px_rgba(0,0,0,0.12)] px-7 pt-14 pb-10 text-black flex flex-col">
            <div className="flex flex-col items-center mb-8">
              <span className="h-[60px] w-[60px] rounded-full bg-[#DBEAFE] flex items-center justify-center mb-7">
                <FiLock className="w-6 h-6 text-[#2563EB]" strokeWidth={1.8} />
              </span>
              <h2 className="font-sans text-[26px] font-extrabold tracking-tight text-center">{translations.title}</h2>
              <p className="text-[13px] text-black/55 mt-1.5 text-center max-w-[200px] leading-[1.4]">
                {translations.cardHint} <span className="text-[#2563EB] font-medium">{dest}</span>
              </p>
            </div>

            <div className="flex w-full justify-center gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={OTP_LEN}
                  value={d}
                  onChange={(e) => put(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  className={`h-14 w-full min-w-0 max-w-[51px] rounded-[12px] bg-white text-center text-lg font-semibold outline-none border ${i === (focused === -1 ? OTP_LEN - 1 : focused) ? "border-[#2563EB] border-2" : "border-[#E5E7EB]"} focus:border-[#2563EB] focus:border-2`}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between rounded-xl bg-[#F3F4F6]/80 px-4 h-12 text-[13px]">
              <span className="flex items-center gap-1.5 text-[#2563EB] font-medium">
                <FiClock className="w-4 h-4" />
                {translations.expires} {left === null ? "--:--" : mmss(left)}
              </span>
              <button type="button" onClick={resendOtp} disabled={cooldown > 0} className="text-black/40 font-medium disabled:text-black/35 enabled:text-[#2563EB]">
                {translations.resendOtp}
              </button>
            </div>

            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className="w-full h-12 mt-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1d4ed8] disabled:opacity-70 text-white text-[15px] font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
            >
              {loading && <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {translations.verifyBtn}
              {!loading && <FiArrowRight className="w-5 h-5" />}
            </button>

            <div className="mt-11 flex items-start justify-center gap-2.5">
              <span className="mt-0.5 h-7 w-7 shrink-0 rounded-lg border border-black/15 flex items-center justify-center">
                <FiShield className="w-3.5 h-3.5 text-black/45" />
              </span>
              <p className="text-[11px] text-black/45 leading-[1.5] max-w-[210px]">{translations.trust}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOtpPage;
