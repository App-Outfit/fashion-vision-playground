import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-apple.jpg";

const HeroSection = () => {
  const scrollToAPIs = () => {
    const apisSection = document.getElementById('apis-section');
    apisSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-secondary">
      {/* Background with subtle pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-glass backdrop-blur-glass" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-12 animate-fade-in">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-sf font-light tracking-tight text-foreground">
              Vision
            </h1>
            <p className="text-xl md:text-2xl font-inter font-light text-muted-foreground">
              Intelligence artificielle pour la mode
            </p>
          </div>
          
          {/* Description */}
          <p className="text-lg font-inter text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Trois APIs puissantes qui transforment la façon dont vos clients découvrent, 
            essaient et achètent vos produits.
          </p>
          
          {/* CTA */}
          <div className="pt-8">
            <Button 
              onClick={scrollToAPIs}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-inter font-medium shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
              size="lg"
            >
              Découvrir
              <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Subtle stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-border/30">
          <div className="text-center space-y-1">
            <div className="text-2xl font-sf font-semibold text-foreground">3</div>
            <div className="text-sm font-inter text-muted-foreground">APIs</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-sf font-semibold text-foreground">99.9%</div>
            <div className="text-sm font-inter text-muted-foreground">Précision</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-sf font-semibold text-foreground">&lt;500ms</div>
            <div className="text-sm font-inter text-muted-foreground">Latence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;