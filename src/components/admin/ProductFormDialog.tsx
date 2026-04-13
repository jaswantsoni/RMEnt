import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { adminProductApi, adminCategoryApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: any;
  onSaved: () => void;
}

const EMPTY: any = {
  name: '', sku: '', description: '', enhanced_description: '',
  rate: '', sales_rate: '', status: 'active',
  brand: '', unit: 'pcs', stock_on_hand: '',
  category_id: '', subcategory_id: '',
};

export function ProductFormDialog({ open, onClose, product, onSaved }: Props) {
  const [form, setForm] = useState<any>(EMPTY);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isEdit = !!product;

  useEffect(() => {
    adminCategoryApi.list().then((res: any) => {
      setCategories(res.data || res.categories || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (product) {
      setForm({ ...EMPTY, ...product });
      setImagePreview(product.image_url || '');
      if (product.specifications && typeof product.specifications === 'object') {
        setSpecs(Object.entries(product.specifications).map(([name, value]) => ({ name, value: String(value) })));
      }
    } else {
      setForm(EMPTY);
      setImagePreview('');
      setSpecs([]);
      setImageFile(null);
    }
  }, [product, open]);

  useEffect(() => {
    const cat = categories.find((c: any) => c.id === form.category_id);
    setSubcategories(cat?.subcategories || []);
    if (!cat?.subcategories?.find((s: any) => s.id === form.subcategory_id)) {
      setForm((f: any) => ({ ...f, subcategory_id: '' }));
    }
  }, [form.category_id, categories]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addSpec = () => setSpecs(s => [...s, { name: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(s => s.filter((_, idx) => idx !== i));
  const setSpec = (i: number, k: 'name' | 'value', v: string) =>
    setSpecs(s => s.map((sp, idx) => idx === i ? { ...sp, [k]: v } : sp));

  const handleSave = async () => {
    if (!form.name || !form.rate) {
      toast({ title: 'Required fields missing', description: 'Name and price are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const specsObj = specs.reduce((acc, s) => s.name ? { ...acc, [s.name]: s.value } : acc, {});
      const payload = {
        ...form,
        rate: parseFloat(form.rate) || 0,
        sales_rate: parseFloat(form.sales_rate) || undefined,
        stock_on_hand: parseInt(form.stock_on_hand) || 0,
        specifications: specsObj,
        item_type: 'inventory',
        source: 'admin',
      };

      let savedProduct: any;
      if (isEdit) {
        savedProduct = await adminProductApi.update(product.item_id || product.id, payload);
      } else {
        // Generate item_id from name
        payload.item_id = `ekart-${Date.now()}`;
        savedProduct = await adminProductApi.create(payload);
      }

      // Upload image if selected
      if (imageFile) {
        const item_id = savedProduct?.data?.item_id || savedProduct?.item_id || payload.item_id;
        if (item_id) {
          await adminProductApi.uploadImageDirect(item_id, imageFile);
        }
      }

      toast({ title: isEdit ? 'Product updated' : 'Product created' });
      onSaved();
      onClose();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Name */}
          <div className="col-span-2 space-y-1">
            <Label>Product Name *</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Silk Embroidered Saree" />
          </div>

          {/* SKU + Brand */}
          <div className="space-y-1">
            <Label>SKU</Label>
            <Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU-001" />
          </div>
          <div className="space-y-1">
            <Label>Brand</Label>
            <Input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand name" />
          </div>

          {/* Price + Sale Price */}
          <div className="space-y-1">
            <Label>Price (₹) *</Label>
            <Input type="number" value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <Label>Sale Price (₹)</Label>
            <Input type="number" value={form.sales_rate} onChange={e => set('sales_rate', e.target.value)} placeholder="Optional" />
          </div>

          {/* Stock + Unit */}
          <div className="space-y-1">
            <Label>Stock Quantity</Label>
            <Input type="number" value={form.stock_on_hand} onChange={e => set('stock_on_hand', e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1">
            <Label>Unit</Label>
            <Input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="pcs" />
          </div>

          {/* Category + Subcategory */}
          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={v => set('category_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Subcategory</Label>
            <Select value={form.subcategory_id} onValueChange={v => set('subcategory_id', v)} disabled={!subcategories.length}>
              <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
              <SelectContent>
                {subcategories.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={!!form.featured} onCheckedChange={v => set('featured', v)} id="featured" />
            <Label htmlFor="featured">Featured product</Label>
          </div>

          {/* Short description */}
          <div className="col-span-2 space-y-1">
            <Label>Short Description</Label>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief product description" />
          </div>

          {/* Full description */}
          <div className="col-span-2 space-y-1">
            <Label>Full Description</Label>
            <Textarea value={form.enhanced_description} onChange={e => set('enhanced_description', e.target.value)} rows={4} placeholder="Detailed product description" />
          </div>

          {/* Image upload */}
          <div className="col-span-2 space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative w-24 h-24 rounded border overflow-hidden flex-shrink-0">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button onClick={() => { setImagePreview(''); setImageFile(null); }} className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Choose Image
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — max 5MB</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Specifications</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addSpec}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {specs.map((sp, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={sp.name} onChange={e => setSpec(i, 'name', e.target.value)} placeholder="e.g. Material" className="flex-1" />
                <Input value={sp.value} onChange={e => setSpec(i, 'value', e.target.value)} placeholder="e.g. Pure Silk" className="flex-1" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
