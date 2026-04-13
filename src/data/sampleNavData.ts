import { NavCategory } from "@/components/MegaNavbar";

export const sampleNavCategories: NavCategory[] = [
  {
    name: "Women",
    href: "/collections/women",
    featured: {
      title: "New Women's Arrivals",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
      href: "/collections/women/new-arrivals",
    },
    subcategories: [
      { name: "Dresses", href: "/collections/women/dresses" },
      { name: "Tops & Blouses", href: "/collections/women/tops" },
      { name: "Sarees", href: "/collections/women/sarees" },
      { name: "Lehengas", href: "/collections/women/lehengas" },
      { name: "Kurtas & Suits", href: "/collections/women/kurtas" },
      { name: "Trousers & Palazzos", href: "/collections/women/trousers" },
      { name: "Jackets & Coats", href: "/collections/women/jackets" },
      { name: "Activewear", href: "/collections/women/activewear" },
    ],
  },
  {
    name: "Men",
    href: "/collections/men",
    featured: {
      title: "New Men's Arrivals",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
      href: "/collections/men/new-arrivals",
    },
    subcategories: [
      { name: "Shirts", href: "/collections/men/shirts" },
      { name: "T-Shirts & Polos", href: "/collections/men/tshirts" },
      { name: "Trousers & Chinos", href: "/collections/men/trousers" },
      { name: "Suits & Blazers", href: "/collections/men/suits" },
      { name: "Kurtas & Sherwanis", href: "/collections/men/kurtas" },
      { name: "Jackets", href: "/collections/men/jackets" },
      { name: "Activewear", href: "/collections/men/activewear" },
    ],
  },
  {
    name: "Jewellery",
    href: "/collections/jewellery",
    featured: {
      title: "Signature Jewellery",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      href: "/collections/jewellery/signature",
    },
    subcategories: [
      { name: "Necklaces", href: "/collections/jewellery/necklaces" },
      { name: "Earrings", href: "/collections/jewellery/earrings" },
      { name: "Rings", href: "/collections/jewellery/rings" },
      { name: "Bracelets & Bangles", href: "/collections/jewellery/bracelets" },
      { name: "Anklets", href: "/collections/jewellery/anklets" },
      { name: "Maang Tikka", href: "/collections/jewellery/maang-tikka" },
      { name: "Bridal Sets", href: "/collections/jewellery/bridal" },
      { name: "Men's Jewellery", href: "/collections/jewellery/men" },
    ],
  },
  {
    name: "Accessories",
    href: "/collections/accessories",
    featured: {
      title: "Complete Your Look",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      href: "/collections/accessories/new",
    },
    subcategories: [
      { name: "Handbags & Clutches", href: "/collections/accessories/bags" },
      { name: "Scarves & Stoles", href: "/collections/accessories/scarves" },
      { name: "Belts", href: "/collections/accessories/belts" },
      { name: "Sunglasses", href: "/collections/accessories/sunglasses" },
      { name: "Watches", href: "/collections/accessories/watches" },
      { name: "Hair Accessories", href: "/collections/accessories/hair" },
    ],
  },
  {
    name: "Sale",
    href: "/collections/sale",
    featured: {
      title: "Up to 50% Off",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
      href: "/collections/sale",
    },
    subcategories: [
      { name: "Women's Sale", href: "/collections/sale/women" },
      { name: "Men's Sale", href: "/collections/sale/men" },
      { name: "Jewellery Sale", href: "/collections/sale/jewellery" },
      { name: "Clearance", href: "/collections/sale/clearance" },
    ],
  },
];
