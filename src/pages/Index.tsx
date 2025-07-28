import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Scissors, Tag, Code, ExternalLink, Copy, Check } from "lucide-react";
import ImageSearchDemo from "@/components/ImageSearchDemo";
import SegmentationDemo from "@/components/SegmentationDemo";
import ClassificationDemo from "@/components/ClassificationDemo";
import ObjectDetectionDemo from "@/components/ObjectDetectionDemo";
import { toast } from "sonner";

const Index = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copié !");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (data && !error) {
      setCredits(data.credits);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (session?.user) {
          setTimeout(() => {
            fetchCredits(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        fetchCredits(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }
  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  const apis = [
    {
      id: "search",
      icon: Search,
      title: "Recherche Cross-Modal",
      endpoint: "POST /api/v1/search",
      description: "Recherche intelligente par image, texte ou combinaison des deux",
      features: ["Recherche par image", "Recherche textuelle", "Balance image/texte", "Similarité sémantique"],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "segmentation", 
      icon: Scissors,
      title: "Segmentation Précise",
      endpoint: "POST /api/v1/segment",
      description: "Segmentation automatique ultra-précise des vêtements et morphologie",
      features: ["Segmentation vêtements", "Détection morphologie", "Masques haute précision", "Export multi-format"],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      id: "classification",
      icon: Tag,
      title: "Classification Intelligente",
      endpoint: "POST /api/v1/classify",
      description: "Classification flexible avec vos propres critères et vocabulaire",
      features: ["Labels personnalisés", "Multi-classification", "Scores de confiance", "Adaptation métier"],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const codeExamples = {
    search: `// Recherche cross-modal
const response = await fetch('/api/v1/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64Image,
    text: "robe rouge élégante",
    balance: 0.7, // 70% texte, 30% image
    limit: 10
  })
});

const results = await response.json();
// { "results": [{"id": "...", "score": 0.95, "metadata": {...}}] }`,

    segmentation: `// Segmentation précise
const formData = new FormData();
formData.append('image', imageFile);
formData.append('mode', 'clothing'); // 'body', 'face', 'all'

const response = await fetch('/api/v1/segment', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
// { "masks": {...}, "detections": [...], "confidence": 0.98 }`,

    classification: `// Classification personnalisée
const response = await fetch('/api/v1/classify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64Image,
    labels: ["casual", "formal", "sport", "elegant"],
    threshold: 0.5
  })
});

const predictions = await response.json();
// { "predictions": [{"label": "elegant", "score": 0.92}] }`
  };

  const useCases = [
    {
      title: "E-commerce Fashion",
      description: "Recherche visuelle instantanée, recommandations produits et essayage virtuel",
      apis: ["search", "segmentation"],
      impact: "+35% conversion"
    },
    {
      title: "Gestion Catalogue",
      description: "Classification automatique, enrichissement métadonnées et détection doublons",
      apis: ["classification", "search"],
      impact: "-80% temps"
    },
    {
      title: "Essayage AR/VR",
      description: "Segmentation morphologie, adaptation vêtements et rendu réaliste",
      apis: ["segmentation"],
      impact: "+60% engagement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header Simple */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-sf font-semibold text-foreground">Vision API</h1>
              <p className="text-muted-foreground font-inter mt-1">Intelligence artificielle pour la mode</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-card rounded-lg px-4 py-2 border">
                <span className="text-sm text-muted-foreground">Crédits: </span>
                <span className="font-bold text-primary">{credits}</span>
              </div>
              <Badge variant="secondary" className="px-3 py-1">v1.0</Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* API Overview */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-sf font-semibold text-foreground">Trois APIs. Infinies possibilités.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils pensés pour s'intégrer naturellement dans votre écosystème existant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apis.map((api) => (
              <Card key={api.id} className="relative group hover:shadow-medium transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${api.bgColor} flex items-center justify-center mb-4`}>
                    <api.icon className={`w-6 h-6 ${api.color}`} />
                  </div>
                  <CardTitle className="text-xl font-sf">{api.title}</CardTitle>
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{api.endpoint}</code>
                  <CardDescription className="leading-relaxed">{api.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {api.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Interactive Testing */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-sf font-semibold text-foreground">Tester en direct</h2>
            <p className="text-muted-foreground">
              Testez nos APIs directement dans votre navigateur
            </p>
          </div>

          <Tabs defaultValue="search" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
              <TabsTrigger value="search" className="font-inter">Recherche</TabsTrigger>
              <TabsTrigger value="segmentation" className="font-inter">Segmentation</TabsTrigger>
              <TabsTrigger value="classification" className="font-inter">Classification</TabsTrigger>
              <TabsTrigger value="detection" className="font-inter">Détection objets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search">
              <ImageSearchDemo />
            </TabsContent>
            
            <TabsContent value="segmentation">
              <SegmentationDemo />
            </TabsContent>
            
            <TabsContent value="classification">
              <ClassificationDemo />
            </TabsContent>

            <TabsContent value="detection">
              <ObjectDetectionDemo />
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* Code Examples */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-sf font-semibold text-foreground">Intégration rapide</h2>
            <p className="text-muted-foreground">
              Exemples de code prêts à copier-coller
            </p>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger value="search" className="font-inter">Recherche</TabsTrigger>
              <TabsTrigger value="segmentation" className="font-inter">Segmentation</TabsTrigger>
              <TabsTrigger value="classification" className="font-inter">Classification</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([key, code]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      <CardTitle className="text-lg">Exemple d'intégration</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(code, key)}
                      className="gap-2"
                    >
                      {copiedCode === key ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copier
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code className="font-mono">{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <Separator />

        {/* Use Cases */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-sf font-semibold text-foreground">Cas d'usage</h2>
            <p className="text-muted-foreground">
              Découvrez comment nos clients utilisent nos APIs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-sf">{useCase.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {useCase.apis.map((apiId) => {
                      const api = apis.find(a => a.id === apiId);
                      return (
                        <Badge key={apiId} variant="secondary" className="gap-1">
                          {api && <api.icon className="w-3 h-3" />}
                          {api?.title}
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium">
                    {useCase.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Index;