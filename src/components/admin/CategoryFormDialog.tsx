import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { adminCategoryApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  item?: any;           // category or subcategory being edited
  mode: 'category' | 'subcategory';
  categories?: any[];   // for subcategory parent selection
  onSaved: () => void;
}

export function CategoryFormDialog({ open, onClose, item, mode, categories = [], onSaved }: Props) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setSlug(item.slug || '');
      setDescription(item.description || '');
      setParentId(item.category_id || '');
      setImagePreview(item.image_url || '');
    } else {
      setName(''); setSlug(''); setDescription(''); setParentId(''); setImagePreview(''); setImageFile(null);
    }
  }, [item, open]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit) setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  }, [name, isEdit]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name || !slug) {
      toast({ title: 'Name and slug are required', variant: 'destructive' });
      return;
    }
    if (mode === 'subcategory' && !parentId) {
      toast({ title: 'Please select a parent category', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload: any = { name, slug, description };
      if (mode === 'subcategory') payload.category_id = parentId;

      let saved: any;
      if (isEdit) {
        saved = mode === 'category'
          ? await adminCategoryApi.update(item.id, payload)
          : await adminCategoryApi.updateSub(item.id, payload);
      } else {
        saved = mode === 'category'
          ? await adminCategoryApi.create(payload)
          : await adminCategoryApi.createSub(payload);
      }

      // Upload image via multipart if selected (backend handles it)
      if (imageFile) {
        const id = saved?.data?.id || saved?.id || item?.id;
        if (id) {
          const formData = new FormData();
          formData.append('image', imageFile);
          const token = localStorage.getItem('auth_token');
          const endpoint = mode === 'category'
            ? `/api/admin/categories/${id}/image`
            : `/api/admin/subcategories/${id}/image`;
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}${endpoint}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });
        }
      }

      toast({ title: isEdit ? `${mode} updated` : `${mode} created` });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${mode}` : `Add ${mode}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {mode === 'subcategory' && (
            <div className="space-y-1">
              <Label>Parent Category *</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Women's Dresses" />
          </div>

          <div className="space-y-1">
            <Label>Slug *</Label>
            <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="womens-dresses" />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional description" />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative w-20 h-20 rounded border overflow-hidden flex-shrink-0">
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
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
