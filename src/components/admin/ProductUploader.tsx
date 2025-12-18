import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { parseExcelFile, type ParsedProduct } from '@/lib/excelParser';
import { useToast } from '@/hooks/use-toast';

interface ProductUploaderProps {
  onProductsLoaded: (products: any[]) => void;
}

export function ProductUploader({ onProductsLoaded }: ProductUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatus('Parsing Excel file...');

    try {
      const parsedData = await parseExcelFile(file);
      setProgress(20);
      setStatus(`Found ${parsedData.length} products. Searching for images...`);

      const processedProducts = [];
      for (let i = 0; i < parsedData.length; i++) {
        const product = parsedData[i];
        const productName = product.name || Object.values(product)[0] || `Product ${i + 1}`;
        setStatus(`Processing ${productName} (${i + 1}/${parsedData.length})`);
        
        const imageUrl = await searchForProductImage(product);
        
        processedProducts.push({
          id: `product-${i + 1}`,
          name: product.name,
          slug: product.name?.toLowerCase().replace(/\s+/g, '-'),
          description: product.description || '',
          price: parseFloat(product.price?.toString() || '0') * 100,
          category: product.category || 'General',
          imageUrl: imageUrl || '/placeholder.svg',
          inStock: true,
          featured: false,
          ...product,
        });

        setProgress(20 + ((i + 1) / parsedData.length) * 80);
      }

      setStatus('Complete!');
      onProductsLoaded(processedProducts);
      
      toast({
        title: 'Success',
        description: `${processedProducts.length} products loaded successfully`,
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setStatus('');
    }
  };

  const searchForProductImage = async (product: any): Promise<string | null> => {
    try {
      const response = await fetch('/api/search-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Image search failed:', error);
    }
    return null;
  };

  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-semibold">Upload Product Excel</h2>
        <p className="text-muted-foreground">
          Upload your Excel file with product details. Images will be automatically matched from Google Drive.
        </p>

        {uploading && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
        )}

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="excel-upload"
        />
        
        <Button asChild disabled={uploading} size="lg">
          <label htmlFor="excel-upload" className="cursor-pointer">
            {uploading ? 'Processing...' : 'Choose Excel File'}
          </label>
        </Button>
      </div>
    </Card>
  );
}