import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../ui/Logo";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <footer className="bg-white">
      {/* Main footer content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-neutral-600 text-sm leading-relaxed pr-4">
              {t("footer.aboutDescription")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {[
                { icon: Facebook, href: "#", name: "Facebook" },
                { icon: Instagram, href: "#", name: "Instagram" },
                { icon: Twitter, href: "#", name: "Twitter" },
                { icon: Youtube, href: "#", name: "YouTube" },
              ].map(({ icon: Icon, href, name }) => (
                <motion.a
                  key={name}
                  href={href}
                  className="text-neutral-500 hover:text-violet-600 transition-all duration-300"
                  aria-label={name}
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900 mb-6">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-4">
              {["about", "contact", "faq", "delivery", "returns"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to={`/${link}`}
                      className="text-neutral-600 hover:text-violet-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <ChevronRight
                        size={14}
                        className={`text-neutral-400 group-hover:text-violet-500 transition-all duration-300 ${
                          isRtl ? "rotate-180" : ""
                        } group-hover:translate-x-1 ${
                          isRtl ? "group-hover:-translate-x-1" : ""
                        }`}
                      />
                      {t(`footer.${link}`)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900 mb-6">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-4">
              {["terms", "privacy"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link}`}
                    className="text-neutral-600 hover:text-emerald-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={14}
                      className={`text-neutral-400 group-hover:text-emerald-500 transition-all duration-300 ${
                        isRtl ? "rotate-180" : ""
                      } group-hover:translate-x-1 ${
                        isRtl ? "group-hover:-translate-x-1" : ""
                      }`}
                    />
                    {t(`footer.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-100 bg-neutral-50/50">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm font-medium">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
