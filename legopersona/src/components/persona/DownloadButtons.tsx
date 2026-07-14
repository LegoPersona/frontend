import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getPersonaInstructions, getPersonaLegoPartsJson } from '@/services/personaApi';

interface DownloadButtonProps {
  personaId: string;
}

const triggerFileDownload = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const DownloadInstructionsButton = ({ personaId }: DownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = await getPersonaInstructions(personaId);
      triggerFileDownload(url, `lego-persona-${personaId}-instructions.pdf`);
    } catch (error) {
      console.error('Failed to download instructions:', error);
      toast({
        title: 'Download failed',
        description: 'We could not prepare the instructions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="hero" size="xl" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      {isLoading ? 'Generating Instructions...' : 'Download Instructions'}
    </Button>
  );
};

export const DownloadLegoPartsButton = ({ personaId }: DownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = await getPersonaLegoPartsJson(personaId);
      triggerFileDownload(url, `lego-persona-${personaId}-parts.json`);
    } catch (error) {
      console.error('Failed to download LEGO parts file:', error);
      toast({
        title: 'Download failed',
        description: 'We could not prepare the parts file. Please try again.',
        variant: 'destructive',
      });
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
