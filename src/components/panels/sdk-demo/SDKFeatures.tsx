import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Play, Upload, Download } from "lucide-react";

export function SDKFeatures() {
  const features = [
    {
      icon: Code,
      title: "Circuit Builder",
      description: "Programmatic gate placement"
    },
    {
      icon: Play,
      title: "State Vector Simulation",
      description: "Accurate quantum evolution"
    },
    {
      icon: Upload,
      title: "QASM Support",
      description: "Import/export industry standard"
    },
    {
      icon: Download,
      title: "Embeddable",
      description: "Visual circuit rendering"
    }
  ];

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">SDK Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-quantum-matrix rounded-lg flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-6 h-6 text-quantum-glow" />
              </div>
              <h3 className="font-semibold text-quantum-neon">{feature.title}</h3>
              <p className="text-sm text-quantum-particle">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}