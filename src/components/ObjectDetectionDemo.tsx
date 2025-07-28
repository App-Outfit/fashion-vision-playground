import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import { supabase } from "@/integrations/supabase/client";

interface DetectedObject {
  label: string;
  score: number;
  box: [number, number, number, number];
}

type Props = { fetchCredits: (userId: string) => void, userId: string };
const ObjectDetectionDemo = ({ fetchCredits, userId }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crops, setCrops] = useState<string[]>([]); // base64 crops

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setDetectedObjects([]);
      toast.success("Image uploadée");
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      toast.error("Veuillez d'abord uploader une image");
      return;
    }
    setIsLoading(true);
    setDetectedObjects([]);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      // Récupérer le token Supabase
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        toast.error("Utilisateur non authentifié");
        setIsLoading(false);
        return;
      }
      const res = await fetch("http://localhost:8000/api/v1/detect/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) {
        if (res.status === 402) {
          toast.error("Vous n'avez plus de crédits. Rechargez votre compte pour continuer à utiliser l'API.");
          return;
        }
        throw new Error("Erreur API");
      }
      const dataRes = await res.json();
      setDetectedObjects(dataRes.detected_objects || []);
      toast.success("Détection terminée");
      if (userId) fetchCredits(userId);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la détection");
    } finally {
      setIsLoading(false);
    }
  };

  // Générer les crops à partir de l'image et des boxes
  React.useEffect(() => {
    if (!imageUrl || detectedObjects.length === 0) {
      setCrops([]);
      return;
    }
    const img = imageRef.current;
    if (!img) return;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const newCrops: string[] = [];
    const loadAndCrop = async () => {
      const image = new window.Image();
      image.src = imageUrl;
      await new Promise((resolve) => { image.onload = resolve; });
      detectedObjects.forEach((obj) => {
        const [x1, y1, x2, y2] = obj.box;
        const w = x2 - x1;
        const h = y2 - y1;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, x1, y1, w, h, 0, 0, w, h);
          newCrops.push(canvas.toDataURL());
        } else {
          newCrops.push("");
        }
      });
      setCrops(newCrops);
    };
    loadAndCrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, detectedObjects]);

  // Pour overlay: calculer le ratio d'affichage de l'image
  const getBoxStyle = (box: [number, number, number, number]) => {
    const img = imageRef.current;
    if (!img) return { display: "none" };
    const [x1, y1, x2, y2] = box;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayedWidth = img.width;
    const displayedHeight = img.height;
    const xRatio = displayedWidth / naturalWidth;
    const yRatio = displayedHeight / naturalHeight;
    return {
      position: "absolute" as const,
      left: x1 * xRatio,
      top: y1 * yRatio,
      width: (x2 - x1) * xRatio,
      height: (y2 - y1) * yRatio,
      border: "2px solid #22c55e",
      borderRadius: 6,
      pointerEvents: "none" as const,
      boxSizing: "border-box" as const,
      color: "#22c55e",
      fontWeight: 600,
      background: "rgba(34,197,94,0.08)",
      zIndex: 2,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontSize: 14,
      padding: 2,
    };
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-0 shadow-medium bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-sf font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-fuchsia-100 flex items-center justify-center">
            <ScanBarcode className="w-4 h-4 text-fuchsia-600" />
          </div>
          Détection d'Objets Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="image-upload" className="font-medium">
            Uploadez une image
          </Label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[200px]">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="object-detect-upload"
            />
            {imageUrl ? (
              <div className="relative w-full flex flex-col items-center">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="uploaded"
                    className="object-contain max-h-[400px] w-auto rounded shadow mb-2"
                    onLoad={() => setDetectedObjects([...detectedObjects])} // force redraw
                  />
                  {/* Overlay des boîtes */}
                  {detectedObjects.map((obj, i) => (
                    <div key={i} style={getBoxStyle(obj.box)}>
                      <span style={{
                        background: "#22c55e",
                        color: "white",
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 13,
                        marginBottom: 2,
                        marginRight: 2,
                        position: "absolute",
                        left: 0,
                        top: -22,
                        zIndex: 3,
                      }}>
                        {obj.label} ({(obj.score * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
                <span className="font-inter text-xs text-muted-foreground mb-2">{selectedImage?.name}</span>
                <Button
                  variant="outline"
                  onClick={() => { setSelectedImage(null); setImageUrl(null); setDetectedObjects([]); }}
                  size="sm"
                >
                  Supprimer l'image
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => document.getElementById('object-detect-upload')?.click()}
                className="w-full h-full flex flex-col gap-3 py-8"
              >
                <ScanBarcode className="w-8 h-8 text-muted-foreground" />
                <span className="font-inter text-muted-foreground">Télécharger une image</span>
              </Button>
            )}
          </div>
        </div>
        <Button
          onClick={handleDetect}
          disabled={isLoading || !selectedImage}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-inter font-medium rounded-xl py-6 shadow-medium hover:shadow-strong transition-all duration-300"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Détection en cours...</span>
            </>
          ) : (
            <span>Lancer la détection</span>
          )}
        </Button>
        {/* Affichage des crops */}
        {crops.length > 0 && (
          <div className="flex flex-row flex-wrap gap-4 justify-center mt-4">
            {crops.map((crop, i) => (
              <div key={i} className="flex flex-col items-center w-28">
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border">
                  {crop ? (
                    <img src={crop} alt={detectedObjects[i]?.label} className="object-contain w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="font-inter text-xs font-semibold text-foreground">{detectedObjects[i]?.label}</div>
                  <div className="font-inter text-xs text-muted-foreground">{(detectedObjects[i]?.score * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectDetectionDemo; 