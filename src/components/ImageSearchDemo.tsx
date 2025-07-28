import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Search, Image as ImageIcon, Loader2, Type, Camera, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Props = { fetchCredits: (userId: string) => void, userId: string };
const ImageSearchDemo = ({ fetchCredits, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageTextBalance, setImageTextBalance] = useState([50]);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("combined");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast.success("Image téléchargée");
    }
  };

  // Reset image or text when switching tabs
  useEffect(() => {
    if (activeTab === "text") {
      setSelectedImage(null);
    } else if (activeTab === "image") {
      setSearchText("");
    }
    // For 'combined', do nothing (keep both)
  }, [activeTab]);

  const handleSearch = async () => {
    setIsLoading(true);
    setResults([]);
    try {
      const formData = new FormData();
      let alpha = imageTextBalance[0] / 100;
      // Cas 1 : image + texte
      if (activeTab === "combined" && selectedImage && searchText) {
        formData.append("image", selectedImage);
        formData.append("text", searchText);
        // alpha = slider
      } else if (activeTab === "image" && selectedImage) {
        formData.append("image", selectedImage);
        // Pas de text, alpha = 0 (full image)
        alpha = 0;
      } else if (activeTab === "text" && searchText) {
        formData.append("text", searchText);
        // Pas d'image, alpha = 1 (full text)
        alpha = 1;
      }
      formData.append("alpha", alpha.toString());
      formData.append("top_k", "6");
      // Ajout récupération token Supabase
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        toast.error("Utilisateur non authentifié");
        setIsLoading(false);
        return;
      }
      const res = await fetch("http://localhost:8000/api/v1/search/", {
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
      toast.success("Recherche terminée");
      if (userId) fetchCredits(userId);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  const getBalanceText = () => {
    const value = imageTextBalance[0];
    if (value < 30) return "Focus image";
    if (value > 70) return "Focus texte";
    return "Équilibré";
  };

  const getBalanceIcon = () => {
    const value = imageTextBalance[0];
    if (value < 30) return <Camera className="w-4 h-4" />;
    if (value > 70) return <Type className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-medium bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-sf font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          Recherche Cross-Modal
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="combined" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="text" className="font-inter">Texte</TabsTrigger>
            <TabsTrigger value="image" className="font-inter">Image</TabsTrigger>
            <TabsTrigger value="combined" className="font-inter">Combiné</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-6">
            <div className="space-y-2">
              <Label className="font-inter font-medium">Décrivez votre recherche</Label>
              <Input
                placeholder="robe bleue longue, pull en cachemire..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="font-inter bg-background/50"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-6">
            <div className="space-y-3">
              <Label className="font-inter font-medium">Image de référence</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[200px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                {selectedImage ? (
                  <div className="flex flex-col items-center w-full">
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
                    variant="ghost"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full h-full flex flex-col gap-3 py-8"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="font-inter text-muted-foreground">Télécharger une image</span>
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="combined" className="space-y-8">
            {/* Image upload */}
            <div className="space-y-3">
              <Label className="font-inter font-medium">Image de référence</Label>
              <div className="border border-border rounded-xl p-6 text-center hover:bg-accent/50 transition-colors flex flex-col items-center justify-center min-h-[200px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-combined"
                />
                {selectedImage ? (
                  <div className="flex flex-col items-center w-full">
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
                    variant="ghost"
                    onClick={() => document.getElementById('image-upload-combined')?.click()}
                    className="w-full flex items-center gap-3 py-4"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-inter">
                      Choisir une image
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {/* Text input */}
            <div className="space-y-2">
              <Label className="font-inter font-medium">Modification souhaitée</Label>
              <Input
                placeholder="en rouge, plus long, style décontracté..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="font-inter bg-background/50"
              />
            </div>

            {/* Innovation : Smart Balance Slider */}
            <div className="space-y-6 p-6 bg-gradient-accent rounded-xl border border-border/50">
              <div className="flex items-center justify-between">
                <Label className="font-inter font-medium flex items-center gap-2">
                  {getBalanceIcon()}
                  Balance intelligente
                </Label>
                <div className="px-3 py-1 bg-background/80 rounded-lg text-sm font-inter font-medium">
                  {getBalanceText()}
                </div>
              </div>
              
              {/* Custom slider with visual feedback */}
              <div className="space-y-4">
                <Slider
                  value={imageTextBalance}
                  onValueChange={setImageTextBalance}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                {/* Visual indicators */}
                <div className="flex justify-between items-center">
                  <div className={`flex items-center gap-2 transition-all duration-300 ${
                    imageTextBalance[0] < 50 ? 'text-foreground scale-110' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      imageTextBalance[0] < 50 
                        ? 'bg-primary text-primary-foreground shadow-medium' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-inter text-sm font-medium">Image</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 transition-all duration-300 ${
                    imageTextBalance[0] > 50 ? 'text-foreground scale-110' : 'text-muted-foreground'
                  }`}>
                    <span className="font-inter text-sm font-medium">Texte</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      imageTextBalance[0] > 50 
                        ? 'bg-primary text-primary-foreground shadow-medium' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Type className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                {/* Smart description */}
                <p className="text-xs font-inter text-muted-foreground text-center leading-relaxed">
                  {imageTextBalance[0] < 30 && "L'algorithme privilégiera les caractéristiques visuelles"}
                  {imageTextBalance[0] >= 30 && imageTextBalance[0] <= 70 && "Analyse équilibrée image + description textuelle"}
                  {imageTextBalance[0] > 70 && "L'algorithme privilégiera la description textuelle"}
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Search button */}
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-inter font-medium rounded-xl py-6 shadow-medium hover:shadow-strong transition-all duration-300"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recherche en cours...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Lancer la recherche</span>
              </>
            )}
          </Button>
          
          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="font-sf font-semibold text-lg">Résultats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-background/50 rounded-xl border border-border/50 hover:shadow-medium transition-all duration-300 hover:scale-105"
                  >
                    <div className="bg-gradient-secondary h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {result.image_path ? (
                        <img src={`http://localhost:8000/static/${result.image_path}`} alt={result.label} className="object-contain h-full w-full" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-inter text-sm font-semibold">{result.label}</p>
                    <p className="font-inter text-xs text-muted-foreground">Score : {(result.score * 100).toFixed(1)}%</p>
                  </div>
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