import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, Search, Image as ImageIcon, Loader2, Type, Camera, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ImageSearchDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageTextBalance, setImageTextBalance] = useState([50]);
  const [results, setResults] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast.success("Image téléchargée");
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setResults([
        "Robe similaire • Confiance 94%",
        "Variante coloris • Confiance 87%", 
        "Style comparable • Confiance 81%",
        "Alternative • Confiance 76%"
      ]);
      setIsLoading(false);
      toast.success("Recherche terminée");
    }, 2000);
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
        <Tabs defaultValue="combined" className="space-y-8">
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
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  variant="ghost"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="w-full h-full flex flex-col gap-3 py-8"
                >
                  {selectedImage ? (
                    <>
                      <ImageIcon className="w-8 h-8 text-primary" />
                      <span className="font-inter">{selectedImage.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="font-inter text-muted-foreground">Télécharger une image</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="combined" className="space-y-8">
            {/* Image upload */}
            <div className="space-y-3">
              <Label className="font-inter font-medium">Image de référence</Label>
              <div className="border border-border rounded-xl p-6 text-center hover:bg-accent/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-combined"
                />
                <Button
                  variant="ghost"
                  onClick={() => document.getElementById('image-upload-combined')?.click()}
                  className="w-full flex items-center gap-3 py-4"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-inter">
                    {selectedImage ? selectedImage.name : "Choisir une image"}
                  </span>
                </Button>
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
                    <div className="bg-gradient-secondary h-32 rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-inter text-sm">{result}</p>
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