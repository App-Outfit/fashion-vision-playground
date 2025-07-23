import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageSearchDemo from "./ImageSearchDemo";
import SegmentationDemo from "./SegmentationDemo";
import ClassificationDemo from "./ClassificationDemo";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiType: "search" | "segmentation" | "classification" | null;
}

const DemoModal = ({ isOpen, onClose, apiType }: DemoModalProps) => {
  const renderDemo = () => {
    switch (apiType) {
      case "search":
        return <ImageSearchDemo />;
      case "segmentation":
        return <SegmentationDemo />;
      case "classification":
        return <ClassificationDemo />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (apiType) {
      case "search":
        return "Tester l'API de Recherche";
      case "segmentation":
        return "Tester l'API de Segmentation";
      case "classification":
        return "Tester l'API de Classification";
      default:
        return "API Demo";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {renderDemo()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;