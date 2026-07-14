import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Stepper from '@/components/persona/Stepper';
import ImageUpload from '@/components/persona/ImageUpload';
import LoadingAnimation from '@/components/persona/LoadingAnimation';
import GenerationError from '@/components/persona/GenerationError';
import ResultsDisplay from '@/components/persona/ResultsDisplay';
import RateLimitIndicator from '@/components/persona/RateLimitIndicator';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRateLimit } from '@/contexts/RateLimitContext';
import { usePersonaGeneration } from '@/contexts/PersonaGenerationContext';

const steps = [
  { number: 1, title: 'Upload', description: 'Choose your photo' },
  { number: 2, title: 'Processing', description: 'AI magic happens' },
  { number: 3, title: 'Results', description: 'Meet your persona' },
];

const CreatePage = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selectedImage,
    progress,
    actionDescription,
    resultPersonaId,
    error,
    selectImage,
    clearImage,
    startGeneration,
    retry,
    reset,
  } = usePersonaGeneration();
  const { status: rateLimit, refresh: refreshRateLimit } = useRateLimit();

  useEffect(() => {
    if (currentStep !== 1) return;
    refreshRateLimit();
  }, [currentStep, refreshRateLimit]);

  const limitReached = rateLimit !== null && !rateLimit.unlimited && rateLimit.remaining <= 0;

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <Stepper
            steps={steps}
            currentStep={currentStep}
            className="w-full max-w-4xl"
          />
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-2xl shadow-card p-8"
            >
              <div className="text-center mb-8">
                <h1 className="font-display font-bold text-3xl mb-2">Upload Your Photo</h1>
                <p className="text-muted-foreground">
                  Choose a clear photo of yourself and we'll turn you into a LEGO Persona!
                </p>
              </div>

              <ImageUpload
                onImageSelect={selectImage}
                selectedImage={selectedImage || undefined}
                onClear={clearImage}
              />

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={startGeneration}
                  disabled={!selectedImage || limitReached}
                >
                  Generate My Persona
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {limitReached && <RateLimitIndicator status={rateLimit} className="mt-4" />}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl shadow-card p-8"
            >
              {error ? (
                <GenerationError
                  message={error}
                  onRetry={retry}
                  onGoHome={handleGoHome}
                />
              ) : (
                <LoadingAnimation progress={progress} message={actionDescription} />
              )}
            </motion.div>
          )}

          {currentStep === 3 && selectedImage && resultPersonaId && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-2xl shadow-card p-8"
            >
              <ResultsDisplay
                originalImage={selectedImage}
                onCreateAnother={reset}
                personaId={resultPersonaId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage;
