import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: string;
  onClear?: () => void;
}

const ImageUpload = ({ onImageSelect, selectedImage, onClear }: ImageUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('Image is too large. Maximum size is 10MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please upload a JPG or PNG image.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card bg-card">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear?.();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-lego-green text-white px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="font-display font-semibold">Image Ready!</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                'relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer',
                'bg-muted/50 hover:bg-muted',
                isDragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border',
                error && 'border-destructive bg-destructive/5'
              )}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4 py-8">
                <motion.div
                  animate={isDragActive ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className={cn(
                    'w-20 h-20 rounded-2xl flex items-center justify-center shadow-lego transition-colors',
                    isDragActive ? 'bg-primary' : 'bg-secondary'
                  )}
                >
                  {isDragActive ? (
                    <Image className="w-10 h-10 text-primary-foreground" />
                  ) : (
                    <Upload className="w-10 h-10 text-secondary-foreground" />
                  )}
                </motion.div>
                
                <div className="text-center">
                  <p className="font-display font-bold text-lg text-foreground">
                    {isDragActive ? 'Drop your photo here!' : 'Upload Your Photo'}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG or PNG • Max 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm mt-3 text-center font-medium"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
        <p className="font-display font-semibold text-foreground mb-2">📸 Tips for best results:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use a clear, front-facing photo</li>
          <li>• Good lighting helps a lot!</li>
          <li>• Solo photos work best</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
