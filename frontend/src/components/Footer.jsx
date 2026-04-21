import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍰</span>
              <h3 className="font-display text-lg font-bold">Hariom Bakers</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bringing sweetness to Sambhaji Nagar since 2005. Fresh bakes,
              traditional sweets, and custom cakes made with love.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Main Road, Sambhaji
                Nagar, India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> hello@hariombakers.com
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Hours</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Mon–Sat: 8:00 AM –
                10:00 PM
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Sunday: 9:00 AM –
                9:00 PM
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Hariom Bakers. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
