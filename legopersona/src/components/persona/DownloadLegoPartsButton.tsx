import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPersonaLegoPartsJson } from '@/services/personaApi';

interface DownloadLegoPartsButtonProps {
  personaId: string;
}

const DownloadLegoPartsButton = ({ personaId }: DownloadLegoPartsButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = await getPersonaLegoPartsJson(personaId);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lego-persona-${personaId}-parts.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="hero" size="xl" onClick={handleDownload} disabled={isLoading}>
      <Download className="w-5 h-5" />
      {isLoading ? 'Preparing download...' : 'Download LEGO parts file'}
    </Button>
  );
};

export default DownloadLegoPartsButton;
