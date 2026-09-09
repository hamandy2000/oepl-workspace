"use client";

/** Contact 페이지 — 연락처 표시 및 클릭 복사 (스타일: src/styles/contact.css) */

import { useState, type ElementType, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";

function useCopySection() {
  const [copied, setCopied] = useState(false);

  function notifyCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return { copied, notifyCopied };
}

function Copyable({
  text,
  children,
  className = "",
  onCopied,
  as: Tag = "p",
  ...props
}: {
  text: string;
  children: ReactNode;
  className?: string;
  onCopied: () => void;
  as?: ElementType;
  href?: string;
}) {
  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      onCopied();
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <Tag {...props} onClick={handleCopy} className={`copyable ${className}`.trim()}>
      {children}
    </Tag>
  );
}

function CopiedBadge({ show, label }: { show: boolean; label: string }) {
  return (
    <span aria-hidden={!show} className={show ? "copied-badge is-shown" : "copied-badge"}>
      {label}
    </span>
  );
}

export default function ContactPage() {
  const { lang, t } = useLang();
  const c = t.contact;
  const fullAddressEn = c.addressEn.replace("\n", " ");
  const addressCopy = useCopySection();
  const phoneCopy = useCopySection();
  const emailCopy = useCopySection();

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={c.banner} />

        <section className="contact-section section-y">
          <div className="contact-wrapper">
            <div className="contact-head-container">
              <h2 className="contact-title">{c.heading}</h2>
              <p className="contact-desc">
                {lang === "KR"
                  ? "연구실 방문, 공동 연구, 학생 모집 등 궁금하신 사항이 있으시면 언제든지 연락해 주세요."
                  : "We'd love to hear from you. Whether you have questions about research, collaboration, or joining our lab, our team is here to help."}
              </p>
            </div>

            <div className="contact-info-container">
              {/* 주소 */}
              <div className="info-item is-address">
                <div className="info-head">
                  <div className="icon-box">
                    <MapPin size={14} />
                  </div>
                  <span className="label-box">
                    <p className="label">{c.addressLabel}</p>
                    <CopiedBadge show={addressCopy.copied} label={c.copySuccess} />
                  </span>
                </div>
                <Copyable
                  as="p"
                  text={lang === "KR" ? c.address : fullAddressEn}
                  onCopied={addressCopy.notifyCopied}
                  className="value"
                >
                  {lang === "KR" ? c.address : c.addressEn.split("\n")[0]}
                </Copyable>
                {lang === "KR" ? (
                  <Copyable
                    as="p"
                    text={fullAddressEn}
                    onCopied={addressCopy.notifyCopied}
                    className="value-sub"
                  >
                    {c.addressEn.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </Copyable>
                ) : (
                  <>
                    {c.addressEn
                      .split("\n")
                      .slice(1)
                      .map((line, i) => (
                        <Copyable
                          key={i}
                          as="p"
                          text={fullAddressEn}
                          onCopied={addressCopy.notifyCopied}
                          className="value"
                        >
                          {line}
                        </Copyable>
                      ))}
                    <Copyable
                      as="p"
                      text={c.address}
                      onCopied={addressCopy.notifyCopied}
                      className="value-sub"
                    >
                      {c.address}
                    </Copyable>
                  </>
                )}
              </div>

              {/* 전화 */}
              <div className="info-item">
                <div className="info-head">
                  <div className="icon-box">
                    <Phone size={14} />
                  </div>
                  <span className="label-box">
                    <p className="label">{c.phoneLabel}</p>
                    <CopiedBadge show={phoneCopy.copied} label={c.copySuccess} />
                  </span>
                </div>
                <div className="value-list">
                  <Copyable
                    as="a"
                    href="tel:+82522202547"
                    text="+82-52-220-2547"
                    onCopied={phoneCopy.notifyCopied}
                    className="value-plain"
                  >
                    +82-52-220-2547 (office)
                  </Copyable>
                  <Copyable
                    as="a"
                    href="tel:+82522204610"
                    text="+82-52-220-4610"
                    onCopied={phoneCopy.notifyCopied}
                    className="value-plain"
                  >
                    +82-52-220-4610 (lab)
                  </Copyable>
                </div>
              </div>

              {/* 이메일 */}
              <div className="info-item">
                <div className="info-head">
                  <div className="icon-box">
                    <Mail size={14} />
                  </div>
                  <span className="label-box">
                    <p className="label">{c.emailLabel}</p>
                    <CopiedBadge show={emailCopy.copied} label={c.copySuccess} />
                  </span>
                </div>
                <Copyable
                  as="a"
                  href="mailto:sucho@ulsan.ac.kr"
                  text="sucho@ulsan.ac.kr"
                  onCopied={emailCopy.notifyCopied}
                  className="value-plain"
                >
                  sucho@ulsan.ac.kr
                </Copyable>
              </div>
            </div>

            <div className="contact-map-container">
              <iframe
                title="OEPL Location"
                src="https://maps.google.com/maps?q=울산대학교+자연과학대학&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="map"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=울산대학교+자연과학대학"
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                {lang === "KR" ? "길찾기" : "Get Directions"}
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
