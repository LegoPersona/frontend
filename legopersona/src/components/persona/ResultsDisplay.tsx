import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPersona, getPersonaImage } from '@/services/personaApi';
import legoPersona from '@/assets/lego-persona.jpeg';
import type { PersonaPart } from '@/types/persona';
import DownloadInstructionsButton from './DownloadInstructionsButton';
import DownloadLegoPartsButton from './DownloadLegoPartsButton';

interface ResultsDisplayProps {
  originalImage: string;
  onCreateAnother: () => void;
  personaId: string;
}

const ResultsDisplay = ({ originalImage, onCreateAnother, personaId }: ResultsDisplayProps) => {
  const { data: persona } = useQuery({
    queryKey: ['persona', personaId],
    queryFn: () => getPersona(personaId),
  });

  const { data: personaImageSrc = legoPersona } = useQuery({
    queryKey: ['persona-image', personaId],
    queryFn: () => getPersonaImage(personaId),
  });
  const parts: PersonaPart[] = persona?.partsJson ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Success header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-block"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
        <h2 className="font-display font-bold text-3xl text-foreground mt-4">
          Your LEGO Persona is Ready!
        </h2>
        <p className="text-muted-foreground mt-2">
          Here's your personalized LEGO Persona
        </p>
      </div>

      {/* Before/After comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <p className="font-display font-semibold text-center mb-3 text-muted-foreground">Your Photo</p>
          <img 
            src={originalImage} 
            alt="Original" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 shadow-card border-2 border-lego-yellow"
        >
          <p className="font-display font-semibold text-center mb-3 text-primary">LEGO Persona</p>
          <img 
            src={personaImageSrc} 
            alt="LEGO Persona" 
            className="w-full h-64 object-contain rounded-xl bg-white"
          />
        </motion.div>
      </div>

      {/* Parts List */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-6 shadow-card"
      >
        <h3 className="font-display font-bold text-xl mb-4">Parts List</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {parts.map((part, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="bg-muted rounded-lg p-3 text-center"
            >
              <p className="font-semibold text-sm">{part['Part Name']}</p>
              <p className="text-xs text-muted-foreground">{part.Color} × {part.Quantity}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Total: {parts.reduce((acc, p) => acc + Number(p.Quantity), 0)} pieces
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <DownloadInstructionsButton personaId={personaId} />
        <DownloadLegoPartsButton personaId={personaId} />
      </motion.div>

      {/* Guide link */}
      <p className="text-center text-sm text-muted-foreground">
        Want to order these bricks?{' '}
        <Link to="/parts-guide" className="font-semibold text-primary underline underline-offset-2">
          See how to use the parts file on LEGO Pick a Brick
        </Link>
      </p>

      {/* Create another */}
      <div className="text-center pt-4">
        <Button variant="outline" onClick={onCreateAnother}>
          <Repeat className="w-5 h-5" />
          Create Another LEGO Persona
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
