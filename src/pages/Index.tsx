import { useState } from "react";
import { Search, Scissors, Tag } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import APICard from "@/components/APICard";
import DemoModal from "@/components/DemoModal";

const Index = () => {
  const [selectedAPI, setSelectedAPI] = useState<"search" | "segmentation" | "classification" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDemo = (apiType: "search" | "segmentation" | "classification") => {
    setSelectedAPI(apiType);
    setIsModalOpen(true);
  };

  const closeDemo = () => {
    setIsModalOpen(false);
    setSelectedAPI(null);
  };

  const apis = [
    {
      icon: Search,
      title: "Recherche Cross-Modal",
      description: "Recherche intelligente par image, texte ou combinaison. L'IA comprend vos intentions et trouve les produits parfaits.",
      useCases: [
        "Recherche visuelle instantanée",
        "Recommandations intelligentes", 
        "Découverte de variantes",
        "Analyse de similarité"
      ],
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600",
      apiType: "search" as const
    },
    {
      icon: Scissors,
      title: "Segmentation Précise",
      description: "Découpage ultra-précis des vêtements et morphologie. Technologie de pointe pour l'essayage virtuel.",
      useCases: [
        "Essayage virtuel immersif",
        "Suppression d'arrière-plan",
        "Extraction automatique",
        "Analyse morphologique"
      ],
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
      apiType: "segmentation" as const
    },
    {
      icon: Tag,
      title: "Classification Intelligente",
      description: "Classification flexible avec vos propres critères. L'IA s'adapte à votre vocabulaire métier.",
      useCases: [
        "Étiquetage automatisé",
        "Analyse de style avancée",
        "Enrichissement catalogue",
        "Filtrage sémantique"
      ],
      gradient: "bg-gradient-to-r from-orange-500 to-red-600",
      apiType: "classification" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary font-inter">
      <HeroSection />
      
      {/* APIs Section */}
      <section id="apis-section" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-sf font-semibold text-foreground">
              Trois APIs. Infinies possibilités.
            </h2>
            <p className="text-lg font-inter text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Des outils pensés pour s'intégrer naturellement dans votre écosystème existant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apis.map((api, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <APICard
                  icon={api.icon}
                  title={api.title}
                  description={api.description}
                  useCases={api.useCases}
                  gradient={api.gradient}
                  onTryNow={() => openDemo(api.apiType)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-6 bg-gradient-glass backdrop-blur-sm border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-sf font-semibold text-foreground">
              Intégration en minutes
            </h2>
            <p className="font-inter text-muted-foreground">
              Une seule ligne de code suffit pour commencer
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-medium border border-border/50 text-left">
            <div className="bg-muted/30 p-6 rounded-xl font-mono text-sm space-y-2">
              <div className="text-muted-foreground">// Recherche simple</div>
              <div>
                <span className="text-blue-600">const</span> 
                <span className="text-foreground"> result = </span>
                <span className="text-green-600">await</span>
                <span className="text-purple-600"> vision</span>
                <span className="text-foreground">.search(image, query)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoModal 
        isOpen={isModalOpen}
        onClose={closeDemo}
        apiType={selectedAPI}
      />
    </div>
  );
};

export default Index;
