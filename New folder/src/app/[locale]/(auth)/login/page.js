"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter as useNavRouter } from "next/navigation"; // برای هدایت بعد از ورود به /panel (خارج از [locale])
import { useRouter, usePathname } from "@/i18n/navigation"; // برای سوییچ زبان همین صفحه
import Image from "next/image";
import {
  ShieldCheck,
  UserRound,
  Lock,
  Eye,
  EyeOff,
  ShieldQuestion,
  RefreshCw,
  Landmark,
  Smartphone,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  LifeBuoy,
  Download,
  BookOpen,
} from "lucide-react";
import { login } from "@/lib/api";

const EMAIL_DOMAIN = "university.ac.ir"; // دامنه‌ی واقعی seed بک‌اند

function randomCaptcha() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // state محلیِ نمایشی، مستقل از locale واقعیِ URL — چون تغییر URL باعث
  // ناوبری و عوض شدن آنیِ dir کل صفحه می‌شه و اجازه نمی‌ده انیمیشن دیده
  // بشه. اول این state رو (فوری) عوض می‌کنیم تا کپسول اسلاید بخوره،
  // بعد از پایان انیمیشن ناوبری واقعی رو انجام می‌دیم.
  const [visualLocale, setVisualLocale] = useState(locale);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setVisualLocale(locale);
    setPending(false);
  }, [locale]);

  const toggle = () => {
    if (pending) return;
    const next = visualLocale === "fa" ? "en" : "fa";
    setVisualLocale(next); // انیمیشن فوراً شروع می‌شه
    setPending(true);
    window.setTimeout(() => {
      router.replace(pathname, { locale: next }); // ناوبری واقعی بعد از دیده‌شدن انیمیشن
    }, 260);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      dir="ltr"
      aria-label="Switch language"
      className="relative flex h-9 w-[92px] items-center rounded-full border border-neutral-200 bg-white p-1 text-xs font-semibold transition-colors hover:border-brand/40 disabled:opacity-70"
    >
      <span
        aria-hidden="true"
        className="absolute start-1 top-1 bottom-1 w-[42px] rounded-full bg-primary-900 shadow-sm will-change-transform transition-transform duration-300 ease-out"
        style={{ transform: visualLocale === "fa" ? "translateX(0)" : "translateX(46px)" }}
      />
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          visualLocale === "fa" ? "text-white" : "text-neutral-400"
        }`}
      >
        FA
      </span>
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          visualLocale === "en" ? "text-white" : "text-neutral-400"
        }`}
      >
        EN
      </span>
    </button>
  );
}

export default function LoginPage() {
  const t = useTranslations("Login");
  const navRouter = useNavRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [captcha, setCaptcha] = useState(randomCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // TODO: وقتی endpoint واقعی کپچا آماده شد، این مقایسه‌ی محلی رو با
    // اعتبارسنجی سمت سرور جایگزین کن. فعلاً فقط یک بازدارنده‌ی ساده‌ست.
    if (captchaInput.trim() !== captcha) {
      setError(t("errorCaptcha"));
      setCaptcha(randomCaptcha());
      setCaptchaInput("");
      return;
    }

    const email = identifier.includes("@") ? identifier : `${identifier}@${EMAIL_DOMAIN}`;

    setLoading(true);
    try {
      const { user } = await login(email, password);
      // /panel بیرون از [locale] است، پس با روتر معمولیِ next/navigation هدایت می‌کنیم
      // (نه روتر چندزبانه‌ی i18n که پیشوند locale اضافه می‌کند).
      navRouter.push(user.role === "ADMIN" ? "/panel/admin" : "/panel/professor");
    } catch (err) {
      setError(err.message || t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-6 sm:px-8">
      {/* ---- نوار بالا ---- */}
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LangToggle />
          <span className="flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-medium text-secondary-700">
            <ShieldCheck className="size-3.5" />
            {t("secureProtocol")}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right rtl:text-right ltr:text-left">
            <p className="text-sm font-bold text-primary-900">{t("portalTitle")}</p>
            <p className="text-xs text-neutral-500">{t("portalSubtitle")}</p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-900 text-white">
            <ShieldCheck className="size-4" />
          </span>
        </div>
      </div>

      {/* ---- دو ستون اصلی ---- */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[420px_1fr]">
        {/* ================= ستون اطلاعات ================= */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-primary-900 p-7 text-white">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-100">
              {t("deputyChip")}
            </span>
            <h1 className="mb-3 text-xl font-extrabold leading-relaxed sm:text-2xl">{t("sideHeading")}</h1>
            <p className="mb-6 text-sm leading-7 text-primary-200">{t("sideParagraph")}</p>
            <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
              <div>
                <p className="text-lg font-bold text-secondary-300">99.9%</p>
                <p className="text-[11px] text-primary-300">{t("statNetworkUptime")}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-secondary-300">84%</p>
                <p className="text-[11px] text-primary-300">{t("statProfileCompletion")}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-secondary-300">1,420+</p>
                <p className="text-[11px] text-primary-300">{t("statActiveMembers")}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-400">
              <Image src="https://picsum.photos/seed/login-guide/640/240" alt="" fill className="object-cover opacity-70" />
            </div>
            <div className="p-4">
              <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-neutral-800">
                <BookOpen className="size-4 text-brand" />
                {t("guideTitle")}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Download className="size-3.5" />
                {t("guideSubtitle")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900">
              <LifeBuoy className="size-4 text-brand" />
              {t("supportTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <p className="mb-1 text-neutral-400">{t("supportEmailLabel")}</p>
                <a href="mailto:faculty-support@univ.ac.ir" className="flex items-center gap-1.5 font-medium text-brand">
                  <Mail className="size-3.5" />
                  faculty-support@univ.ac.ir
                </a>
              </div>
              <div>
                <p className="mb-1 text-neutral-400">{t("supportPhoneLabel")}</p>
                <p className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Phone className="size-3.5" />
                  021 - 8899 4410
                </p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
              <Clock className="size-3.5" />
              {t("supportHours")}
            </p>
            <a href="#" className="mt-2 inline-block text-xs font-medium text-brand hover:underline">
              {t("ticketingSystem")}
            </a>
          </div>
        </div>

        {/* ================= ستون فرم ================= */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 sm:p-9">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs text-neutral-400">{t("version")}</p>
              <a href="#" className="text-xs font-medium text-brand hover:underline">
                {t("identityCertificate")}
              </a>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
              {t("ssoBadge")}
            </span>
          </div>

          <h1 className="mb-1.5 text-xl font-extrabold text-neutral-900 sm:text-2xl">{t("formTitle")}</h1>
          <p className="mb-7 text-sm text-neutral-500">{t("formSubtitle")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* شناسه */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                <UserRound className="size-4 text-neutral-400" />
                {t("identifierLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-neutral-200 focus-within:ring-2 focus-within:ring-brand">
                <input
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t("identifierPlaceholder")}
                  className="min-w-0 flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />
                {!identifier.includes("@") && (
                  <span className="flex items-center bg-neutral-50 px-3 text-xs text-neutral-400">
                    @{EMAIL_DOMAIN}
                  </span>
                )}
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                  <Lock className="size-4 text-neutral-400" />
                  {t("passwordLabel")} <span className="text-red-500">*</span>
                </label>
                <a href="#" className="text-xs text-brand hover:underline">
                  {t("forgotPassword")}
                </a>
              </div>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-neutral-200 focus-within:ring-2 focus-within:ring-brand">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-w-0 flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center px-3 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* کپچا */}
            <div>
              <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <ShieldQuestion className="size-4 text-neutral-400" />
                  {t("captchaLabel")} <span className="text-red-500">*</span>
                </span>
                <span className="text-xs font-normal text-neutral-400">{t("captchaHint")}</span>
              </label>
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => setCaptcha(randomCaptcha())}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 text-lg font-bold tracking-widest text-neutral-700"
                  title={t("captchaRefresh")}
                >
                  <RefreshCw className="size-3.5 text-neutral-400" />
                  {captcha}
                </button>
                <input
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder={t("captchaPlaceholder")}
                  className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-600">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="size-3.5 rounded border-neutral-300 text-brand focus-visible:ring-brand"
              />
              {t("rememberSession")}
            </label>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-900 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Lock className="size-4" />
              {loading ? t("submitting") : t("submit")}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
            <span className="h-px flex-1 bg-neutral-200" />
            {t("orDivider")}
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Landmark className="size-4" />
              {t("casButton")}
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Smartphone className="size-4" />
              {t("govButton")}
            </button>
          </div>

          <div className="mt-6 flex gap-2.5 rounded-xl bg-tertiary-50 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-tertiary-600" />
            <p className="text-xs leading-6 text-tertiary-900">
              <span className="font-bold">{t("securityNoticeTitle")} </span>
              {t("securityNoticeText")}
            </p>
          </div>
        </div>
      </div>

      {/* ---- فوتر ---- */}
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
        <p>{t("footerCopyright")}</p>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="hover:text-neutral-600">{t("footerPrivacy")}</a>
          <a href="#" className="hover:text-neutral-600">{t("footerPromotion")}</a>
          <a href="#" className="hover:text-neutral-600">{t("footerNewUsername")}</a>
        </div>
      </div>
    </div>
  );
}