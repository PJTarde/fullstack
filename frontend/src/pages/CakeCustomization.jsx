import { useState, useMemo } from "react";
import { cakeCustomization } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CakeCustomization = () => {
  const [flavor, setFlavor] = useState(0);
  const [size, setSize] = useState(1);
  const [eggless, setEggless] = useState(true);
  const [message, setMessage] = useState("");
  const [shape, setShape] = useState("Round");
  const [toppings, setToppings] = useState([]);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const price = useMemo(() => {
    const base = cakeCustomization.sizes[size].basePrice;
    const mult = cakeCustomization.flavors[flavor].priceMultiplier;
    const egglessExtra = eggless ? 50 : 0;
    return Math.round(base * mult + egglessExtra);
  }, [flavor, size, eggless]);

  const toppingOptions = [
    { name: "Oreo", price: 40 },
    { name: "KitKat", price: 60 },
    { name: "Sprinkles", price: 30 },
    { name: "Chocolate Chips", price: 35 },
    { name: "Dry Fruits", price: 50 },
  ];

  const cakeImages = {
    Chocolate: "/cakes/chocolate.jpg",
    Vanilla: "/cakes/vanilla.jpg",
    "Red Velvet": "/cakes/redvelvet.jpg",
    Butterscotch: "/cakes/butterscotch.jpg",
    Strawberry: "/cakes/strawberry.jpg",
    Pineapple: "/cakes/pineapple.jpg",
    "Black Forest": "/cakes/blackforest.jpg",
  };

  const handleAddToCart = () => {
    const desc = `
${cakeCustomization.flavors[flavor].name} 
- ${cakeCustomization.sizes[size].label} 
- ${shape}
- ${eggless ? "Eggless" : "With Egg"}
${toppings.length ? ` - Toppings: ${toppings.join(", ")}` : ""}
${message ? ` - "${message}"` : ""}
`;
    addItem({
      id: `custom-${Date.now()}`,
      name: "Custom Cake",
      price,
      image: "🎂",
      customization: desc,
    });
    navigate("/cart");
  };

  return (
    <div className="container max-w-2xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold mb-1">
          Design Your Cake
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Choose your preferences and we'll bake it fresh for you
        </p>

        {/* Preview */}
        <div className="mb-8 flex flex-col items-center rounded-2xl bg-warm-beige p-8">
          <img
            src={cakeImages[cakeCustomization.flavors[flavor].name]}
            alt={cakeCustomization.flavors[flavor].name}
            className="w-56 h-56 object-cover rounded-xl mb-3 shadow-md"
          />

          <p className="font-display text-lg font-semibold">
            {cakeCustomization.flavors[flavor].name}
          </p>
          <p className="text-sm text-muted-foreground">
            {cakeCustomization.sizes[size].label} ·{" "}
            {eggless ? "Eggless" : "With Egg"}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">
            ₹{price}
          </p>
        </div>

        {/* Flavor */}
        <div className="mb-6">
          <h3 className="font-display font-semibold mb-3">Flavor</h3>
          <div className="flex flex-wrap gap-2">
            {cakeCustomization.flavors.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setFlavor(i)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === flavor
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-6">
          <h3 className="font-display font-semibold mb-3">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {cakeCustomization.sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSize(i)}
                className={`rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                  i === size
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className="mb-6">
          <h3 className="font-display font-semibold mb-3">Shape</h3>

          <div className="grid grid-cols-4 gap-2">
            {["Round", "Heart", "Square", "Rectangle"].map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                  shape === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div className="mb-6">
          <h3 className="font-display font-semibold mb-3">Toppings</h3>

          <div className="flex flex-wrap gap-2">
            {toppingOptions.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  if (toppings.includes(t.name)) {
                    setToppings(toppings.filter((item) => item !== t.name));
                  } else {
                    setToppings([...toppings, t.name]);
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  toppings.includes(t.name)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t.name} +₹{t.price}
              </button>
            ))}
          </div>
        </div>

        {/* Egg/Eggless */}
        <div className="mb-6">
          <h3 className="font-display font-semibold mb-3">Type</h3>
          <div className="flex gap-2">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => setEggless(val)}
                className={`flex-1 rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                  eggless === val
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {val ? "🟢 Eggless" : "🟡 With Egg"}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h3 className="font-display font-semibold mb-3">Message on Cake</h3>
          <input
            type="text"
            placeholder="e.g. Happy Birthday Rahul!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={50}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            {message.length}/50 characters
          </p>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-warm-brown-light"
        >
          Add to Cart · ₹{price}
        </button>
      </motion.div>
    </div>
  );
};

export default CakeCustomization;
