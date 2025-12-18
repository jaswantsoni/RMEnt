import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Image, CheckCircle, XCircle } from 'lucide-react';
import { searchDriveForImage } from '@/lib/googleDrive';

interface ProductMatcherProps {
  products: any[];
  onProductsUpdated: (products: any[]) => void;
  accessToken?: string;
}

export function ProductMatcher({ products, onProductsUpdated, accessToken }: ProductMatcherProps) {
  const [matching, setMatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState('');

  const matchImages = async () => {
    if (!accessToken) {
      alert('Please authenticate with Google Drive first');
      return;
    }

    setMatching(true);
    setProgress(0);

    const updatedProducts = [...products];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      setCurrentProduct(product.name);
      
      try {
        const imageUrl = await searchDriveForImage(product, accessToken, (log) => {
          setCurrentProduct(`${product.name}: ${log}`);
        });
        if (imageUrl) {
          updatedProducts[i] = { ...product, imageUrl, imageFound: true };
        } else {
          updatedProducts[i] = { ...product, imageFound: false };
        }
      } catch (error) {
        updatedProducts[i] = { ...product, imageFound: false };
      }

      setProgress(((i + 1) / products.length) * 100);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    onProductsUpdated(updatedProducts);
    setMatching(false);
    setCurrentProduct('');
  };

  const matchedCount = products.filter(p => p.imageFound).length;
  const unmatchedCount = products.filter(p => p.imageFound === false).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Image Matching</h3>
        </div>
        <div className="flex gap-2">
          {matchedCount > 0 && (
            <Badge variant="secondary" className="text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              {matchedCount} matched
            </Badge>
          )}
          {unmatchedCount > 0 && (
            <Badge variant="secondary" className="text-red-600">
              <XCircle className="h-3 w-3 mr-1" />
              {unmatchedCount} unmatched
            </Badge>
          )}
        </div>
      </div>

      {matching && (
        <div className="space-y-2 mb-4">
          <Progress value={progress} />
          <div className="max-h-32 overflow-y-auto bg-muted/50 p-3 rounded text-xs">
            <p className="font-mono whitespace-pre-wrap">{currentProduct}</p>
          </div>
        </div>
      )}

      <Button 
        onClick={matchImages} 
        disabled={matching || !accessToken}
        className="w-full"
      >
        <Search className="mr-2 h-4 w-4" />
        {matching ? 'Matching Images...' : 'Match Images from Drive'}
      </Button>
    </Card>
  );
}