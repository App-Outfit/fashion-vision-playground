import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Tag, Image as ImageIcon, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const ClassificationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [customLabels, setCustomLabels] = useState<string[]>(["t-shirt", "robe", "pull", "pantalon", "veste"]);
  const [newLabel, setNewLabel] = useState("");
  const [results, setResults] = useState<{ label: string; probability: number }[]>([]);

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
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = customLabels.map(label => ({
        label,
        probability: Math.random() * 100
      })).sort((a, b) => b.probability - a.probability);
      
      setResults(mockResults);
      setIsLoading(false);
      toast.success("Classification terminée");
    }, 2500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-primary" />
          API de Classification Multi-Label
        </CardTitle>
        <CardDescription>
          Classification personnalisée avec vos propres labels
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="class-image-upload">Uploadez une image</Label>
          <div className="mt-2">
            <input
              id="class-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('class-image-upload')?.click()}
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
                      {result.probability.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={result.probability} className="h-2" />
                </div>
              ))}
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Label le plus probable :</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                {results[0]?.label} ({results[0]?.probability.toFixed(1)}%)
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassificationDemo;