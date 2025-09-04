import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
  DollarSign,
  CheckCircle,
  SlidersHorizontal,
  Tag,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts } from "../data";
import categories from "../data/categories.json";
import occasions from "../data/occasions.json";
import { ProductImage } from "../features/images";
import FavoriteButton from "../components/ui/FavoriteButton";
import AddToCartButton from "../components/ui/AddToCartButton";

interface FilterState {
  priceRange: [number, number];
  features: string[];
  categories: string[];
  occasions: string[];
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

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    "price",
    "features",
    "categories",
    "occasions",
  ]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, Infinity],
    features: [],
    categories: [],
    occasions: [],
    sortBy: "featured",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) setSearchTerm(search);
    const sale = searchParams.get("sale");
    if (sale) setQuickFilters(["sale"]);
    const category = searchParams.get("category");
    if (category) {
      setFilters((prev) => ({ ...prev, categories: [category] }));
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filters.categories.length > 0)
      params.set("category", filters.categories[0]);
    setSearchParams(params);
  }, [searchTerm, filters.categories, setSearchParams]);

  const priceRanges = useMemo(
    () => [
      {
        id: "under-350",
        label: isRtl ? "أقل من 350" : "Under 350",
        range: [0, 349] as [number, number],
        count: allProducts.filter((p) => p.price < 350).length,
      },
      {
        id: "350-700",
        label: isRtl ? "350 إلى 700" : "350 to 700",
        range: [350, 700] as [number, number],
        count: allProducts.filter((p) => p.price >= 350 && p.price <= 700)
          .length,
      },
      {
        id: "700-1000",
        label: isRtl ? "700 إلى 1000" : "700 to 1000",
        range: [701, 1000] as [number, number],
        count: allProducts.filter((p) => p.price > 700 && p.price <= 1000)
          .length,
      },
      {
        id: "over-1000",
        label: isRtl ? "أكثر من 1000" : "Over 1000",
        range: [1001, Infinity] as [number, number],
        count: allProducts.filter((p) => p.price > 1000).length,
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
        count: allProducts.filter((p) => p.isBestSeller).length,
      },
      {
        id: "special",
        nameKey: isRtl ? "هدية مميزة" : "Special Gift",
        icon: <Sparkles size={14} />,
        count: allProducts.filter((p) => p.isSpecialGift).length,
      },
      {
        id: "premium",
        nameKey: isRtl ? "فاخر" : "Premium",
        icon: <Crown size={14} />,
        count: allProducts.filter((p) => p.price > 300).length,
      },
      {
        id: "affordable",
        nameKey: isRtl ? "بأسعار معقولة" : "Affordable",
        icon: <Tag size={14} />,
        count: allProducts.filter((p) => p.price <= 200).length,
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
    let products = allProducts;

    if (searchTerm) {
      products = products.filter((product) =>
        (isRtl ? product.nameAr : product.nameEn)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.categories.length > 0) {
      products = products.filter(
        (product) =>
          product.categoryId && filters.categories.includes(product.categoryId)
      );
    }

    if (filters.occasions.length > 0) {
      products = products.filter(
        (product) =>
          product.occasionId && filters.occasions.includes(product.occasionId)
      );
    }

    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== Infinity) {
      products = products.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
    }

    const allFeatures = [...filters.features, ...quickFilters];
    if (allFeatures.length > 0) {
      products = products.filter((product) =>
        allFeatures.every((feature) => {
          switch (feature) {
            case "bestseller":
              return product.isBestSeller;
            case "special":
              return product.isSpecialGift;
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
  }, [searchTerm, filters, quickFilters, isRtl]);

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (
    key: "features" | "categories" | "occasions",
    value: string
  ) => {
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

  const toggleFilterExpansion = (filterKey: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((key) => key !== filterKey)
        : [...prev, filterKey]
    );
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, Infinity],
      features: [],
      categories: [],
      occasions: [],
      sortBy: "featured",
    });
    setQuickFilters([]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.features.length > 0 ||
    filters.categories.length > 0 ||
    filters.occasions.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== Infinity ||
    searchTerm.length > 0 ||
    quickFilters.length > 0;

  const activeFiltersCount =
    filters.features.length +
    filters.categories.length +
    filters.occasions.length +
    quickFilters.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== Infinity
      ? 1
      : 0) +
    (searchTerm.length > 0 ? 1 : 0);

  const getSortLabel = (sortByValue: string): string => {
    const sortOption = filterOptions.sortOptions.find(
      (opt) => opt.value === sortByValue
    );
    return sortOption ? sortOption.label : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 text-neutral-800 font-sans p-4 sm:p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <main className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl space-y-8 sticky top-8 border border-white/20">
              <div className="flex justify-between items-center pb-4 border-b border-purple-100">
                <h3 className="text-xl font-bold flex items-center gap-2 text-neutral-900">
                  <SlidersHorizontal size={20} className="text-purple-600" />
                  {isRtl ? "الفلاتر" : "Filters"}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    {isRtl ? "مسح الكل" : "Clear All"}
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("price")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-600" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </span>
                  {expandedFilters.includes("price") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
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
                          className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
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
                            className="rounded-full border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium flex items-center gap-1">
                            {option.label}
                            <RiyalSymbol className="w-3.5 h-3.5 text-neutral-700" />
                          </span>
                          <span className="text-xs text-neutral-400 font-normal">
                            ({option.count})
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Categories Filter */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("categories")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={16} className="text-purple-600" />
                    {isRtl ? "التصنيفات" : "Categories"}
                  </span>
                  {expandedFilters.includes("categories") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("categories") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {categories.map((category) => {
                        const categoryCount = allProducts.filter(
                          (p) => p.categoryId === category.id
                        ).length;
                        return (
                          <label
                            key={category.id}
                            className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category.id)}
                              onChange={() =>
                                toggleArrayFilter("categories", category.id)
                              }
                              className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                            />
                            <span className="font-medium">
                              {t(category.nameKey)}
                            </span>
                            <span className="text-xs text-neutral-400 font-normal">
                              ({categoryCount})
                            </span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Occasions Filter */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("occasions")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={16} className="text-purple-600" />
                    {isRtl ? "المناسبات" : "Occasions"}
                  </span>
                  {expandedFilters.includes("occasions") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("occasions") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {occasions.map((occasion) => {
                        const occasionCount = allProducts.filter(
                          (p) => p.occasionId === occasion.id
                        ).length;
                        return (
                          <label
                            key={occasion.id}
                            className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={filters.occasions.includes(occasion.id)}
                              onChange={() =>
                                toggleArrayFilter("occasions", occasion.id)
                              }
                              className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                            />
                            <span className="font-medium">
                              {t(occasion.nameKey)}
                            </span>
                            <span className="text-xs text-neutral-400 font-normal">
                              ({occasionCount})
                            </span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Features Filter */}
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("features")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" />
                    {isRtl ? "المميزات" : "Features"}
                  </span>
                  {expandedFilters.includes("features") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
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
                          className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.features.includes(feature.id)}
                            onChange={() =>
                              toggleArrayFilter("features", feature.id)
                            }
                            className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium flex items-center gap-2">
                            {feature.icon} {feature.nameKey}
                          </span>
                          <span className="text-xs text-neutral-400 font-normal">
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
              className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/20 mb-6 relative z-10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="text"
                    placeholder={
                      isRtl ? "ابحث عن المنتجات..." : "Search products..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm placeholder-purple-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
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
                  <div className="relative">
                    <button
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 rounded-full border border-purple-200 text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                      <span className="hidden sm:inline">
                        {isRtl ? "ترتيب حسب" : "Sort by"}:
                      </span>
                      <span className="font-bold text-purple-600">
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
                          className="absolute w-48 mt-2 bg-white rounded-xl shadow-lg border border-purple-200 right-0 overflow-hidden z-20"
                        >
                          {filterOptions.sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateFilter("sortBy", option.value);
                                setShowSortOptions(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-purple-50 transition-colors ${
                                filters.sortBy === option.value
                                  ? "bg-purple-50 text-purple-600"
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

                  {/* View Mode Toggles */}
                  <div className="hidden sm:flex bg-purple-200 rounded-full p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-full transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-purple-500 hover:bg-purple-300"
                      }`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-full transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-purple-500 hover:bg-purple-300"
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
              {filteredProducts.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden relative transition-all duration-300"
                      >
                        <Link to={`/product/${product.id}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden group">
                            <ProductImage
                              src={product.imageUrl}
                              alt={isRtl ? product.nameAr : product.nameEn}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              width={240}
                              height={180}
                              aspectRatio="landscape"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              quality={100}
                              priority={index < 8}
                              showZoom={false}
                              placeholderSize={28}
                            />
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <Flame size={10} />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <Sparkles size={10} />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="p-3 relative">
                          <div className="absolute top-0 right-3 transform -translate-y-1/2">
                            <FavoriteButton
                              product={product}
                              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-rose-500 border border-neutral-100 transition-all duration-300 hover:scale-110"
                              size={16}
                            />
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-bold text-neutral-800 hover:text-purple-600 transition-colors line-clamp-2 mb-1 min-h-[2.5rem]">
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-base font-bold text-purple-700 flex items-center gap-1">
                              {product.price}
                              <RiyalSymbol className="w-3.5 h-3.5 text-purple-700" />
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
                    className="space-y-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md border border-neutral-100 p-4 flex flex-col sm:flex-row gap-4 items-start transition-all duration-300"
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
                            placeholderSize={28}
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between w-full">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <Link to={`/product/${product.id}`}>
                                <h3 className="text-base font-bold text-neutral-800 hover:text-purple-600 transition-colors">
                                  {isRtl ? product.nameAr : product.nameEn}
                                </h3>
                              </Link>
                              <FavoriteButton
                                product={product}
                                className="bg-neutral-100 rounded-full p-2 text-rose-500 hover:bg-neutral-200 transition-colors"
                                size={16}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {product.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-600 line-clamp-2">
                              {isRtl
                                ? product.descriptionAr
                                : product.descriptionEn}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-purple-700 flex items-center gap-1">
                              {product.price}
                              <RiyalSymbol className="w-4 h-4 text-purple-700" />
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
                  className="text-center py-20 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                    {isRtl ? "لا توجد منتجات" : "No Products Found"}
                  </h3>
                  <p className="text-neutral-600 mb-8 text-sm max-w-sm mx-auto">
                    {isRtl
                      ? "لا توجد منتجات تطابق معايير البحث. جرب تعديل الفلاتر أو مسحها."
                      : "No products match your search criteria. Try adjusting or clearing filters."}
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              className={`fixed inset-y-0 ${
                isRtl ? "right-0" : "left-0"
              } w-full sm:w-80 bg-white shadow-2xl overflow-y-auto p-6 transition-transform duration-300 ease-in-out`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
                  <Filter size={20} className="text-purple-600" />
                  {isRtl ? "فلاتر البحث" : "Search Filters"}
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <DollarSign size={18} className="text-purple-600" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </h4>
                  <div className="space-y-3">
                    {priceRanges.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 text-neutral-700 cursor-pointer"
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
                          className="form-radio text-purple-600 bg-purple-50 border-purple-200 focus:ring-purple-600 w-5 h-5"
                        />
                        <span className="font-medium flex items-center gap-1">
                          {option.label}
                          <RiyalSymbol className="w-3.5 h-3.5 text-neutral-700" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <Tag size={18} className="text-purple-600" />
                    {isRtl ? "التصنيفات" : "Categories"}
                  </h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() =>
                            toggleArrayFilter("categories", category.id)
                          }
                          className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="font-medium">
                          {t(category.nameKey)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Occasions Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <Tag size={18} className="text-purple-600" />
                    {isRtl ? "المناسبات" : "Occasions"}
                  </h4>
                  <div className="space-y-3">
                    {occasions.map((occasion) => (
                      <label
                        key={occasion.id}
                        className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.occasions.includes(occasion.id)}
                          onChange={() =>
                            toggleArrayFilter("occasions", occasion.id)
                          }
                          className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="font-medium">
                          {t(occasion.nameKey)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter (Mobile) */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <Sparkles size={18} className="text-purple-600" />
                    {isRtl ? "المميزات" : "Features"}
                  </h4>
                  <div className="space-y-3">
                    {filterOptions.features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center gap-3 text-neutral-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.id)}
                          onChange={() =>
                            toggleArrayFilter("features", feature.id)
                          }
                          className="form-checkbox rounded-md text-purple-600 bg-purple-50 border-purple-200 focus:ring-purple-600 w-5 h-5"
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
              <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                <div className="text-center text-sm text-neutral-600 font-medium">
                  <span className="font-bold text-neutral-900">
                    {filteredProducts.length}
                  </span>{" "}
                  {isRtl ? "منتج موجود" : "products found"}
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
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

export default ProductsPage;
