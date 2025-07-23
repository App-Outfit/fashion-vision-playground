import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Scissors, Image as ImageIcon, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

const SegmentationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [segmentationResult, setSegmentationResult] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSegmentationResult(false);
      toast.success("Image uploadée avec succès");
    }
  };

  const handleSegmentation = async () => {
    if (!selectedImage) {
      toast.error("Veuillez d'abord uploader une image");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSegmentationResult(true);
      setIsLoading(false);
      toast.success("Segmentation terminée");
    }, 3000);
  };

  const downloadMask = () => {
    toast.success("Masque téléchargé");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-primary" />
          API de Segmentation Précise
        </CardTitle>
        <CardDescription>
          Segmentation automatique des vêtements et parties du corps
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="seg-image-upload">Uploadez une image</Label>
          <div className="mt-2">
            <input
              id="seg-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('seg-image-upload')?.click()}
              className="w-full h-32 flex flex-col gap-2"
            >
              {selectedImage ? (
                <>
                  <ImageIcon className="w-8 h-8" />
                  <span>{selectedImage.name}</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8" />
                  <span>Cliquez pour uploader une image</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSegmentation}
          disabled={isLoading || !selectedImage}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Segmentation en cours...
            </>
          ) : (
            "Segmenter l'image"
          )}
        </Button>

        {segmentationResult && (
          <div className="space-y-4">
            <h3 className="font-semibold">Résultat de la segmentation :</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Image originale</h4>
                <div className="bg-gradient-secondary h-48 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">Masque de segmentation</h4>
                <div className="bg-gradient-primary h-48 rounded-lg flex items-center justify-center">
                  <Scissors className="w-12 h-12 text-primary-foreground" />
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Parties détectées :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "T-shirt",
                  "Pantalon", 
                  "Chaussures",
                  "Visage",
                  "Bras",
                  "Cheveux"
                ].map((part, index) => (
                  <div key={index} className="bg-accent text-accent-foreground px-3 py-2 rounded-md text-sm text-center">
                    {part}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={downloadMask}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4" />
              Télécharger le masque
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentationDemo;