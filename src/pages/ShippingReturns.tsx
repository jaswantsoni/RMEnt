import { useEffect } from 'react';
import { Package, Truck, RefreshCw, AlertCircle, Clock, Shield, DollarSign, MapPin, Phone, Mail, CheckCircle, XCircle, FileText, Calendar, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const ShippingReturns = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <CartDrawer />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Shipping & Returns
            </h1>
            <p className="text-lg text-muted-foreground">
              At Azzaro Home, we are committed to delivering your lighting pieces safely and efficiently. 
              Please review our shipping and return policies below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        
        {/* Shipping Policy Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/20 border border-primary/30 rounded-lg shadow-sm">
              <Truck className="h-6 w-6 text-slate-800" />
            </div>
            <h2 className="text-3xl font-display font-semibold">Shipping Policy</h2>
          </div>

          {/* Order Processing */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Order Processing</h3>
                <div className="prose prose-gray max-w-none text-muted-foreground">
                  <p className="mb-3">
                    All orders are processed within <strong className="text-foreground">2–4 business days</strong> after payment confirmation. 
                    Once your order ships, you will receive a confirmation email with tracking information.
                  </p>
                  <p className="text-sm italic">
                    Custom or special-order items may require additional processing time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="mb-10 bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Shipping Charges</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Free Shipping</strong> on all orders of <strong className="text-primary">$1,000 and above</strong> (within the USA).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  For orders below $1,000, shipping charges are calculated at checkout based on item size, weight, and destination.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Delivery Time</h3>
            </div>
            <p className="text-muted-foreground mb-4">Estimated delivery times:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Standard Shipping</h4>
                </div>
                <p className="text-2xl font-bold text-primary mb-1">5–10 days</p>
                <p className="text-sm text-muted-foreground">Business days</p>
              </div>
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Freight Delivery</h4>
                </div>
                <p className="text-2xl font-bold text-primary mb-1">7–14 days</p>
                <p className="text-sm text-muted-foreground">Large Chandeliers & Oversized Items</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Delivery times may vary depending on location and carrier schedules.
            </p>
          </div>

          {/* Freight & Oversized Items */}
          <div className="mb-10 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Package className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-1 flex-shrink-0" />
              <h3 className="text-xl font-semibold">Freight & Oversized Items</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Large lighting fixtures and chandeliers are shipped via freight carriers.
            </p>
            <div className="space-y-3">
              <p className="text-muted-foreground"><strong className="text-foreground">Please note:</strong></p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-500 mt-1">•</span>
                  <span className="text-muted-foreground">Freight deliveries are curbside unless otherwise arranged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-500 mt-1">•</span>
                  <span className="text-muted-foreground">Someone must be available to receive and inspect the shipment at delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-500 mt-1">•</span>
                  <span className="text-muted-foreground">We recommend inspecting all packages before signing the delivery receipt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-500 mt-1">•</span>
                  <span className="text-muted-foreground">If visible damage is present, please note it on the delivery receipt and contact us immediately.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Shipping Damage & Claims */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Shipping Damage & Claims</h3>
                <p className="text-muted-foreground mb-3">If your item arrives damaged:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Notify us within <strong className="text-foreground">48 hours of delivery</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Provide clear photos of the packaging and damaged product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Keep all original packaging materials</span>
                  </li>
                </ul>
                <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                  Failure to report damage within 48 hours may result in claim denial.
                </p>
              </div>
            </div>
          </div>

          {/* Lost or Delayed Shipments */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Lost or Delayed Shipments</h3>
                <p className="text-muted-foreground">
                  If your order appears delayed or lost, please contact us and we will coordinate with the shipping carrier 
                  to resolve the issue promptly.
                </p>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">International Shipping</h3>
                <p className="text-muted-foreground">
                  Currently, we ship within the <strong className="text-foreground">United States only</strong>. 
                  For international inquiries, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t my-16"></div>

        {/* Returns & Refunds Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/20 border border-primary/30 rounded-lg shadow-sm">
              <RefreshCw className="h-6 w-6 text-slate-800" />
            </div>
            <h2 className="text-3xl font-display font-semibold">Returns & Refunds</h2>
          </div>

          <p className="text-lg text-muted-foreground mb-10">
            We want you to be confident in your purchase.
          </p>

          {/* Return Eligibility */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Return Eligibility</h3>
                <p className="text-muted-foreground mb-4">
                  Returns are accepted within <strong className="text-foreground">14 days of delivery</strong>.
                </p>
                <p className="text-muted-foreground mb-3">To qualify for a return:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Item must be unused and uninstalled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Must be in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">All components and accessories must be included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">Item must be in resalable condition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="mb-10 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-100">Non-Returnable Items</h3>
            <p className="text-muted-foreground mb-3">The following items are not eligible for return:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✕</span>
                <span className="text-muted-foreground">Custom or made-to-order products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✕</span>
                <span className="text-muted-foreground">Installed or used fixtures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✕</span>
                <span className="text-muted-foreground">Clearance or final sale items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✕</span>
                <span className="text-muted-foreground">Special order finishes or configurations</span>
              </li>
            </ul>
          </div>

          {/* Return Authorization */}
          <div className="mb-10 bg-card border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-4">Return Authorization</h3>
                <p className="text-muted-foreground mb-3">
                  All returns require prior approval.
                </p>
                <p className="text-muted-foreground mb-3">
                  Please contact us to obtain a <strong className="text-foreground">Return Authorization (RA) number</strong> before 
                  shipping any item back.
                </p>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Unauthorized returns will not be accepted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Restocking Fee */}
          <div className="mb-10">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Restocking Fee</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    Approved returns may be subject to a <strong className="text-foreground">15% restocking fee</strong>, 
                    depending on the product type.
                  </p>
                  <p>Original shipping charges are non-refundable.</p>
                  <p>
                    Return shipping costs are the responsibility of the customer unless the item was received damaged or defective.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="mb-10 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Refund Process</h3>
            <p className="text-muted-foreground mb-3">Once the returned item is received and inspected:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span className="text-muted-foreground">Refunds will be processed within <strong className="text-foreground">5–7 business days</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span className="text-muted-foreground">Refunds are issued to the original payment method</span>
              </li>
            </ul>
          </div>

          {/* Damaged or Defective Items */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Damaged or Defective Items</h3>
            <p className="text-muted-foreground mb-3">If you receive a defective or incorrect item:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">Contact us within <strong className="text-foreground">48 hours of delivery</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">Provide photos and order details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">We will arrange replacement or resolution promptly</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-3">Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our customer support team is here to help with any shipping or return inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </a>
            <a 
              href="mailto:rmp@ekart24.com" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-card transition-colors font-medium"
            >
              <Phone className="h-4 w-4" />
              Email Us
            </a>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingReturns;
