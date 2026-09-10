"use client";

/** 관리자 로그인 페이지 (스타일: src/styles/login.css) */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import PageBanner from "@/components/PageBanner";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/admin")) return "/admin";
  return next;
}

function LoginPageContent() {
  const { t } = useLang();
  const l = t.login;
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, loading, router, nextPath]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) {
      router.replace(nextPath);
    } else {
      setError(l.error);
    }
  }

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={l.banner} />

        <section className="login-section section-y">
          <div className="login-wrapper">
            <div className="login-head-container">
              <h2 className="login-title">{l.heading}</h2>
              <p className="login-desc">{l.desc}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form-container">
              {error && <p className="error">{error}</p>}

              <div className="field">
                <label htmlFor="login-email" className="label">
                  {l.emailLabel}
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={l.emailPlaceholder}
                  autoComplete="email"
                  required
                  className="input"
                />
              </div>

              <div className="field">
                <label htmlFor="login-password" className="label">
                  {l.passwordLabel}
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={l.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary btn-block btn-strong submit-btn"
              >
                {l.submit}
              </button>
            </form>

            <p className="login-foot">
              <Link href="/" className="back-link">
                {l.backHome}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
