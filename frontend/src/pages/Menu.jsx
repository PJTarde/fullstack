import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "@/data/products";
import ItemCard from "@/components/ItemCard";
import { Search } from "lucide-react";
import api, { API_BASE_URL } from '../api/axios';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const formatted = res.data.map((p) => ({
          ...p,
          id: p._id,
          image: p.image?.startsWith("/") ? `${API_BASE_URL}${p.image}` : p.image,
          rating: p.rating || 4.5,
          isVeg: p.category.toLowerCase().includes("cake") || p.category.toLowerCase().includes("veg")
        }));
        // Optional: filter out strictly "Out of stock" items if you prefer
        // setProducts(liveProducts.filter(p => p.countInStock > 0));
        setProducts(formatted);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    // Normalize both strings to handle spaces vs hyphens (e.g. "indian-sweets" vs "Indian Sweets")
    const normalizedActive = activeCategory.toLowerCase().replace(/-/g, ' ');
    const normalizedProduct = (p.category || "").toLowerCase().replace(/-/g, ' ');

    const matchCategory =
      activeCategory === "all" || 
      normalizedProduct.includes(normalizedActive) ||
      (activeCategory === "cakes" && normalizedProduct.includes("cake"));

    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
      
    return matchCategory && matchSearch;
  });

  return (
    <div className="container py-6">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <p className="py-16 text-center text-muted-foreground">
          Loading menu...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ItemCard key={p.id} product={p} />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No items found.
        </p>
      )}
    </div>
  );
};

export default Menu;
