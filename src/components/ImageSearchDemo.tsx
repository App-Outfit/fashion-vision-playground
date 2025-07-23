import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Search, Image as ImageIcon, Loader2, Palette, Type } from "lucide-react";
import { toast } from "sonner";

const ImageSearchDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageTextBalance, setImageTextBalance] = useState([50]); // 0-100, 50 = équilibré
  const [results, setResults] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast.success("Image uploadée avec succès");
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults([
        "Résultat 1: Robe similaire en bleu",
        "Résultat 2: Variante en rouge",
        "Résultat 3: Style comparable",
        "Résultat 4: Alternative recommandée"
      ]);
      setIsLoading(false);
      toast.success("Recherche terminée");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          API de Recherche Cross-Modal
        </CardTitle>
        <CardDescription>
          Recherchez par image, texte, ou combinaison des deux
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Recherche Texte</TabsTrigger>
            <TabsTrigger value="image">Recherche Image</TabsTrigger>
            <TabsTrigger value="combined">Combiné</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="search-text">Décrivez ce que vous cherchez</Label>
              <Input
                id="search-text"
                placeholder="Ex: robe bleue longue, pull en laine rouge..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mt-2"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Uploadez une image</Label>
              <div className="mt-2">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
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
          </TabsContent>
          
          <TabsContent value="combined" className="space-y-4">
            <div>
              <Label htmlFor="image-upload-combined">Image de référence</Label>
              <div className="mt-2">
                <input
                  id="image-upload-combined"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload-combined')?.click()}
                  className="w-full h-24 flex items-center gap-2"
                >
                  <Upload className="w-6 h-6" />
                  <span>Uploader une image</span>
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="modification-text">Modification souhaitée</Label>
              <Input
                id="modification-text"
                placeholder="Ex: je le veux en rouge, version plus longue..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Slider de pondération Image/Texte */}
            <div className="space-y-4 p-4 bg-gradient-accent rounded-lg border border-border/50">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Pondération Image vs Texte
              </Label>
              
              <div className="space-y-3">
                <Slider
                  value={imageTextBalance}
                  onValueChange={setImageTextBalance}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image ({100 - imageTextBalance[0]}%)</span>
                  </div>
                  
                  <div className="px-3 py-1 bg-background rounded-md font-medium">
                    {imageTextBalance[0] === 50 ? "🎯 Équilibré" : 
                     imageTextBalance[0] > 50 ? "📝 Texte prioritaire" : "🖼️ Image prioritaire"}
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Type className="w-4 h-4" />
                    <span>Texte ({imageTextBalance[0]}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              "Lancer la recherche"
            )}
          </Button>
          
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Résultats de la recherche :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((result, index) => (
                  <Card key={index} className="p-4">
                    <div className="bg-gradient-secondary h-32 rounded-lg mb-2 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm">{result}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImageSearchDemo;