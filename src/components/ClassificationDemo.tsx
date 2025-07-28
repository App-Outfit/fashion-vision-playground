import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Tag, Image as ImageIcon, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BACKEND_URL } from "@/lib/utils";

type Props = { fetchCredits: (userId: string) => void, userId: string };
const ClassificationDemo = ({ fetchCredits, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>(["t-shirt", "robe", "pull", "pantalon", "veste"]);
  const [newLabel, setNewLabel] = useState("");
  const [results, setResults] = useState<{ label: string; score: number }[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setResults([]);
      toast.success("Image uploadée avec succès");
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !customLabels.includes(newLabel.trim().toLowerCase())) {
      setCustomLabels([...customLabels, newLabel.trim().toLowerCase()]);
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setCustomLabels(customLabels.filter(label => label !== labelToRemove));
  };

  const handleClassification = async () => {
    if (!selectedImage) {
      toast.error("Veuillez d'abord uploader une image");
      return;
    }
    if (customLabels.length === 0) {
      toast.error("Veuillez ajouter au moins un label");
      return;
    }
    setIsLoading(true);
    setResults([]);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("labels", customLabels.join(","));
      // Ajout récupération token Supabase
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        toast.error("Utilisateur non authentifié");
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${BACKEND_URL}/api/v1/classify/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!res.ok) {
        if (res.status === 402) {
          toast.error("Vous n'avez plus de crédits. Rechargez votre compte pour continuer à utiliser l'API.");
          return;
        }
        throw new Error("Erreur API");
      }
      const dataRes = await res.json();
      setResults(dataRes.results || []);
      toast.success("Classification terminée");
      if (userId) fetchCredits(userId);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la classification");
    } finally {
      setIsLoading(false);
    }
  };

  const exampleImages = [
    "/images/look1.jpg",
    "/images/look2.jpg",
    "/images/look3.jpg",
  ];

  const handleExampleSelect = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], url.split("/").pop() || "example.jpg", { type: blob.type });
    setSelectedImage(file);
    toast.success("Image exemple sélectionnée");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-sf font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Tag className="w-4 h-4 text-orange-600" />
          </div>
          Classification Intelligente
        </CardTitle>
        <CardDescription>
          Classification personnalisée avec vos propres labels
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="class-image-upload">Uploadez une image</Label>
          <div className="flex gap-2 mb-4 justify-center">
            {exampleImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Exemple ${idx + 1}`}
                className="w-20 h-20 object-cover rounded cursor-pointer border hover:border-primary transition"
                onClick={() => handleExampleSelect(url)}
                title={`Choisir l'exemple ${idx + 1}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-col items-center">
            <input
              id="class-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {selectedImage ? (
              <div className="flex flex-col items-center w-full mb-2">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="uploaded"
                  className="object-contain h-48 w-auto rounded shadow mb-2"
                />
                <span className="font-inter text-xs text-muted-foreground mb-2">{selectedImage.name}</span>
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                  size="sm"
                >
                  Supprimer l'image
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => document.getElementById('class-image-upload')?.click()}
                className="w-full h-32 flex flex-col gap-2"
              >
                <Upload className="w-8 h-8" />
                <span>Cliquez pour uploader une image</span>
              </Button>
            )}
          </div>
        </div>

        <div>
          <Label>Labels personnalisés</Label>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un label (ex: élégant, décontracté...)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
              />
              <Button onClick={addLabel} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {customLabels.map((label, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <button
                    onClick={() => removeLabel(label)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleClassification}
          disabled={isLoading || !selectedImage || customLabels.length === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Classification en cours...
            </>
          ) : (
            "Classifier l'image"
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Résultats de la classification :</h3>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{result.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={result.score * 100} className="h-2" />
                </div>
              ))}
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Label le plus probable :</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                {results[0]?.label} ({(results[0]?.score * 100).toFixed(1)}%)
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassificationDemo;