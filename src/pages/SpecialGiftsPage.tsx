import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Flame,
  Crown,
  Sparkles,
  Tag,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSpecialGifts } from "../data";
import { ProductImage, usePreloadCriticalImages } from "../features/images";
import FavoriteButton from "../components/ui/FavoriteButton";
import AddToCartButton from "../components/ui/AddToCartButton";

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  isSpecialGift: boolean;
  isBestSeller?: boolean;
  categoryId?: string;
  occasionId?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

interface FilterState {
  priceRange: [number, number];
  features: string[];
  sortBy: string;
}

const RiyalSymbol = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1124.14 1256.39"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
  </svg>
);

const SpecialGiftsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    "price",
    "features",
  ]);

  const specialGiftsData: Product[] = useMemo(() => getSpecialGifts(), []);
  const imageUrls = useMemo(
    () => specialGiftsData.map((p) => p.imageUrl),
    [specialGiftsData]
  );
  usePreloadCriticalImages(imageUrls);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSortOptions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, Infinity],
    features: [],
    sortBy: "featured",
  });

  const priceRanges = useMemo(
    () => [
      {
        id: "under-350",
        label: isRtl ? "أقل من 350" : "Under 350",
        range: [0, 349] as [number, number],
      },
      {
        id: "350-700",
        label: isRtl ? "350 إلى 700" : "350 to 700",
        range: [350, 700] as [number, number],
      },
      {
        id: "700-1000",
        label: isRtl ? "700 إلى 1000" : "700 to 1000",
        range: [701, 1000] as [number, number],
      },
      {
        id: "over-1000",
        label: isRtl ? "أكثر من 1000" : "Over 1000",
        range: [1001, Infinity] as [number, number],
      },
    ],
    [isRtl]
  );

  const filterOptions = {
    features: [
      {
        id: "bestseller",
        nameKey: isRtl ? "الأكثر مبيعاً" : "Best Seller",
        icon: <Flame size={14} />,
      },
      {
        id: "premium",
        nameKey: isRtl ? "فاخر" : "Premium",
        icon: <Crown size={14} />,
      },
      {
        id: "affordable",
        nameKey: isRtl ? "بأسعار معقولة" : "Affordable",
        icon: <Tag size={14} />,
      },
    ],
    sortOptions: [
      {
        value: "featured",
        label: isRtl ? "مميز" : "Featured",
        icon: <Sparkles size={14} />,
      },
      {
        value: "price-low",
        label: isRtl ? "السعر: منخفض إلى مرتفع" : "Price: Low to High",
        icon: <DollarSign size={14} />,
      },
      {
        value: "price-high",
        label: isRtl ? "السعر: مرتفع إلى منخفض" : "Price: High to Low",
        icon: <DollarSign size={14} />,
      },
      {
        value: "name",
        label: isRtl ? "الاسم" : "Name",
        icon: <Tag size={14} />,
      },
    ],
  };

  const filteredProducts = useMemo(() => {
    let products = specialGiftsData;

    if (searchTerm) {
      products = products.filter((product) =>
        (isRtl ? product.nameAr : product.nameEn)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    products = products.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    if (filters.features.length > 0) {
      products = products.filter((product) =>
        filters.features.every((feature) => {
          switch (feature) {
            case "bestseller":
              return product.isBestSeller;
            case "premium":
              return product.price > 300;
            case "affordable":
              return product.price <= 200;
            default:
              return true;
          }
        })
      );
    }

    return products.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return isRtl
            ? a.nameAr.localeCompare(b.nameAr)
            : a.nameEn.localeCompare(b.nameEn);
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [searchTerm, filters, isRtl, specialGiftsData]);

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: "features", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
  };

  const clearFilters = () => {
    setFilters({ priceRange: [0, Infinity], features: [], sortBy: "featured" });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.features.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== Infinity ||
    searchTerm.length > 0;

  const activeFiltersCount =
    filters.features.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== Infinity
      ? 1
      : 0) +
    (searchTerm.length > 0 ? 1 : 0);

  const getSortLabel = (sortByValue: string): string => {
    const sortOption = filterOptions.sortOptions.find(
      (option) => option.value === sortByValue
    );
    return sortOption ? sortOption.label : "";
  };

  const toggleFilterExpansion = (filterKey: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((key) => key !== filterKey)
        : [...prev, filterKey]
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans antialiased p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <main className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="sticky top-6 rounded-3xl border border-neutral-100 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-5 py-4 bg-emerald-500/10">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-neutral-900">
                  <SlidersHorizontal size={18} className="text-emerald-500" />
                  {isRtl ? "الفلاتر" : "Filters"}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white hover:opacity-95"
                  >
                    {isRtl ? "مسح" : "Clear"}
                  </button>
                )}
              </div>

              <div className="px-5 py-5">
                {/* Search inside filters */}
                <div className="mb-4">
                  <div className="relative">
                    <Search
                      size={14}
                      className={`absolute ${
                        isRtl ? "right-3" : "left-3"
                      } top-1/2 -translate-y-1/2 text-neutral-400`}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={
                        isRtl ? "ابحث داخل الفلاتر..." : "Search in filters..."
                      }
                      className={`h-10 w-full ${
                        isRtl ? "pr-9 pl-3" : "pl-9 pr-3"
                      } rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm outline-none focus:border-emerald-500 focus:bg-white`}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className={`absolute ${
                          isRtl ? "left-2.5" : "right-2.5"
                        } top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-neutral-600`}
                        aria-label={isRtl ? "مسح" : "Clear"}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Active chips */}
                {(filters.features.length > 0 ||
                  searchTerm ||
                  filters.priceRange[0] !== 0 ||
                  filters.priceRange[1] !== Infinity) && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-800">
                        {isRtl ? "بحث" : "Search"}: {searchTerm}
                        <button
                          onClick={() => setSearchTerm("")}
                          className="rounded-full p-0.5 hover:bg-white/50"
                          aria-label={isRtl ? "إزالة" : "Remove"}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {(filters.priceRange[0] !== 0 ||
                      filters.priceRange[1] !== Infinity) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white">
                        {isRtl ? "السعر" : "Price"}
                        <button
                          onClick={() =>
                            setFilters((p) => ({
                              ...p,
                              priceRange: [0, Infinity],
                            }))
                          }
                          className="rounded-full p-0.5 hover:bg-white/20"
                          aria-label={isRtl ? "إزالة" : "Remove"}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {filters.features.map((f) => {
                      const meta = filterOptions.features.find(
                        (x) => x.id === f
                      );
                      if (!meta) return null;
                      return (
                        <span
                          key={`chip-${f}`}
                          className="inline-flex items-center gap-1 rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {meta.nameKey}
                          <button
                            onClick={() => toggleArrayFilter("features", f)}
                            className="rounded-full p-0.5 hover:bg-white/20"
                            aria-label={isRtl ? "إزالة" : "Remove"}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Price accordion */}
                <div className="rounded-2xl border border-neutral-100">
                  <button
                    onClick={() => toggleFilterExpansion("price")}
                    className="flex w-full items-center justify-between px-4 py-3"
                    aria-expanded={expandedFilters.includes("price")}
                  >
                    <span className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
                      <DollarSign size={16} className="text-emerald-500" />
                      {isRtl ? "نطاق السعر" : "Price Range"}
                    </span>
                    {expandedFilters.includes("price") ? (
                      <ChevronUp size={16} className="text-neutral-400" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-400" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFilters.includes("price") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-4 pb-4"
                      >
                        <div className="grid gap-2">
                          {priceRanges.map((option) => {
                            const checked =
                              filters.priceRange[0] === option.range[0] &&
                              filters.priceRange[1] === option.range[1];
                            return (
                              <label
                                key={option.id}
                                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors cursor-pointer ${
                                  checked
                                    ? "border-violet-500 bg-violet-500/5 text-violet-600"
                                    : "border-neutral-200 hover:bg-neutral-100"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="priceRange"
                                    checked={checked}
                                    onChange={() =>
                                      handlePriceRangeSelect(
                                        option.range[0],
                                        option.range[1]
                                      )
                                    }
                                    className="h-4 w-4 rounded-full border-neutral-300 text-violet-500 focus:ring-violet-500"
                                  />
                                  <span className="font-medium">
                                    {option.label}
                                  </span>
                                  <RiyalSymbol className="h-3.5 w-3.5" />
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Features accordion */}
                <div className="mt-4 rounded-2xl border border-neutral-100">
                  <button
                    onClick={() => toggleFilterExpansion("features")}
                    className="flex w-full items-center justify-between px-4 py-3"
                    aria-expanded={expandedFilters.includes("features")}
                  >
                    <span className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
                      <Sparkles size={16} className="text-emerald-500" />
                      {isRtl ? "المميزات" : "Features"}
                    </span>
                    {expandedFilters.includes("features") ? (
                      <ChevronUp size={16} className="text-neutral-400" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-400" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFilters.includes("features") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-4 pb-4"
                      >
                        <div className="grid gap-2">
                          {filterOptions.features.map((feature) => {
                            const active = filters.features.includes(
                              feature.id
                            );
                            return (
                              <label
                                key={feature.id}
                                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors cursor-pointer ${
                                  active
                                    ? "border-violet-500 bg-violet-500/5 text-violet-600"
                                    : "border-neutral-200 hover:bg-neutral-100"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={() =>
                                      toggleArrayFilter("features", feature.id)
                                    }
                                    className="h-4 w-4 rounded border-neutral-300 text-violet-500 focus:ring-violet-500"
                                  />
                                  <span className="flex items-center gap-2 font-medium">
                                    {feature.icon} {feature.nameKey}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Top bar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-20 mb-6 rounded-3xl border border-neutral-100/60 bg-white/80 p-4 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="relative w-full sm:flex-1">
                  <Search
                    size={16}
                    className={`pointer-events-none absolute ${
                      isRtl ? "right-4" : "left-4"
                    } top-1/2 -translate-y-1/2 text-neutral-400`}
                  />
                  <input
                    type="text"
                    placeholder={isRtl ? "ابحث عن هدايا..." : "Search gifts..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`h-11 w-full ${
                      isRtl ? "pr-11 pl-4" : "pl-11 pr-4"
                    } rounded-full border border-neutral-200 bg-neutral-100 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-colors focus:border-emerald-500 focus:bg-white`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`absolute ${
                        isRtl ? "left-3" : "right-3"
                      } top-1/2 -translate-y-1/2 rounded-full p-1.5 text-neutral-400 hover:text-neutral-600`}
                      aria-label={isRtl ? "مسح البحث" : "Clear search"}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  {isMobile && (
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-bold text-white hover:opacity-95"
                    >
                      <Filter size={14} />
                      {isRtl ? "الفلاتر" : "Filters"}
                      {activeFiltersCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-500">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  )}
                  <div className="relative z-30" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      <span className="hidden sm:inline">
                        {isRtl ? "ترتيب حسب: " : "Sort by: "}
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {getSortLabel(filters.sortBy)}
                      </span>
                      <ChevronDown size={16} className="text-neutral-400" />
                    </button>
                    <AnimatePresence>
                      {showSortOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.16 }}
                          className={`absolute mt-2
w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ${
                            isRtl ? "left-0" : "right-0"
                          }`}
                        >
                          {filterOptions.sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateFilter("sortBy", option.value);
                                setShowSortOptions(false);
                              }}
                              className={`w-full ${
                                isRtl ? "text-right" : "text-left"
                              } px-4 py-2 text-sm transition-colors hover:bg-neutral-100 ${
                                filters.sortBy === option.value
                                  ? "bg-neutral-100 text-neutral-900"
                                  : "text-neutral-700"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="hidden items-center rounded-full bg-neutral-100 p-1 sm:flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded-full p-2 ${
                        viewMode === "grid"
                          ? "bg-white text-emerald-500 shadow-sm"
                          : "text-neutral-500 hover:bg-neutral-200"
                      }`}
                      aria-label="Grid"
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-full p-2 ${
                        viewMode === "list"
                          ? "bg-white text-emerald-500 shadow-sm"
                          : "text-neutral-500 hover:bg-neutral-200"
                      }`}
                      aria-label="List"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-20"
                >
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-emerald-500" />
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="group flex w-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white "
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="block flex-1"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <ProductImage
                              src={product.imageUrl}
                              alt={isRtl ? product.nameAr : product.nameEn}
                              className="h-full w-full object-cover"
                              width={240}
                              height={240}
                              aspectRatio="square"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              quality={100}
                              priority={index < 8}
                              showZoom={false}
                              placeholderSize={80}
                              enableBlurUp={false}
                            />
                            <div className="absolute start-2 top-2 flex flex-col gap-1">
                              {product.isBestSeller && (
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-medium text-white shadow">
                                  <Flame size={10} />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] font-medium text-white shadow">
                                  <Sparkles size={10} />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="relative border-t border-neutral-100 bg-white p-3">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="mt-1 mb-1 line-clamp-1 text-sm font-bold text-neutral-900 drop-shadow-sm">
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-1 text-base font-extrabold text-neutral-900">
                              {isRtl ? (
                                <>
                                  {product.price}
                                  <RiyalSymbol className="h-3.5 w-3.5 text-neutral-900" />
                                </>
                              ) : (
                                <>
                                  <RiyalSymbol className="h-3.5 w-3.5 text-neutral-900" />
                                  {product.price}
                                </>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <FavoriteButton
                                product={product}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-rose-500 shadow-md transition-colors hover:bg-neutral-50"
                                size={16}
                              />
                              <AddToCartButton
                                product={product}
                                variant="primary"
                                size="sm"
                                className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:opacity-95"
                                showLabel={!isMobile}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 space-y-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex flex-col items-start gap-4 rounded-3xl border border-neutral-100 bg-white p-4 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.08)] transition-colors hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] sm:flex-row"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50"
                        >
                          <ProductImage
                            src={product.imageUrl}
                            alt={isRtl ? product.nameAr : product.nameEn}
                            className="h-full w-full rounded-2xl object-cover"
                            width={112}
                            height={112}
                            aspectRatio="square"
                            sizes="112px"
                            quality={100}
                            priority={index < 4}
                            showZoom={false}
                            placeholderSize={80}
                            enableBlurUp={false}
                          />
                        </Link>
                        <div className="flex w-full flex-1 flex-col justify-between">
                          <div>
                            <div className="mb-1 flex items-center justify-between">
                              <Link to={`/product/${product.id}`}>
                                <h3 className="text-base font-bold text-neutral-900 hover:text-emerald-500">
                                  {isRtl ? product.nameAr : product.nameEn}
                                </h3>
                              </Link>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {product.isBestSeller && (
                                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-violet-500 px-2 py-0.5 text-xs font-semibold text-white">
                                  <Flame size={12} className="text-white" />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                                  <Sparkles size={12} className="text-white" />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm text-neutral-600">
                              {isRtl
                                ? product.descriptionAr
                                : product.descriptionEn}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="flex items-center gap-1 text-lg font-extrabold text-neutral-900">
                              {isRtl ? (
                                <>
                                  {product.price}
                                  <RiyalSymbol className="h-4 w-4 text-neutral-900" />
                                </>
                              ) : (
                                <>
                                  <RiyalSymbol className="h-4 w-4 text-neutral-900" />
                                  {product.price}
                                </>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <FavoriteButton
                                product={product}
                                className="rounded-full bg-neutral-100 p-2 text-rose-500 hover:bg-neutral-200"
                                size={16}
                              />
                              <AddToCartButton
                                product={product}
                                variant="primary"
                                size="sm"
                                className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:opacity-95"
                                showLabel={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-neutral-100/60 bg-white/80 p-10 text-center shadow-[0_6px_24px_-8px_rgba(0,0,0,0.08)]"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                    <Search size={40} className="text-neutral-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-extrabold text-neutral-900">
                    {isRtl ? "لا توجد هدايا" : "No Gifts Found"}
                  </h3>
                  <p className="mx-auto mb-8 max-w-sm text-sm text-neutral-600">
                    {isRtl
                      ? "لا توجد هدايا تطابق معايير البحث. جرب تعديل الفلاتر."
                      : "No gifts match the criteria. Try adjusting filters."}
                  </p>
                  <button
                    className="mx-auto flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-bold text-white hover:opacity-95"
                    onClick={clearFilters}
                  >
                    <X size={14} />
                    {isRtl ? "مسح الفلاتر" : "Clear Filters"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              className={`fixed inset-y-0 ${
                isRtl ? "right-0" : "left-0"
              } w-full overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out sm:w-80`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
                <h3 className="flex items-center gap-2 text-2xl font-extrabold text-neutral-900">
                  <Filter size={20} className="text-violet-500" />
                  {isRtl ? "الفلاتر" : "Filters"}
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
                  aria-label={isRtl ? "إغلاق" : "Close"}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-neutral-100 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <DollarSign size={18} className="text-emerald-500" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </h4>
                  <div className="grid gap-3">
                    {priceRanges.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center rounded-xl border px-4 py-3 text-base transition-colors cursor-pointer ${
                          filters.priceRange[0] === option.range[0] &&
                          filters.priceRange[1] === option.range[1]
                            ? "border-violet-500 bg-violet-500/5 text-violet-600"
                            : "border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            filters.priceRange[0] === option.range[0] &&
                            filters.priceRange[1] === option.range[1]
                          }
                          onChange={() =>
                            handlePriceRangeSelect(
                              option.range[0],
                              option.range[1]
                            )
                          }
                          className="h-5 w-5 rounded-full border-neutral-300 text-violet-500 focus:ring-violet-500"
                        />
                        <span className="font-medium ms-3 flex items-center gap-2">
                          {option.label}
                          <RiyalSymbol className="h-4 w-4" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-100 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <Sparkles size={18} className="text-emerald-500" />
                    {isRtl ? "المميزات" : "Features"}
                  </h4>
                  <div className="grid gap-3">
                    {filterOptions.features.map((feature) => (
                      <label
                        key={feature.id}
                        className={`flex items-center rounded-xl border px-4 py-3 text-base transition-colors cursor-pointer ${
                          filters.features.includes(feature.id)
                            ? "border-violet-500 bg-violet-500/5 text-violet-600"
                            : "border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.id)}
                          onChange={() =>
                            toggleArrayFilter("features", feature.id)
                          }
                          className="h-5 w-5 rounded border-neutral-300 text-violet-500 focus:ring-violet-500"
                        />
                        <span className="font-medium ms-3 flex items-center gap-2">
                          {feature.icon} {feature.nameKey}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialGiftsPage;
