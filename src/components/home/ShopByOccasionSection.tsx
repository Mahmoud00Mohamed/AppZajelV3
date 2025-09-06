import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import occasions from "../../data/occasions.json";
import { ProductImage } from "../../features/images";
import { useImagePreloader } from "../../features/images";

interface Occasion {
  id: string | number;
  nameKey: string;
  imageUrl: string;
}

const OccasionCard: React.FC<{ occasion: Occasion; isFixed?: boolean }> = ({
  occasion,
  isFixed = false,
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/occasion/${occasion.id}`}
      className={`flex flex-col items-center flex-shrink-0 w-28 sm:w-32 md:w-36 text-center ${
        isFixed ? "" : "snap-center"
      }`}
    >
      <div
        className={`w-full aspect-square rounded-[20px] overflow-hidden transition-none ${
          isFixed ? "relative z-20" : "relative z-10"
        }`}
      >
        <ProductImage
          src={occasion.imageUrl}
          alt={t(occasion.nameKey)}
          className="w-full  h-full object-cover rounded-[20px]"
          width={120}
          height={120}
          aspectRatio="square"
          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
          quality={100}
          priority={true}
          showZoom={false}
          placeholderSize={24}
          fallbackSrc="/public/occasions/3.png"
        />
      </div>
      <span className="text-stone-600 text-xs sm:text-sm font-medium mt-2.5 w-full line-clamp-2 leading-tight text-center px-1">
        {t(occasion.nameKey)}
      </span>
    </Link>
  );
};

const ShopByOccasionSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const { firstOccasion, scrollableOccasions } = useMemo(() => {
    if (occasions.length === 0)
      return { firstOccasion: null, scrollableOccasions: [] };

    return {
      firstOccasion: occasions[0] as Occasion,
      scrollableOccasions: occasions.slice(1) as Occasion[],
    };
  }, []);

  const occasionImages = useMemo(
    () => scrollableOccasions.slice(0, 9).map((occasion) => occasion.imageUrl),
    [scrollableOccasions]
  );
  useImagePreloader(occasionImages, { priority: true });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 144 + 24 : 112 + 16; // card width + gap
      scrollRef.current.scrollBy({
        left: isRtl
          ? direction === "left"
            ? cardWidth
            : -cardWidth
          : direction === "left"
          ? -cardWidth
          : cardWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    const timeoutId = setTimeout(checkOverflow, 150);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [scrollableOccasions]);

  if (!firstOccasion) return null;

  return (
    <section className="py-3">
      <div className="container-custom px-4 sm:px-16">
        <div className="relative text-center my-10">
          <h2
            className={`
    relative z-10 inline-flex items-center justify-center
    bg-purple-600 text-white px-5 py-2 text-xl font-bold
    ${i18n.language === "ar" ? "font-tajawal" : "font-poppins"}
    rounded-md
  `}
          >
            <span
              className="absolute left-0 -ml-2 w-0 h-0
                     border-t-[10px] border-b-[10px] border-r-[10px]
                     border-t-transparent border-b-transparent border-r-purple-600"
            ></span>

            {t("home.shopByOccasion.title")}

            <span
              className="absolute right-0 -mr-2 w-0 h-0
                     border-t-[10px] border-b-[10px] border-l-[10px]
                     border-t-transparent border-b-transparent border-l-purple-600"
            ></span>
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-start gap-4 sm:gap-5 md:gap-6">
            <div className="flex-shrink-0 z-30">
              <OccasionCard occasion={firstOccasion} isFixed={true} />
            </div>

            <div
              ref={scrollRef}
              className="flex-grow flex items-start overflow-x-auto gap-4 sm:gap-5 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hidden"
              style={{ scrollSnapStop: "always" }}
            >
              {scrollableOccasions.map((occasion, index) => (
                <div
                  key={occasion.id}
                  className="animate-fade-in snap-start"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <OccasionCard occasion={occasion} />
                </div>
              ))}
            </div>
          </div>

          {showArrows && (
            <>
              <button
                onClick={() => scroll("left")}
                className={`hidden md:flex items-center justify-center absolute top-[40%] -translate-y-1/2 bg-white/90 text-stone-600 rounded-full w-9 h-9 shadow ring-1 ring-stone-200 z-40 ${
                  isRtl ? "-right-8" : "-left-8"
                }`}
                aria-label={t("common.scrollLeft")}
              >
                {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              <button
                onClick={() => scroll("right")}
                className={`hidden md:flex items-center justify-center absolute top-[40%] -translate-y-1/2 bg-white/90 text-stone-600 rounded-full w-9 h-9 shadow ring-1 ring-stone-200 z-40 ${
                  isRtl ? "-left-8" : "-right-8"
                }`}
                aria-label={t("common.scrollRight")}
              >
                {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ShopByOccasionSection);
