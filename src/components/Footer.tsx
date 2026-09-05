"use client";

/** 공통 푸터 — 로고·연락처, 메뉴 링크, 저작권 (스타일: src/styles/footer.css) */

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export default function Footer() {
  const { t } = useLang();
  const addressEnOneLine = t.contact.addressEn.replace(/\n/g, ", ");

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-wrapper">
          <div className="footer-info-container">
            <Image
              src="/oepl-logo.png"
              alt="OEPL"
              width={110}
              height={36}
              className="footer-logo"
            />

            <address className="info-list">
              <p className="info-item is-address">
                <MapPin size={13} className="info-icon" aria-hidden />
                <span className="address-mobile">
                  {t.contact.address}
                  <br />
                  <span className="info-sub">{addressEnOneLine}</span>
                </span>
                <span className="address-desktop">
                  (44610) 울산광역시 남구 대학로 93<br />
                  울산대학교 자연과학대학 8호관 8-224호 / 8-228호<br />
                  <span className="info-sub">
                    93 Daehak-ro, Nam-gu, Ulsan 44610, Korea<br />
                    Bldg. 8, Rm. 8-224 / 8-228, Univ. of Ulsan
                  </span>
                </span>
              </p>

              <p className="info-item">
                <Phone size={12} className="info-icon" aria-hidden />
                <span>+82-52-220-2547 (office)</span>
              </p>

              <p className="info-item">
                <Mail size={12} className="info-icon" aria-hidden />
                <a href="mailto:sucho@ulsan.ac.kr" className="info-link">
                  sucho@ulsan.ac.kr
                </a>
              </p>
            </address>
          </div>

          <nav className="footer-link-container" aria-label="Footer">
            {Object.entries(t.footer.columns).map(([col, links]) => (
              <ul key={col} className="link-list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-wrapper">
          <p className="copyright">{t.footer.copyright}</p>
          <p className="biz-num">{t.footer.bizNum}</p>
        </div>
      </div>
    </footer>
  );
}
