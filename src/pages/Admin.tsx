import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  X, 
  Download,
  ArrowLeft,
  Edit2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useProductStore, UploadedProduct } from '@/store/productStore';
import { useUserStore } from '@/store/userStore';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const { products, addProducts, updateProduct, deleteProduct, clearProducts } = useProductStore();
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<Omit<UploadedProduct, 'id' | 'createdAt'>[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState('');

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      toast.error('Invalid CSV: No data rows found');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Map common header variations
    const headerMap: Record<string, string> = {
      'product name': 'productName',
      'productname': 'productName',
      'name': 'productName',
      'model number': 'modelNumber',
      'modelnumber': 'modelNumber',
      'model': 'modelNumber',
      'length (in)': 'length',
      'length': 'length',
      'width/depth (in)': 'width',
      'width (in)': 'width',
      'width': 'width',
      'depth': 'width',
      'height (in)': 'height',
      'height': 'height',
      'reference code': 'referenceCode',
      'referencecode': 'referenceCode',
      'reference': 'referenceCode',
      'weight (lbs)': 'weight',
      'weight': 'weight',
    };

    const normalizedHeaders = headers.map(h => headerMap[h] || h);
    
    const data: Omit<UploadedProduct, 'id' | 'createdAt'>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0 || values.every(v => !v.trim())) continue;
      
      const row: Record<string, string> = {};
      normalizedHeaders.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      
      data.push({
        productName: row.productName || '',
        modelNumber: row.modelNumber || '',
        length: row.length || '',
        width: row.width || 'N/A',
        height: row.height || '',
        referenceCode: row.referenceCode || '',
        weight: row.weight || '',
        imageUrl: '',
      });
    }
    
    return data;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    
    return result;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const validExtensions = ['.csv', '.txt'];
    
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const data = parseCSV(text);
      
      if (data.length > 0) {
        setParsedData(data);
        toast.success(`Parsed ${data.length} products from CSV`);
      }
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast.error('No data to import');
      return;
    }
    
    addProducts(parsedData);
    setParsedData([]);
    toast.success(`Imported ${parsedData.length} products successfully!`);
  };

  const handleEditImage = (id: string, currentUrl: string) => {
    setEditingId(id);
    setEditingUrl(currentUrl || '');
  };

  const handleSaveImage = (id: string) => {
    updateProduct(id, { imageUrl: editingUrl });
    setEditingId(null);
    setEditingUrl('');
    toast.success('Image URL updated');
  };

  const downloadTemplate = () => {
    const template = 'Product Name,Model Number,Length (in),Width/Depth (in),Height (in),Reference Code,Weight (Lbs)\nExample Product,ABC-123,24 in,12 in,18 in,EX1,15.5';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please login to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth?redirect=/admin')} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Product Upload Panel</h1>
                <p className="text-sm text-muted-foreground">Import and manage product catalog</p>
              </div>
            </div>
            <Badge variant="outline" className="text-primary">
              {products.length} Products
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Upload Product Sheet
            </CardTitle>
            <CardDescription>
              Upload a CSV file with product details. The system will parse and display the data for review before import.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drag & drop your CSV file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <Button variant="outline" type="button">
                  Select File
                </Button>
              </label>
            </motion.div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {parsedData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview ({parsedData.length} products)</CardTitle>
                  <CardDescription>Review the parsed data before importing</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setParsedData([])}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleImport}>
                    <Check className="h-4 w-4 mr-2" />
                    Import All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Model Number</TableHead>
                      <TableHead>Dimensions (L×W×H)</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.modelNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.length} × {product.width} × {product.height}
                        </TableCell>
                        <TableCell>{product.referenceCode}</TableCell>
                        <TableCell>{product.weight} lbs</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Imported Products Section */}
        {products.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Imported Products ({products.length})</CardTitle>
                  <CardDescription>Manage your product catalog and add image URLs</CardDescription>
                </div>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm('Are you sure you want to clear all products?')) {
                    clearProducts();
                    toast.success('All products cleared');
                  }
                }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Model Number</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.imageUrl ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.productName}
                                  className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                />
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{product.productName}</DialogTitle>
                                </DialogHeader>
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.productName}
                                  className="w-full h-auto rounded"
                                />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {product.productName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.modelNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.length} × {product.width} × {product.height}
                        </TableCell>
                        <TableCell>{product.referenceCode}</TableCell>
                        <TableCell>{product.weight} lbs</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === product.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingUrl}
                                  onChange={(e) => setEditingUrl(e.target.value)}
                                  placeholder="Image URL"
                                  className="w-48 h-8 text-sm"
                                />
                                <Button size="icon" variant="ghost" onClick={() => handleSaveImage(product.id)}>
                                  <Save className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={() => handleEditImage(product.id, product.imageUrl || '')}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={() => {
                                    deleteProduct(product.id);
                                    toast.success('Product deleted');
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">CSV Format</h4>
                <p className="text-muted-foreground">
                  Your CSV should include headers: Product Name, Model Number, Length, Width/Depth, Height, Reference Code, Weight
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Adding Images</h4>
                <p className="text-muted-foreground">
                  Click the edit icon next to any product to add an image URL from Google Drive or any image hosting service
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Google Drive Images</h4>
                <p className="text-muted-foreground">
                  Use shareable links from Google Drive. Convert to direct image URL format for best results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
