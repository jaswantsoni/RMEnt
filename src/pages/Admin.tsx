import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Search, Pencil, Trash2, Loader2, RefreshCw,
  Package, Tag, ShoppingBag, BarChart3, Image as ImageIcon,
  ChevronRight, ChevronDown, Upload,
} from 'lucide-react';
import { adminProductApi, adminCategoryApi, adminOrderApi } from '@/lib/adminApi';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { CategoryFormDialog } from '@/components/admin/CategoryFormDialog';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-6 flex items-start gap-4">
      <div className="p-3 rounded-md bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

// ── Image cell ────────────────────────────────────────────────────────────────
function ProductImage({ src, name }: { src?: string; name: string }) {
  if (!src) return (
    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
      <ImageIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  return <img src={src} alt={name} className="w-10 h-10 rounded object-cover flex-shrink-0" />;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productDialog, setProductDialog] = useState<{ open: boolean; product?: any }>({ open: false });
  const [deleteProduct, setDeleteProduct] = useState<any>(null);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catDialog, setCatDialog] = useState<{ open: boolean; item?: any; mode: 'category' | 'subcategory' }>({ open: false, mode: 'category' });
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
  }, [isAuthenticated]);

  // ── Load data ───────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params: Record<string, string> = { page: productPage.toString(), limit: '20' };
      if (productSearch) params.search = productSearch;
      const res = await adminProductApi.list(params);
      setProducts(res.data || res.products || []);
      setProductTotal(res.total || 0);
    } catch (err: any) {
      toast({ title: 'Failed to load products', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingProducts(false);
    }
  }, [productPage, productSearch]);

  const loadCategories = useCallback(async () => {
    setLoadingCats(true);
    try {
      const res = await adminCategoryApi.list();
      setCategories(res.data || res.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await adminOrderApi.list();
      setOrders(res.data?.invoices || res.invoices || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadOrders(); }, [loadOrders]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleImageUpload = async (product: any, file: File) => {
    setUploadingImage(product.item_id);
    try {
      await adminProductApi.uploadImageDirect(product.item_id, file);
      toast({ title: 'Image uploaded' });
      loadProducts();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleDeleteCategory = async (id: string, mode: 'category' | 'subcategory') => {
    try {
      if (mode === 'category') await adminCategoryApi.delete(id);
      else await adminCategoryApi.deleteSub(id);
      toast({ title: 'Deleted' });
      loadCategories();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    }
  };

  const toggleCat = (id: string) => setExpandedCats(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const inStockCount = products.filter(p => (p.stock_on_hand || p.available_stock || 0) > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 lg:px-8 py-24">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">ekart24 — Inventory & Store Management</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {user?.email || 'Admin'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Total Products" value={productTotal} sub={`${inStockCount} in stock`} />
          <StatCard icon={Tag} label="Categories" value={categories.length} sub={`${categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0)} subcategories`} />
          <StatCard icon={ShoppingBag} label="Orders" value={orders.length} />
          <StatCard icon={BarChart3} label="Out of Stock" value={products.filter(p => !(p.stock_on_hand || p.available_stock || 0)).length} />
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* ── PRODUCTS TAB ─────────────────────────────────────────────────── */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={e => { setProductSearch(e.target.value); setProductPage(1); }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={loadProducts} disabled={loadingProducts}>
                  <RefreshCw className={cn('h-4 w-4', loadingProducts && 'animate-spin')} />
                </Button>
                <Button onClick={() => setProductDialog({ open: true })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProducts ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No products found. Add your first product.
                      </TableCell>
                    </TableRow>
                  ) : products.map(p => (
                    <TableRow key={p.item_id || p.id}>
                      <TableCell>
                        <label className="cursor-pointer relative group">
                          <ProductImage src={p.image_url} name={p.name} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => e.target.files?.[0] && handleImageUpload(p, e.target.files[0])}
                          />
                          {uploadingImage === p.item_id ? (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded">
                              <Loader2 className="h-3 w-3 animate-spin" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                              <Upload className="h-3 w-3" />
                            </div>
                          )}
                        </label>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.item_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.sku || '—'}</TableCell>
                      <TableCell className="text-sm">{p.productCategory?.name || p.category || '—'}</TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <span>₹{(p.rate || 0).toLocaleString()}</span>
                          {p.sales_rate && p.sales_rate !== p.rate && (
                            <span className="text-xs text-muted-foreground line-through ml-1">₹{p.sales_rate.toLocaleString()}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(p.stock_on_hand || p.available_stock || 0) > 0 ? 'default' : 'destructive'} className="text-xs">
                          {p.stock_on_hand || p.available_stock || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">
                          {p.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setProductDialog({ open: true, product: p })}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteProduct(p)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            {productTotal > 20 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {(productPage - 1) * 20 + 1}–{Math.min(productPage * 20, productTotal)} of {productTotal}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={productPage === 1} onClick={() => setProductPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={productPage * 20 >= productTotal} onClick={() => setProductPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── CATEGORIES TAB ───────────────────────────────────────────────── */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={loadCategories} disabled={loadingCats}>
                  <RefreshCw className={cn('h-4 w-4', loadingCats && 'animate-spin')} />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCatDialog({ open: true, mode: 'subcategory' })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Subcategory
                </Button>
                <Button onClick={() => setCatDialog({ open: true, mode: 'category' })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
              </div>
            </div>

            <Card>
              {loadingCats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No categories yet. Create your first one.</div>
              ) : (
                <div className="divide-y divide-border">
                  {categories.map(cat => (
                    <div key={cat.id}>
                      {/* Category row */}
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                        <button onClick={() => toggleCat(cat.id)} className="text-muted-foreground">
                          {expandedCats.has(cat.id)
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />}
                        </button>
                        {cat.image_url
                          ? <img src={cat.image_url} alt={cat.name} className="w-9 h-9 rounded object-cover" />
                          : <div className="w-9 h-9 rounded bg-muted flex items-center justify-center"><Tag className="h-4 w-4 text-muted-foreground" /></div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.slug} · {cat.subcategories?.length || 0} subcategories</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCatDialog({ open: true, item: cat, mode: 'category' })}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat.id, 'category')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {expandedCats.has(cat.id) && cat.subcategories?.map((sub: any) => (
                        <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 pl-12 bg-muted/20 hover:bg-muted/40 transition-colors">
                          {sub.image_url
                            ? <img src={sub.image_url} alt={sub.name} className="w-7 h-7 rounded object-cover" />
                            : <div className="w-7 h-7 rounded bg-muted flex items-center justify-center"><Tag className="h-3 w-3 text-muted-foreground" /></div>
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{sub.name}</p>
                            <p className="text-xs text-muted-foreground">{sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCatDialog({ open: true, item: sub, mode: 'subcategory' })}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(sub.id, 'subcategory')}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ── ORDERS TAB ───────────────────────────────────────────────────── */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{orders.length} orders total</p>
              <Button variant="outline" size="icon" onClick={loadOrders} disabled={loadingOrders}>
                <RefreshCw className={cn('h-4 w-4', loadingOrders && 'animate-spin')} />
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingOrders ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  ) : orders.map((o: any) => (
                    <TableRow key={o.id || o.zoho_invoice_id}>
                      <TableCell className="font-mono text-sm">{o.invoice_number || o.zoho_invoice_id || o.id}</TableCell>
                      <TableCell className="text-sm">{o.customer?.email || o.customer_id || '—'}</TableCell>
                      <TableCell className="text-sm">{o.line_items?.length || '—'}</TableCell>
                      <TableCell className="text-sm">
                        {o.total ? `₹${Number(o.total).toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {o.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {/* Product form dialog */}
      <ProductFormDialog
        open={productDialog.open}
        product={productDialog.product}
        onClose={() => setProductDialog({ open: false })}
        onSaved={loadProducts}
      />

      {/* Category form dialog */}
      <CategoryFormDialog
        open={catDialog.open}
        item={catDialog.item}
        mode={catDialog.mode}
        categories={categories}
        onClose={() => setCatDialog({ open: false, mode: 'category' })}
        onSaved={loadCategories}
      />

      {/* Delete product confirm */}
      <AlertDialog open={!!deleteProduct} onOpenChange={v => !v && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteProduct?.name}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                try {
                  // No delete endpoint yet — show info
                  toast({ title: 'Delete not yet supported via API', description: 'Use the database directly for now.' });
                } finally {
                  setDeleteProduct(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
