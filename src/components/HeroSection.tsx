import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const scrollToAPIs = () => {
    const apisSection = document.getElementById('apis-section');
    apisSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight animate-pulse">
            ✨ Vision APIs for Fashion
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            🎯 Transformez l'expérience digitale de vos marques avec nos APIs de vision par ordinateur intelligentes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="lovable" 
              size="xl"
              onClick={scrollToAPIs}
              className="group shadow-glow"
            >
              🚀 Découvrir les APIs
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
            
            <Button variant="elegant" size="xl" className="group">
              📚 Documentation
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-border/20">
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">3</div>
            <div className="text-muted-foreground">🔥 APIs Puissantes</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">99.9%</div>
            <div className="text-muted-foreground">🎯 Précision</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">&lt;500ms</div>
            <div className="text-muted-foreground">⚡ Temps de réponse</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;