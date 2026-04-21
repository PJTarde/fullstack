import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { categories } from "@/data/products";
import ItemCard from "@/components/ItemCard";
import { motion } from "framer-motion";
import api, { API_BASE_URL } from "../api/axios";

const Index = () => {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    setReviews(storedReviews.slice(-6).reverse());

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const liveProducts = res.data.map((p) => ({
          ...p,
          id: p._id,
          image: p.image?.startsWith("/") ? `${API_BASE_URL}${p.image}` : p.image,
          rating: p.rating || 4.5,
          isVeg: p.category.toLowerCase().includes("cake") || p.category.toLowerCase().includes("veg")
        }));
        setProducts(liveProducts);
      } catch (err) {
        console.error("Error fetching live products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featured = products.slice(0, 8);

  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : featured;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-accent to-background px-4 pb-10 pt-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Fresh Bakes &<br />
              Traditional Sweets
            </h1>
            <p className="mt-3 text-muted-foreground">
              Order cakes, sweets & snacks from Hariom Bakers, Sambhaji Nagar
            </p>

            {/* Search */}
            <div className="relative mt-6">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cakes, sweets, bakery items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm shadow-card outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-card-hover focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {!search && (
        <section className="container py-8">
          <h2 className="font-display text-xl font-bold mb-5">
            What are you looking for?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/menu?category=${cat.id}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-medium text-center">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Search Results */}
      <section className="container pb-12">
        <h2 className="font-display text-xl font-bold mb-5">
          {search ? `Results for "${search}"` : "Popular Right Now"}
        </h2>
        {loading ? (
          <p className="text-muted-foreground text-center py-12">
            Loading delicious treats...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No items found. Try a different search term.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ItemCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!search && (
        <section className="container pb-12">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-warm-brown-light p-8 text-center text-primary-foreground sm:p-12">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Design Your Dream Cake
            </h2>
            <p className="mt-2 text-primary-foreground/80 text-sm">
              Choose flavor, size, and add a personal message
            </p>
            <Link
              to="/customize"
              className="mt-5 inline-block rounded-lg bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-105"
            >
              Customize Now →
            </Link>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="container pb-12">
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 shadow-sm">
                {/* Name + Avatar + Date */}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold">👤</span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>

                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}

                <div className="text-yellow-500 text-lg mb-2">
                  {"★".repeat(review.rating)}
                </div>

                {/* Feedback */}

                <p className="text-sm text-gray-600">{review.feedback}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
