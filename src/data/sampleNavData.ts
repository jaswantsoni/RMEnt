import { NavCategory } from "@/components/MegaNavbar";


export const sampleNavCategories: NavCategory[] = [
  {
    name: "Living",
    href: "/living",
    featured: {
      title: "New Living Room Arrivals",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
      href: "/living/new-arrivals",
    },
    subcategories: [
      { name: "Sofas", href: "/living/sofas" },
      { name: "Sectionals", href: "/living/sectionals" },
      { name: "Chairs", href: "/living/chairs" },
      { name: "Ottomans", href: "/living/ottomans" },
      { name: "Coffee Tables", href: "/living/coffee-tables" },
      { name: "Console Tables", href: "/living/console-tables" },
      { name: "Side Tables", href: "/living/side-tables" },
      { name: "Bookcases", href: "/living/bookcases" },
      { name: "Media Consoles", href: "/living/media-consoles" },
    ],
  },
  {
    name: "Dining",
    href: "/dining",
    featured: {
      title: "Dining Room Inspiration",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
      href: "/dining/inspiration",
    },
    subcategories: [
      { name: "Dining Tables", href: "/dining/tables" },
      { name: "Dining Chairs", href: "/dining/chairs" },
      { name: "Bar Stools", href: "/dining/bar-stools" },
      { name: "Buffets & Sideboards", href: "/dining/buffets" },
      { name: "China Cabinets", href: "/dining/china-cabinets" },
      { name: "Bar Carts", href: "/dining/bar-carts" },
    ],
  },
  {
    name: "Bedroom",
    href: "/bedroom",
    featured: {
      title: "Serene Bedroom Retreats",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
      href: "/bedroom/collections",
    },
    subcategories: [
      { name: "Beds", href: "/bedroom/beds" },
      { name: "Nightstands", href: "/bedroom/nightstands" },
      { name: "Dressers", href: "/bedroom/dressers" },
      { name: "Armoires", href: "/bedroom/armoires" },
      { name: "Bedroom Benches", href: "/bedroom/benches" },
      { name: "Bedroom Chairs", href: "/bedroom/chairs" },
      { name: "Mattresses", href: "/bedroom/mattresses" },
    ],
  },
  {
    name: "Outdoor",
    href: "/outdoor",
    featured: {
      title: "Outdoor Living",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
      href: "/outdoor/collections",
    },
    subcategories: [
      { name: "Outdoor Sofas", href: "/outdoor/sofas" },
      { name: "Outdoor Chairs", href: "/outdoor/chairs" },
      { name: "Outdoor Dining", href: "/outdoor/dining" },
      { name: "Outdoor Tables", href: "/outdoor/tables" },
      { name: "Fire Pits", href: "/outdoor/fire-pits" },
      { name: "Umbrellas", href: "/outdoor/umbrellas" },
    ],
  },
  {
    name: "Lighting",
    href: "/lighting",
    featured: {
      title: "Statement Lighting",
      image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&q=80",
      href: "/lighting/chandeliers",
    },
    subcategories: [
      { name: "Chandeliers", href: "/lighting/chandeliers" },
      { name: "Pendants", href: "/lighting/pendants" },
      { name: "Table Lamps", href: "/lighting/table-lamps" },
      { name: "Floor Lamps", href: "/lighting/floor-lamps" },
      { name: "Wall Sconces", href: "/lighting/sconces" },
    ],
  },
  {
    name: "Décor",
    href: "/decor",
    featured: {
      title: "Finishing Touches",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
      href: "/decor/new",
    },
    subcategories: [
      { name: "Rugs", href: "/decor/rugs" },
      { name: "Pillows & Throws", href: "/decor/pillows-throws" },
      { name: "Wall Art", href: "/decor/wall-art" },
      { name: "Mirrors", href: "/decor/mirrors" },
      { name: "Vases", href: "/decor/vases" },
      { name: "Candles & Holders", href: "/decor/candles" },
      { name: "Sculptures", href: "/decor/sculptures" },
    ],
  },
  {
    name: "Sale",
    href: "/sale",
    subcategories: [
      { name: "Living Room Sale", href: "/sale/living" },
      { name: "Dining Room Sale", href: "/sale/dining" },
      { name: "Bedroom Sale", href: "/sale/bedroom" },
      { name: "Outdoor Sale", href: "/sale/outdoor" },
      { name: "Clearance", href: "/sale/clearance" },
    ],
  },
];
