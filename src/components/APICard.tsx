import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface APICardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  useCases: string[];
  gradient: string;
  onTryNow: () => void;
}

const APICard = ({ icon: Icon, title, description, useCases, gradient, onTryNow }: APICardProps) => {
  return (
    <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-3 border-border/50 bg-gradient-card backdrop-blur-sm hover:scale-105">
      <CardHeader className="space-y-6">
        <div className={`w-20 h-20 rounded-2xl ${gradient} flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <div>
          <CardTitle className="text-2xl font-bold text-foreground group-hover:bg-gradient-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed mt-3 text-base">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-4">✨ Cas d'usage :</h4>
          <div className="grid grid-cols-1 gap-2">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-accent-foreground hover:scale-105 transition-transform duration-200">
                🎯 {useCase}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="gradient"
          className="w-full group shadow-medium hover:shadow-glow"
          onClick={onTryNow}
          size="lg"
        >
          🚀 Tester l'API
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default APICard;