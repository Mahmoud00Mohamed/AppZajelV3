import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  HeadphonesIcon,
} from "lucide-react";
import { SiVisa, SiMastercard, SiPaypal, SiApplepay } from "react-icons/si";
import { motion } from "framer-motion";
import Logo from "../ui/Logo";

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <footer
      className="bg-neutral-950 text-neutral-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-emerald-500/15 py-3">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              {
                icon: Shield,
                text: i18n.language === "ar" ? "دفع آمن" : "Secure Payment",
              },
              {
                icon: Truck,
                text: i18n.language === "ar" ? "توصيل سريع" : "Fast Delivery",
              },
              {
                icon: HeadphonesIcon,
                text: i18n.language === "ar" ? "دعم 24/7" : "24/7 Support",
              },
              {
                icon: CreditCard,
                text: i18n.language === "ar" ? "إرجاع سهل" : "Easy Returns",
              },
            ].map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-center p-1 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Icon size={20} className="text-emerald-500 mx-1" />
                <p className="text-xs font-medium text-neutral-200">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Logo className="text-emerald-500 h-8" />
            <p className="mt-6 text-neutral-400 text-sm leading-relaxed">
              {i18n.language === "ar"
                ? "نحن نقدم تجربة تسوق فريدة ومجموعة واسعة من المنتجات عالية الجودة لتلبية جميع احتياجاتك."
                : "We provide a unique shopping experience and a wide range of high-quality products to meet all your needs."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: Facebook, href: "#", name: "Facebook" },
                { icon: Instagram, href: "#", name: "Instagram" },
                { icon: Twitter, href: "#", name: "Twitter" },
                { icon: Youtube, href: "#", name: "YouTube" },
              ].map(({ icon: Icon, href, name }) => (
                <motion.a
                  key={name}
                  href={href}
                  className="p-3 rounded-full text-neutral-500 hover:text-white hover:bg-violet-500 transition-colors duration-300"
                  aria-label={name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 relative pb-2 ${
                isRtl ? "after:right-0" : "after:left-0"
              } after:absolute after:bottom-0 after:h-0.5 after:w-10 after:bg-violet-500`}
            >
              {i18n.language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-4">
              {[
                {
                  to: "/about",
                  text: i18n.language === "ar" ? "من نحن" : "About Us",
                },
                {
                  to: "/contact",
                  text: i18n.language === "ar" ? "اتصل بنا" : "Contact Us",
                },
                {
                  to: "/faq",
                  text: i18n.language === "ar" ? "الأسئلة الشائعة" : "FAQ",
                },
                {
                  to: "/delivery",
                  text: i18n.language === "ar" ? "الشحن والتوصيل" : "Delivery",
                },
                {
                  to: "/returns",
                  text:
                    i18n.language === "ar" ? "الإرجاع والاستبدال" : "Returns",
                },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-neutral-400 hover:text-violet-500 transition-colors duration-300 text-sm font-medium flex items-center gap-3 group"
                  >
                    <ChevronRight
                      size={14}
                      className={`text-neutral-500 transition-transform duration-300 ${
                        isRtl ? "rotate-180" : ""
                      } ${
                        isRtl
                          ? "group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 relative pb-2 ${
                isRtl ? "after:right-0" : "after:left-0"
              } after:absolute after:bottom-0 after:h-0.5 after:w-10 after:bg-violet-500`}
            >
              {i18n.language === "ar" ? "الشروط والأحكام" : "Legal"}
            </h3>
            <ul className="space-y-4">
              {[
                {
                  to: "/terms",
                  text:
                    i18n.language === "ar" ? "شروط الاستخدام" : "Terms of Use",
                },
                {
                  to: "/privacy",
                  text:
                    i18n.language === "ar"
                      ? "سياسة الخصوصية"
                      : "Privacy Policy",
                },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-neutral-400 hover:text-violet-500 transition-colors duration-300 text-sm font-medium flex items-center gap-3 group"
                  >
                    <ChevronRight
                      size={14}
                      className={`text-neutral-500 transition-transform duration-300 ${
                        isRtl ? "rotate-180" : ""
                      } ${
                        isRtl
                          ? "group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 relative pb-2 ${
                isRtl ? "after:right-0" : "after:left-0"
              } after:absolute after:bottom-0 after:h-0.5 after:w-10 after:bg-violet-500`}
            >
              {i18n.language === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-emerald-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-neutral-400 text-sm">
                  {i18n.language === "ar" ? (
                    <>
                      ١٢٣ شارع الأعمال، الطابق ١٠١
                      <br />
                      الرياض، المملكة العربية السعودية
                    </>
                  ) : (
                    <>
                      123 Business Ave, Suite 101
                      <br />
                      Riyadh, Saudi Arabia
                    </>
                  )}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">
                  +966 12 345 6789
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">
                  info@company.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-neutral-900">
        <div className="container-custom py-6">
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-4 ${
              isRtl ? "md:flex-row-reverse" : ""
            }`}
          >
            <p className="text-neutral-500 text-sm font-medium">
              {i18n.language === "ar"
                ? "© 2024 اسم الشركة. جميع الحقوق محفوظة."
                : "© 2024 Company Name. All rights reserved."}
            </p>

            <div
              className={`flex items-center gap-6`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <span className="text-neutral-400 text-sm whitespace-nowrap">
                {i18n.language === "ar"
                  ? "طرق الدفع المقبولة:"
                  : "Accepted Payments:"}
              </span>

              <div className="flex gap-2">
                {[
                  { icon: SiVisa, name: "Visa" },
                  { icon: SiMastercard, name: "Mastercard" },
                  { icon: SiPaypal, name: "PayPal" },
                  { icon: SiApplepay, name: "ApplePay" },
                ].map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="bg-neutral-800 text-neutral-300 text-xs p-2 rounded"
                  >
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
