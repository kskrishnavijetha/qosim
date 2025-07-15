
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, FileText, Zap, Github, Book, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import GitHubIntegration from "@/components/github/GitHubIntegration";

const IntegrationsPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim SDKs & Integrations
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access QOSim's quantum simulation capabilities and integrate with your development workflow
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sdks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          {/* SDKs Tab */}
          <TabsContent value="sdks" className="space-y-6">
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
                      <Link to="/sdk-docs">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documentation
                      </Link>
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
                      <Link to="/sdk-docs">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documentation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GitHub Integration Tab */}
          <TabsContent value="github">
            <GitHubIntegration />
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Learn the basics of quantum circuit simulation with QOSim.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <a href="/qosim-getting-started.pdf" target="_blank">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Step-by-step tutorials for building quantum algorithms.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <a href="/qosim-tutorials.pdf" target="_blank">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    SDK Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive API reference and examples for both SDKs.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/sdk-docs">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Online
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Examples Repository
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Browse code examples and sample projects on GitHub.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <a href="https://github.com/qosim/examples" target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Cheat sheets and quick reference guides for developers.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Watch video tutorials and walkthroughs.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default IntegrationsPage;