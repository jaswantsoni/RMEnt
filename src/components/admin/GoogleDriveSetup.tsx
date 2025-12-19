import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleDriveSetupProps {
  onConfigured: (config: any) => void;
}

export function GoogleDriveSetup({ onConfigured }: GoogleDriveSetupProps) {
  const [config, setConfig] = useState({
    clientId: '',
    apiKey: '',
    folderId: '',
  });
  const [isConfigured, setIsConfigured] = useState(false);

  const handleSave = () => {
    if (config.clientId && config.apiKey) {
      localStorage.setItem('google_drive_config', JSON.stringify(config));
      setIsConfigured(true);
      onConfigured(config);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Google Drive Setup</h3>
        {isConfigured && <CheckCircle className="h-5 w-5 text-green-500" />}
      </div>

      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need Google Drive API credentials. Get them from{' '}
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            className="text-primary underline"
          >
            Google Cloud Console
          </a>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            value={config.clientId}
            onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
            placeholder="Your Google OAuth Client ID"
          />
        </div>

        <div>
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="Your Google Drive API Key"
          />
        </div>

        <div>
          <Label htmlFor="folderId">Drive Folder ID (Optional)</Label>
          <Input
            id="folderId"
            value={config.folderId}
            onChange={(e) => setConfig({ ...config, folderId: e.target.value })}
            placeholder="Specific folder ID to search in"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
      </div>
    </Card>
  );
}