import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, Download, Save, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { GoogleDriveSetup } from '@/components/admin/GoogleDriveSetup';
import { ProductMatcher } from '@/components/admin/ProductMatcher';
import { ProductImageCard } from '@/components/admin/ProductImageCard';
import { DriveUploader } from '@/components/admin/DriveUploader';
import { autoInitializeGoogleAPI } from '@/lib/googleAuth';
import { saveProductsToDrive, loadProductsFromDrive } from '@/lib/driveStorage';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [accessToken, setAccessToken] = useState<string>('');
  const [driveConfig, setDriveConfig] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-connect to Google Drive and load products
    const autoConnect = async () => {
      try {
        const token = await autoInitializeGoogleAPI();
        if (token) {
          setAccessToken(token);
          setDriveConfig({ configured: true });
          
          // Load products from Drive
          const savedProducts = await loadProductsFromDrive(token);
          if (savedProducts.length > 0) {
            setProducts(savedProducts);
            // Sync to localStorage for public access
            localStorage.setItem('azzaro_products', JSON.stringify(savedProducts));
            toast({
              title: 'Products Loaded',
              description: `${savedProducts.length} products loaded and synced for visitors`,
            });
          }
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };
    
    autoConnect();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log('First Excel row:', jsonData[0]);
      console.log('All column names:', Object.keys(jsonData[0] || {}));
      
      setProgress(30);

      const processedProducts = [];
      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        console.log('Admin Excel row:', row); // Debug log
      console.log('Available columns:', Object.keys(row)); // Show column names
        
        const product = {
          id: `prod-${i + 1}`,
          imageUrl: '/placeholder.svg',
          ...row, // Include ALL Excel columns
        };
        
        processedProducts.push(product);
        setProgress(30 + ((i + 1) / jsonData.length) * 70);
      }

      setProducts(processedProducts);
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
      setProgress(0);
    }
  };

  const saveProducts = async () => {
    setLoading(true);
    try {
      // Always save to localStorage for public access
      localStorage.setItem('azzaro_products', JSON.stringify(products));
      
      // Also save to Google Drive if connected
      if (accessToken) {
        await saveProductsToDrive(products, accessToken);
      }
      
      toast({
        title: 'Saved',
        description: 'Products saved and available to visitors',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    link.click();
  };

  const authenticateGoogleDrive = async () => {
    try {
      const token = await autoInitializeGoogleAPI();
      if (token) {
        setAccessToken(token);
        toast({
          title: 'Success',
          description: 'Connected to Google Drive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to Google Drive',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-display font-semibold mb-8">Product Management</h1>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Excel</TabsTrigger>
            <TabsTrigger value="setup">Google Drive Setup</TabsTrigger>
            <TabsTrigger value="match">Match Images</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="p-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Upload Excel File</h2>
            <p className="text-muted-foreground text-center">
              Upload your product Excel file. Images will be automatically matched from Google Drive.
            </p>
            
            {loading && (
              <div className="w-full max-w-md space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            )}

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
              disabled={loading}
            />
            <Button asChild disabled={loading}>
              <label htmlFor="excel-upload" className="cursor-pointer">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Choose File'
                )}
              </label>
            </Button>
          </div>
        </Card>
          </TabsContent>

          <TabsContent value="setup">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Google Drive Status</h3>
              {accessToken ? (
                <div className="space-y-4">
                  <p className="text-sm text-green-600 text-center">
                    ✓ Auto-connected to Google Drive
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          'https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(id,name)',
                          { headers: { Authorization: `Bearer ${accessToken}` } }
                        );
                        const data = await response.json();
                        console.log('Drive test:', data);
                        toast({
                          title: 'Test Result',
                          description: `Found ${data.files?.length || 0} files`,
                        });
                      } catch (error) {
                        console.error('Drive test failed:', error);
                      }
                    }}
                  >
                    Test Drive Access
                  </Button>
                  <DriveUploader accessToken={accessToken} />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Connecting to Google Drive...</p>
                  <Button onClick={authenticateGoogleDrive}>
                    Retry Connection
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="match">
            {products.length > 0 ? (
              <ProductMatcher 
                products={products} 
                onProductsUpdated={setProducts}
                accessToken={accessToken}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Upload products first to match images</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Loaded Products ({products.length})
              </h2>
              <div className="flex gap-2">
                <Button onClick={saveProducts} variant="outline" disabled={loading || !accessToken}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save to Drive'}
                </Button>
                <Button onClick={exportToJSON} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductImageCard
                  key={index}
                  product={product}
                  index={index}
                  accessToken={accessToken}
                  onUpdateProduct={(updatedProduct) => {
                    const newProducts = [...products];
                    newProducts[index] = updatedProduct;
                    setProducts(newProducts);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
