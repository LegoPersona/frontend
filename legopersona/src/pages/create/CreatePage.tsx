import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Stepper from '@/components/persona/Stepper';
import ImageUpload from '@/components/persona/ImageUpload';
import LoadingAnimation from '@/components/persona/LoadingAnimation';
import ResultsDisplay from '@/components/persona/ResultsDisplay';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  uploadImage,
  getGenerationStatus,
} from "@/services/personaApi";

const steps = [
  { number: 1, title: 'Upload', description: 'Choose your photo' },
  { number: 2, title: 'Processing', description: 'AI magic happens' },
  { number: 3, title: 'Results', description: 'Meet your persona' },
];

const CreatePage = () => {
//   const { isAuthenticated, addPersona } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Redirect to auth if not logged in
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/auth');
//     }
//   }, [isAuthenticated, navigate]);

  // Polling effect for generation status
  useEffect(() => {
    if (!isGenerating || !jobId) return;

    const interval = setInterval(async () => {
      try {
        const statusResponse = await getGenerationStatus(jobId);

        setProgress(statusResponse.progress || 0);

        if (statusResponse.status === 'PENDING' || statusResponse.status === 'PROCESSING') {
          // Continue polling
          return;
        }

        if (statusResponse.status === 'COMPLETED') {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep(3);
          
          // Redirect to profile page with the persona ID
          if (statusResponse.resultPersonaId) {
            navigate(`/profile/${statusResponse.resultPersonaId}`);
          } else {
            navigate('/profile');
          }
        }

        if (statusResponse.status === 'FAILED') {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerationError(statusResponse.errorMessage || 'Generation failed');
          toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: statusResponse.errorMessage || 'Something went wrong during persona generation',
          });
          setCurrentStep(1);
        }
      } catch (err) {
        console.error('Error checking generation status:', err);
        clearInterval(interval);
        setIsGenerating(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to check generation status',
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isGenerating, jobId, navigate]);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const handleNext = async () => {
    if (currentStep !== 1 || !selectedFile) return;

    try {
      setCurrentStep(2);
      setGenerationError(null);

      // Upload image and get jobId
      const uploadResponse = await uploadImage(selectedFile);
      const generatedJobId = uploadResponse.jobId;

      setJobId(generatedJobId);
      setIsGenerating(true);
    } catch (err) {
      console.error('Error uploading image:', err);
      setCurrentStep(1);
      setGenerationError('Failed to upload image');
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Failed to upload your image. Please try again.',
      });
    }
  };

  const handleCreateAnother = () => {
    setCurrentStep(1);
    setSelectedImage(null);
    setSelectedFile(null);
    setJobId(null);
    setIsGenerating(false);
    setProgress(0);
    setGenerationError(null);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
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
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage || undefined}
                onClear={handleClearImage}
              />

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleNext}
                  disabled={!selectedImage}
                >
                  Generate My Persona
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
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
              <LoadingAnimation progress={progress} />
            </motion.div>
          )}

          {currentStep === 3 && selectedImage && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-2xl shadow-card p-8"
            >
              <ResultsDisplay
                originalImage={selectedImage}
                onCreateAnother={handleCreateAnother}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage;
