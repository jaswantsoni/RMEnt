import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { apiClient } from '@/lib/apiClient';
import { formatINR } from '@/lib/usUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LineItem {
  product_name: string;
  image_url: string;
  quantity: number;
  unit: string;
  price: number;
  tax: number;
  total: number;
}

interface Address {
  street: string;
  address: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  attention: string;
}

interface Order {
  line_items: LineItem[];
  shipping_address_details: Address;
  billing_address_details: Address;
  total: number;
  sub_total: number;
  tax_total: number;
  invoice_date: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await apiClient.get('/api/contact/orders');
        setOrders(response.data.invoices || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const formatDate=(dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-display font-semibold mb-8">
            Order <span className="text-gradient-gold">History</span>
          </h1>

          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <>
                        <TableRow
                          key={idx}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                        >
                          <TableCell>
                            <img
                              src={order.line_items[0]?.image_url}
                              alt={order.line_items[0]?.product_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.line_items[0]?.product_name}</p>
                              {order.line_items.length > 1 && (
                                <p className="text-sm text-muted-foreground">+{order.line_items.length - 1} more items</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(order.invoice_date) || 'N/A'}</TableCell>
                          <TableCell className="text-right font-semibold">{formatINR(order.total)}</TableCell>
                          <TableCell>
                            {expandedRow === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </TableCell>
                        </TableRow>
                        {expandedRow === idx && (
                          <TableRow>
                            <TableCell colSpan={4} className="bg-muted/30">
                              <div className="p-4 space-y-4">
                                {/* All Items */}
                                <div>
                                  <h4 className="font-medium mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.line_items.map((item, itemIdx) => (
                                      <div key={itemIdx} className="flex gap-3 text-sm">
                                        <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                                        <div className="flex-1">
                                          <p className="font-medium">{item.product_name}</p>
                                          <p className="text-muted-foreground">Qty: {item.quantity} {item.unit}</p>
                                        </div>
                                        <p className="font-medium">{formatINR(item.total)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Addresses */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4" />
                                      <h4 className="font-medium">Shipping</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {order.shipping_address_details.attention}<br />
                                      {order.shipping_address_details.address}<br />
                                      {order.shipping_address_details.city}, {order.shipping_address_details.state} {order.shipping_address_details.zip}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4" />
                                      <h4 className="font-medium">Billing</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {order.billing_address_details.attention}<br />
                                      {order.billing_address_details.address}<br />
                                      {order.billing_address_details.city}, {order.billing_address_details.state} {order.billing_address_details.zip}
                                    </p>
                                  </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-3 space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatINR(order.sub_total)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatINR(order.tax_total)}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">{formatINR(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
