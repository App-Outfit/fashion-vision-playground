import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Scissors, Image as ImageIcon, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

const SegmentationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [segmentationResult, setSegmentationResult] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSegmentationResult(null);
      toast.success("Image uploadée avec succès");
    }
  };

  const handleSegmentation = async () => {
    if (!selectedImage) {
      toast.error("Veuillez d'abord uploader une image");
      return;
    }
    setIsLoading(true);
    setSegmentationResult(null);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const res = await fetch("http://localhost:8000/api/v1/segment/", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setSegmentationResult(data.result || data.data || data);
      toast.success("Segmentation terminée");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la segmentation");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMask = () => {
    toast.success("Masque téléchargé");
  };

  // Hardcoded color mapping for all labels (HEX)
  const LABEL_COLORS: Record<string, string> = {
    "Background": "#222222",
    "Hat": "#FFB300",
    "Hair": "#803E75",
    "Glove": "#FF6800",
    "Sunglasses": "#A6BDD7",
    "Upper-clothes": "#C10020",
    "Dress": "#CEA262",
    "Coat": "#817066",
    "Socks": "#007D34",
    "Pants": "#F6768E",
    "Jumpsuits": "#00538A",
    "Scarf": "#FF7A5C",
    "Skirt": "#53377A",
    "Face": "#FF8E00",
    "Left-arm": "#B32851",
    "Right-arm": "#F4C800",
    "Left-leg": "#7F180D",
    "Right-leg": "#93AA00",
    "Left-shoe": "#593315",
    "Right-shoe": "#F13A13",
    "Belt": "#232C16",
    "Bag": "#B0B0B0"
  };

  // Debug: always log the segmentation result
  // eslint-disable-next-line no-console
  console.log('segmentationResult:', segmentationResult);

  let maskColorBase64Preview = '';
  if (segmentationResult?.mask_color_base64) {
    maskColorBase64Preview = segmentationResult.mask_color_base64.slice(0, 100);
    // eslint-disable-next-line no-console
    console.log('mask_color_base64:', maskColorBase64Preview);
  }

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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Image originale</h4>
                <div className="bg-gradient-secondary h-64 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedImage && (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="original"
                      className="object-contain h-full w-full"
                    />
                  )}
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">Masque ATR</h4>
                <div className="bg-gradient-primary h-64 rounded-lg flex items-center justify-center overflow-hidden">
                  {segmentationResult?.mask_color_atr_base64 && segmentationResult?.mask_color_atr_base64.length > 100 && (
                    <img
                      src={`data:image/png;base64,${segmentationResult.mask_color_atr_base64}`}
                      alt="mask-atr"
                      className="object-contain h-full w-full"
                    />
                  )}
                </div>
                <Button 
                  onClick={() => {
                    if (segmentationResult?.mask_color_atr_base64) {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${segmentationResult.mask_color_atr_base64}`;
                      link.download = 'segmentation_mask_atr.png';
                      link.click();
                      toast.success("Masque ATR téléchargé");
                    }
                  }}
                  variant="outline"
                  className="w-full mt-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le masque ATR
                </Button>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium mb-2">Masque LIP</h4>
                <div className="bg-gradient-primary h-64 rounded-lg flex items-center justify-center overflow-hidden">
                  {segmentationResult?.mask_color_lip_base64 && segmentationResult?.mask_color_lip_base64.length > 100 && (
                    <img
                      src={`data:image/png;base64,${segmentationResult.mask_color_lip_base64}`}
                      alt="mask-lip"
                      className="object-contain h-full w-full"
                    />
                  )}
                </div>
                <Button 
                  onClick={() => {
                    if (segmentationResult?.mask_color_lip_base64) {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${segmentationResult.mask_color_lip_base64}`;
                      link.download = 'segmentation_mask_lip.png';
                      link.click();
                      toast.success("Masque LIP téléchargé");
                    }
                  }}
                  variant="outline"
                  className="w-full mt-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le masque LIP
                </Button>
              </Card>
            </div>

            {/* Remove full legend, only show detected parts */}
            <div className="space-y-3">
              <h4 className="font-medium">Parties détectées ATR :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {segmentationResult?.detected_labels_atr?.map((part: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-md text-sm">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ backgroundColor: segmentationResult.color_map_atr?.[part] || LABEL_COLORS[part] || '#ccc' }}
                    />
                    <span>{part}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Parties détectées LIP :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {segmentationResult?.detected_labels_lip?.map((part: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-md text-sm">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ backgroundColor: segmentationResult.color_map_lip?.[part] || LABEL_COLORS[part] || '#ccc' }}
                    />
                    <span>{part}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentationDemo;