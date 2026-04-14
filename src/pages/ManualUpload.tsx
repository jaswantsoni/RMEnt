import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, Download, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

export default function ManualUpload() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedProducts = jsonData.map((row: any, i) => {
        console.log('Excel row:', row);
        console.log('Available columns:', Object.keys(row));
        return {
          id: `prod-${i + 1}`,
          imageUrl: null,
          imageUploaded: false,
          ...row, // Include ALL Excel columns
        };
      });

      setProducts(processedProducts);
      setCurrentIndex(0);
      toast({
        title: 'Success',
        description: `${processedProducts.length} products loaded`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process Excel file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || currentIndex >= products.length) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedProducts = [...products];
      updatedProducts[currentIndex] = {
        ...updatedProducts[currentIndex],
        imageUrl: event.target?.result as string,
        imageFile: file,
        imageUploaded: true,
      };
      setProducts(updatedProducts);
    };
    reader.readAsDataURL(file);
  };

  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevProduct = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveToJSON = () => {
    const jsonData = products.map(p => ({
      id: p.id,
      name: p.name,
      modelNumber: p.modelNumber,
      price: p.price,
      description: p.description,
      category: p.category,
      sku: p.sku,
      imageUrl: p.imageUrl,
    }));

    localStorage.setItem('rmp_products_data', JSON.stringify(jsonData));
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-data.json';
    link.click();

    toast({
      title: 'Saved',
      description: 'Products saved to localStorage and downloaded',
    });
  };

  const currentProduct = products[currentIndex];
  const progress = products.length > 0 ? ((currentIndex + 1) / products.length) * 100 : 0;
  const uploadedCount = products.filter(p => p.imageUploaded).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-display font-semibold mb-8">Manual Product Upload</h1>

        {products.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Upload Excel File</h2>
              <p className="text-muted-foreground text-center">
                Upload your product Excel file to start adding images manually
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
                id="excel-upload"
                disabled={loading}
              />
              <Button asChild disabled={loading}>
                <label htmlFor="excel-upload" className="cursor-pointer">
                  Choose Excel File
                </label>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  Product {currentIndex + 1} of {products.length}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {uploadedCount} images uploaded
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveToJSON} variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save All
                </Button>
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            {currentProduct && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.entries(currentProduct).map(([key, value]) => {
                      if (key === 'id' || key === 'imageUrl' || key === 'imageUploaded' || key === 'imageFile') return null;
                      return (
                        <div key={key}>
                          <label className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="text-lg break-words">{String(value || 'N/A')}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Product Image</h3>
                    {currentProduct.imageUploaded && (
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {currentProduct.imageUrl ? (
                    <div className="space-y-4">
                      <img
                        src={currentProduct.imageUrl}
                        alt={currentProduct.name}
                        className="w-full h-64 object-cover rounded"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id={`image-upload-${currentIndex}`}
                      />
                      <Button asChild variant="outline" className="w-full">
                        <label htmlFor={`image-upload-${currentIndex}`} className="cursor-pointer">
                          Change Image
                        </label>
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id={`image-upload-${currentIndex}`}
                      />
                      <Button asChild>
                        <label htmlFor={`image-upload-${currentIndex}`} className="cursor-pointer">
                          Upload Image
                        </label>
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            <div className="flex justify-between">
              <Button onClick={prevProduct} disabled={currentIndex === 0} variant="outline">
                Previous
              </Button>
              <Button onClick={nextProduct} disabled={currentIndex === products.length - 1}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
