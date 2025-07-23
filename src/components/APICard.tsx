import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="group relative overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-strong transition-all duration-500 hover:-translate-y-2">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative space-y-6 pb-4">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-500 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div>
          <CardTitle className="text-xl font-sf font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="font-inter text-muted-foreground leading-relaxed mt-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        <div>
          <h4 className="font-inter font-medium text-sm text-foreground mb-3">Cas d'usage</h4>
          <div className="space-y-2">
            {useCases.map((useCase, index) => (
              <div 
                key={index} 
                className="text-sm font-inter text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg"
              >
                {useCase}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={onTryNow}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-inter font-medium rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 group/button"
          size="lg"
        >
          <span>Tester</span>
          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default APICard;