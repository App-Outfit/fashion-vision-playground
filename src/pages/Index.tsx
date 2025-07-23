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
      title: "🔍 Recherche Cross-Modal",
      description: "Recherchez par image, texte, ou combinaison des deux. Trouvez des produits similaires ou des variantes dans votre catalogue avec une précision inégalée.",
      useCases: [
        "Moteur de recherche intelligent",
        "Recommandation visuelle personnalisée", 
        "Recherche de variantes produits",
        "Analyse comparative automatique"
      ],
      gradient: "bg-gradient-primary",
      apiType: "search" as const
    },
    {
      icon: Scissors,
      title: "✂️ Segmentation Précise",
      description: "Segmentation automatique des vêtements et parties du corps avec une précision de niveau professionnel. Détection ultra-fine des contours.",
      useCases: [
        "Essayage virtuel immersif",
        "Suppression d'arrière-plan intelligente",
        "Extraction de vêtements automatique",
        "Analyse morphologique détaillée"
      ],
      gradient: "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600",
      apiType: "segmentation" as const
    },
    {
      icon: Tag,
      title: "🏷️ Classification Multi-Label",
      description: "Classification personnalisée avec vos propres labels. Analysez le style, les couleurs, les catégories avec une flexibilité totale.",
      useCases: [
        "Étiquetage automatique intelligent",
        "Analyse de style sophistiquée",
        "Enrichissement de catalogue dynamique",
        "Filtrage sémantique avancé"
      ],
      gradient: "bg-gradient-to-r from-orange-400 via-red-500 to-pink-600",
      apiType: "classification" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <HeroSection />
      
      {/* APIs Section */}
      <section id="apis-section" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6">
              🚀 Nos APIs de Vision par Ordinateur
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ✨ Des outils puissants et faciles à intégrer pour transformer l'expérience digitale de vos marques de mode
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apis.map((api, index) => (
              <APICard
                key={index}
                icon={api.icon}
                title={api.title}
                description={api.description}
                useCases={api.useCases}
                gradient={api.gradient}
                onTryNow={() => openDemo(api.apiType)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-6 bg-gradient-card border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
            ⚡ Intégration Simple et Rapide
          </h2>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-glow border border-border/50 hover:shadow-strong transition-all duration-500">
            <div className="text-left">
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <div className="text-muted-foreground mb-2">// Exemple d'intégration</div>
                <div className="space-y-1">
                  <div><span className="text-blue-600">const</span> response = <span className="text-green-600">await</span> <span className="text-purple-600">fetch</span>(<span className="text-orange-600">'https://api.fashion-vision.com/search'</span>, {"{"};</div>
                  <div className="ml-4"><span className="text-blue-600">method</span>: <span className="text-orange-600">'POST'</span>,</div>
                  <div className="ml-4"><span className="text-blue-600">headers</span>: {"{"} <span className="text-orange-600">'Content-Type'</span>: <span className="text-orange-600">'application/json'</span> {"}"},</div>
                  <div className="ml-4"><span className="text-blue-600">body</span>: <span className="text-purple-600">JSON</span>.<span className="text-purple-600">stringify</span>({"{"} query, image {"}"}) </div>
                  <div>{"});"}</div>
                </div>
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
