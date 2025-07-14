
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Download, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const IntegrationsPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SDKs Section */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                QOSim SDKs
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access QOSim's quantum simulation capabilities in your preferred programming language
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* JavaScript SDK */}
            <Card className="border-quantum-glow/20 hover:border-quantum-glow/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-quantum-glow/20 to-quantum-glow/10 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-quantum-glow" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">JavaScript SDK</CardTitle>
                    <p className="text-sm text-muted-foreground">Browser & Node.js support</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Build quantum circuits directly in the browser or integrate with your JavaScript applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href="/qosim-core.js" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Core
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href="/qosim-visualizer.js" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Visualizer
                    </a>
                  </Button>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href="/qosim-getting-started.pdf" target="_blank">
                      <FileText className="w-4 h-4 mr-2" />
                      Getting Started Guide
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Python SDK */}
            <Card className="border-quantum-neon/20 hover:border-quantum-neon/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-quantum-neon/20 to-quantum-neon/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-quantum-neon" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Python SDK</CardTitle>
                    <p className="text-sm text-muted-foreground">Scientific computing ready</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Integrate with NumPy, SciPy, and other scientific Python libraries for advanced quantum computing research.
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/qosim-sdk.py" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Python SDK
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/python-sdk">
                      <FileText className="w-4 h-4 mr-2" />
                      View Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntegrationsPage;