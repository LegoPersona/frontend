import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPersonaInstructions } from '@/services/personaApi';

interface DownloadInstructionsButtonProps {
  personaId: string;
}

const DownloadInstructionsButton = ({ personaId }: DownloadInstructionsButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = await getPersonaInstructions(personaId);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lego-persona-${personaId}-instructions.pdf`;
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
      {isLoading ? 'Generating, this might take a while...' : 'Generate and Download Instructions'}
    </Button>
  );
};

export default DownloadInstructionsButton;
