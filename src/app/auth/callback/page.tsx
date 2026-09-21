"use client";

/**
 * 메일 링크(초대·매직링크·비밀번호 재설정)가 도착하는 페이지.
 *
 * Supabase는 화면을 제공하지 않는다. 토큰을 검증한 뒤 이 주소로 되돌려보낼 뿐이라,
 * 세션으로 바꾸고 다음 화면으로 보내는 일은 사이트가 해야 한다. 이 페이지가 없으면
 * 링크를 눌러도 홈으로 떨어지고 비밀번호를 정할 방법이 없다.
 */

import { Suspense, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { useLang } from "@/contexts/LangContext";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const { t } = useLang();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fail = (message: string) => {
      if (!cancelled) setError(message);
    };

    async function exchange() {
      if (!isSupabaseConfigured()) return fail(t.login.error);

      /*
       * 토큰은 쿼리스트링이 아니라 URL 프래그먼트(#)로 온다. 프래그먼트는 서버로
       * 전송되지 않으므로 이 교환은 브라우저에서만 할 수 있다.
       */
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const linkError = params.get("error_description") ?? params.get("error");

      if (linkError) return fail(linkError);
      if (!accessToken || !refreshToken) return fail(t.login.error);

      const { error: sessionError } = await createClient().auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (cancelled) return;
      if (sessionError) return fail(sessionError.message);

      /*
       * router.replace가 아니라 전체 페이지 이동이어야 한다. 클라이언트 내부 이동은
       * AuthProvider를 다시 마운트하지 않는데, 그 컨텍스트는 이 페이지가 열릴 때
       * — 세션이 생기기 전에 — 확인한 "로그인 안 됨"을 그대로 들고 있다. 그 상태로
       * /admin에 들어가면 로그인 화면으로 튕기고, 로그인 화면은 자기가 보기에
       * 미로그인이라 머문다. 전체 이동은 새 쿠키로 서버 렌더부터 다시 시작한다.
       */
      window.location.replace("/admin/account");
    }

    void exchange();
    return () => {
      cancelled = true;
    };
  }, [t.login.error]);

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={t.login.banner} />
        <section className="login-section section-y">
          <div className="login-wrapper">
            <div className="login-head-container">
              <h2 className="login-title">{t.admin.accountTitle}</h2>
              <p className="login-desc">{error || t.news.loading}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
