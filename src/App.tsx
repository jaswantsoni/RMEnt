import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from 'lucide-react';

// Eager load critical pages
import Index from "./pages/Index";
import PopCallback from './pages/PopCallBack';
import { usePopupLoginListener } from './hooks/usePopupLoginListener';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingReturns from './pages/ShippingReturns';
import FAQ from './pages/FAQ';

// Lazy load non-critical pages for code splitting
const Collections = lazy(() => import("./pages/Collections"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
// const About = lazy(() => import("./pages/About"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Search = lazy(() => import("./pages/Search"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Account = lazy(() => import("./pages/Account"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ManualUpload = lazy(() => import("./pages/ManualUpload"));
const Products = lazy(() => import("./pages/Products"));
const ShopifyProducts = lazy(() => import("./pages/ShopifyProducts"));
const NewsletterThankYou = lazy(() => import("./pages/NewsletterThankYou"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
   usePopupLoginListener(),
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/account/:tab" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/products" element={<Products />} />
            <Route path="/shopify" element={<ShopifyProducts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manual-upload" element={<ManualUpload />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/popup-callback" element={<PopCallback />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/shipping" element={<ShippingReturns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/newsletter-thank-you" element={<NewsletterThankYou />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
