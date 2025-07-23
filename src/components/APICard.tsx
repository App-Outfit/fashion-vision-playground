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
    <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center shadow-medium group-hover:shadow-strong transition-shadow duration-300`}>
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div>
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed mt-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-3">Cas d'usage :</h4>
          <div className="space-y-2">
            {useCases.map((useCase, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full group"
          onClick={onTryNow}
        >
          Tester l'API
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default APICard;