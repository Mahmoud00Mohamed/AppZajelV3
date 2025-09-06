import React, { useState, useEffect, useMemo, useRef } from "react";
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
  CheckCircle,
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
    () => specialGiftsData.map((product) => product.imageUrl),
    [specialGiftsData]
  );
  usePreloadCriticalImages(imageUrls);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        count: specialGiftsData.filter((p) => p.price < 350).length,
      },
      {
        id: "350-700",
        label: isRtl ? "350 إلى 700" : "350 to 700",
        range: [350, 700] as [number, number],
        count: specialGiftsData.filter((p) => p.price >= 350 && p.price <= 700)
          .length,
      },
      {
        id: "700-1000",
        label: isRtl ? "700 إلى 1000" : "700 to 1000",
        range: [701, 1000] as [number, number],
        count: specialGiftsData.filter((p) => p.price > 700 && p.price <= 1000)
          .length,
      },
      {
        id: "over-1000",
        label: isRtl ? "أكثر من 1000" : "Over 1000",
        range: [1001, Infinity] as [number, number],
        count: specialGiftsData.filter((p) => p.price > 1000).length,
      },
    ],
    [isRtl, specialGiftsData]
  );

  const filterOptions = {
    features: [
      {
        id: "bestseller",
        nameKey: isRtl ? "الأكثر مبيعاً" : "Best Seller",
        icon: <Flame size={14} />,
        count: specialGiftsData.filter((p) => p.isBestSeller).length,
      },
      {
        id: "premium",
        nameKey: isRtl ? "فاخر" : "Premium",
        icon: <Crown size={14} />,
        count: specialGiftsData.filter((p) => p.price > 300).length,
      },
      {
        id: "affordable",
        nameKey: isRtl ? "بأسعار معقولة" : "Affordable",
        icon: <Tag size={14} />,
        count: specialGiftsData.filter((p) => p.price <= 200).length,
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
    setFilters({
      priceRange: [0, Infinity],
      features: [],
      sortBy: "featured",
    });
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
    <div className="relative min-h-screen bg-neutral-950 text-neutral-50 p-4 sm:p-6 lg:p-12 font-sans overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-neutral-950 [background-size:20px_20px] [background-image:radial-gradient(rgb(38_38_38)_1px,transparent_1px)]" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400 mb-8 sm:mb-12 text-center drop-shadow-lg">
          {isRtl ? "هدايا مميزة" : "Special Gifts"}
        </h1>

        <main className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-neutral-900/50 backdrop-blur-lg border border-neutral-800 p-6 rounded-3xl shadow-[0_0_40px_rgba(109,40,217,0.1)] space-y-8 sticky top-8">
              <div className="flex justify-between items-center pb-4 border-b border-purple-900">
                <h3 className="text-xl font-bold flex items-center gap-2 text-neutral-50">
                  <SlidersHorizontal size={20} className="text-purple-400" />
                  {isRtl ? "الفلاتر" : "Filters"}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    {isRtl ? "مسح الكل" : "Clear All"}
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <button
                  onClick={() => toggleFilterExpansion("price")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-50"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-400" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </span>
                  {expandedFilters.includes("price") ? (
                    <ChevronUp size={16} className="text-neutral-400" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-400" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("price") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {priceRanges.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-purple-300 transition-colors"
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
                            className="rounded-full border-neutral-600 bg-neutral-700 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium flex items-center gap-1">
                            {option.label}
                            <RiyalSymbol className="w-3.5 h-3.5 text-neutral-300" />
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">
                            ({option.count})
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Features Filter */}
              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <button
                  onClick={() => toggleFilterExpansion("features")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-50"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    {isRtl ? "المميزات" : "Features"}
                  </span>
                  {expandedFilters.includes("features") ? (
                    <ChevronUp size={16} className="text-neutral-400" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-400" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("features") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {filterOptions.features.map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-purple-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.features.includes(feature.id)}
                            onChange={() =>
                              toggleArrayFilter("features", feature.id)
                            }
                            className="rounded border-neutral-600 bg-neutral-700 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium flex items-center gap-2">
                            {feature.icon} {feature.nameKey}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">
                            ({feature.count})
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>

          {/* Main Product Area */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-900/50 backdrop-blur-lg border border-neutral-800 p-5 rounded-3xl shadow-[0_0_40px_rgba(109,40,217,0.1)] mb-6 relative z-20"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:flex-1">
                  <Search
                    size={16}
                    className={`absolute ${
                      isRtl ? "right-3" : "left-3"
                    } top-1/2 -translate-y-1/2 text-purple-500`}
                  />
                  <input
                    type="text"
                    placeholder={isRtl ? "ابحث عن هدايا..." : "Search gifts..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${
                      isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-2.5 bg-neutral-800 rounded-full border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm placeholder-neutral-500 text-neutral-50`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`absolute ${
                        isRtl ? "left-3" : "right-3"
                      } top-1/2 -translate-y-1/2 text-neutral-500 hover:text-purple-400`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {isMobile && (
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      <Filter size={14} />
                      {isRtl ? "الفلاتر" : "Filters"}
                      {activeFiltersCount > 0 && (
                        <span className="bg-white text-purple-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Sort Dropdown */}
                  <div className="relative z-30" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 rounded-full border border-neutral-700 text-sm font-medium hover:bg-neutral-700 transition-colors text-neutral-50"
                    >
                      <span className="hidden sm:inline">
                        {isRtl ? "ترتيب حسب: " : "Sort by: "}
                      </span>
                      <span className="font-bold text-purple-400">
                        {getSortLabel(filters.sortBy)}
                      </span>
                      <ChevronDown size={16} className="text-purple-400" />
                    </button>
                    <AnimatePresence>
                      {showSortOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute w-48 mt-2 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700 ${
                            isRtl ? "left-0" : "right-0"
                          } overflow-hidden`}
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
                              } px-4 py-2 text-sm font-medium hover:bg-neutral-700 transition-colors ${
                                filters.sortBy === option.value
                                  ? "bg-neutral-700 text-purple-400"
                                  : "text-neutral-300"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* View Mode Toggles */}
                  <div className="hidden sm:flex bg-neutral-800 rounded-full p-1 border border-neutral-700">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-full transition-colors ${
                        viewMode === "grid"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-purple-400 hover:bg-neutral-700"
                      }`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-full transition-colors ${
                        viewMode === "list"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-purple-400 hover:bg-neutral-700"
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product List/Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-20"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-neutral-900/50 backdrop-blur-lg rounded-2xl shadow-[0_0_40px_rgba(109,40,217,0.1)] border border-neutral-800 overflow-hidden relative transition-all duration-300 flex flex-col w-full group hover:border-purple-600"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="block flex-1"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <ProductImage
                              src={product.imageUrl}
                              alt={isRtl ? product.nameAr : product.nameEn}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.isBestSeller && (
                                <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-900 bg-amber-200/80 backdrop-blur-[2px] rounded-full pl-2 pr-2.5 py-0.5">
                                  <Flame size={12} className="text-amber-600" />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-purple-900 bg-purple-200/80 backdrop-blur-[2px] rounded-full pl-2 pr-2.5 py-0.5">
                                  <Sparkles
                                    size={12}
                                    className="text-purple-600"
                                  />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="relative p-3 bg-neutral-900/50 border-t border-neutral-800">
                          <div
                            className={`absolute top-0 -translate-y-1/2 ${
                              isRtl ? "right-3" : "left-3"
                            }`}
                          >
                            <FavoriteButton
                              product={product}
                              className="w-9 h-9 bg-neutral-800 rounded-full shadow-lg flex items-center justify-center text-rose-500 border border-neutral-700 transition-all duration-300 hover:scale-110"
                              size={16}
                            />
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-bold text-neutral-50 hover:text-purple-400 transition-colors line-clamp-1 mt-1 mb-1">
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-base font-bold text-purple-400 flex items-center gap-1">
                              {isRtl ? (
                                <>
                                  {product.price}
                                  <RiyalSymbol className="w-3.5 h-3.5 text-purple-400" />
                                </>
                              ) : (
                                <>
                                  <RiyalSymbol className="w-3.5 h-3.5 text-purple-400" />
                                  {product.price}
                                </>
                              )}
                            </p>
                            <AddToCartButton
                              product={product}
                              variant="primary"
                              size="sm"
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                              showLabel={!isMobile}
                            />
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
                    className="space-y-4 relative z-10"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-neutral-900/50 backdrop-blur-lg rounded-xl shadow-[0_0_40px_rgba(109,40,217,0.1)] border border-neutral-800 p-4 flex flex-col sm:flex-row gap-4 items-start transition-all duration-300 hover:border-purple-600"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-shrink-0 w-28 h-28"
                        >
                          <ProductImage
                            src={product.imageUrl}
                            alt={isRtl ? product.nameAr : product.nameEn}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
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
                        <div className="flex-1 flex flex-col justify-between w-full">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <Link to={`/product/${product.id}`}>
                                <h3 className="text-base font-bold text-neutral-50 hover:text-purple-400 transition-colors">
                                  {isRtl ? product.nameAr : product.nameEn}
                                </h3>
                              </Link>
                              <FavoriteButton
                                product={product}
                                className="bg-neutral-800 rounded-full p-2 text-rose-500 hover:bg-neutral-700 transition-colors"
                                size={16}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {product.isBestSeller && (
                                <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-900 bg-amber-200/80 backdrop-blur-[2px] rounded-full px-2 py-0.5">
                                  <Flame size={12} className="text-amber-600" />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-purple-900 bg-purple-200/80 backdrop-blur-[2px] rounded-full px-2 py-0.5">
                                  <Sparkles
                                    size={12}
                                    className="text-purple-600"
                                  />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-400 line-clamp-2">
                              {isRtl
                                ? product.descriptionAr
                                : product.descriptionEn}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-purple-400 flex items-center gap-1">
                              {isRtl ? (
                                <>
                                  {product.price}
                                  <RiyalSymbol className="w-4 h-4 text-purple-400" />
                                </>
                              ) : (
                                <>
                                  <RiyalSymbol className="w-4 h-4 text-purple-400" />
                                  {product.price}
                                </>
                              )}
                            </p>
                            <AddToCartButton
                              product={product}
                              variant="primary"
                              size="sm"
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                              showLabel={true}
                            />
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
                  className="text-center py-20 bg-neutral-900/50 backdrop-blur-lg rounded-2xl shadow-[0_0_40px_rgba(109,40,217,0.1)] border border-neutral-800"
                >
                  <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-50 mb-3">
                    {isRtl ? "لا توجد هدايا" : "No Gifts Found"}
                  </h3>
                  <p className="text-neutral-400 mb-8 text-sm max-w-sm mx-auto">
                    {isRtl
                      ? "لا توجد هدايا تطابق معايير البحث. جرب تعديل الفلاتر أو مسحها."
                      : "No gifts match your search criteria. Try adjusting or clearing filters."}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors flex items-center gap-2 mx-auto text-sm font-bold shadow-lg"
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
            className="fixed inset-0 z-50 bg-black/80"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              className={`fixed inset-y-0 ${
                isRtl ? "right-0" : "left-0"
              } w-full sm:w-80 bg-neutral-900 border-l border-neutral-800 shadow-2xl overflow-y-auto p-6 transition-transform duration-300 ease-in-out`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-neutral-50">
                  <Filter size={20} className="text-purple-400" />
                  {isRtl ? "فلاتر البحث" : "Search Filters"}
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3 text-neutral-50">
                    <DollarSign size={18} className="text-purple-400" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </h4>
                  <div className="space-y-3">
                    {priceRanges.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 text-neutral-300 cursor-pointer"
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
                          className="form-radio text-purple-600 bg-neutral-800 border-neutral-700 focus:ring-purple-600 w-5 h-5"
                        />
                        <span className="font-medium flex items-center gap-1">
                          {option.label}
                          <RiyalSymbol className="w-3.5 h-3.5 text-neutral-300" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3 text-neutral-50">
                    <Sparkles size={18} className="text-purple-400" />
                    {isRtl ? "المميزات" : "Features"}
                  </h4>
                  <div className="space-y-3">
                    {filterOptions.features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center gap-3 text-neutral-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.id)}
                          onChange={() =>
                            toggleArrayFilter("features", feature.id)
                          }
                          className="form-checkbox rounded-md text-purple-600 bg-neutral-800 border-neutral-700 focus:ring-purple-600 w-5 h-5"
                        />
                        <span className="font-medium flex items-center gap-2">
                          {feature.icon} {feature.nameKey}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
                <div className="text-center text-sm text-neutral-400 font-medium">
                  <span className="font-bold text-neutral-50">
                    {filteredProducts.length}
                  </span>{" "}
                  {isRtl ? "هدايا موجودة" : "gifts found"}
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-neutral-800 text-rose-400 rounded-full hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
                >
                  <X size={16} />
                  {isRtl ? "مسح الفلاتر" : "Clear Filters"}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-bold text-sm shadow-lg"
                >
                  <CheckCircle size={16} />
                  {isRtl ? "تطبيق الفلاتر" : "Apply Filters"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialGiftsPage;
