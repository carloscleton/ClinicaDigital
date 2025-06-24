import React, { useState } from "react";
import VerticalRuler from "@/components/vertical-ruler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Printer, ZoomIn, ZoomOut } from "lucide-react";

export default function RulerDemo() {
  const [rulerHeight, setRulerHeight] = useState(500);
  const [maxCm, setMaxCm] = useState(20);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // Create a new SVG element
    const svgElement = document.querySelector('.ruler-container svg') as SVGElement;
    if (!svgElement) return;
    
    // Clone the SVG for download
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'vertical-ruler.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Vertical Ruler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Ruler Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="height-slider">Height (pixels): {rulerHeight}px</Label>
              <Slider
                id="height-slider"
                min={200}
                max={800}
                step={10}
                value={[rulerHeight]}
                onValueChange={(values) => setRulerHeight(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cm-slider">Maximum CM: {maxCm}cm</Label>
              <Slider
                id="cm-slider"
                min={5}
                max={50}
                step={1}
                value={[maxCm]}
                onValueChange={(values) => setMaxCm(values[0])}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setMaxCm(Math.max(5, maxCm - 5))}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setMaxCm(Math.min(50, maxCm + 5))}
              >
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 flex justify-center print:block">
          <div className="ruler-container flex justify-center items-center bg-gray-50 p-8 rounded-lg print:p-0 print:bg-white">
            <VerticalRuler 
              height={rulerHeight} 
              maxCm={maxCm} 
              className="print:mx-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>About This Ruler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This is a precise vertical ruler with measurements in centimeters and millimeters. 
              The ruler displays clear markings with major centimeter divisions shown as bold lines 
              with numbers, and minor millimeter divisions as shorter lines.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              You can adjust the height and scale of the ruler using the controls. 
              The ruler is designed to be accurate for both digital use and printing. 
              Use the print button to print a physical copy or download as SVG for digital use.
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> When printing, make sure to disable headers, footers, and 
                scaling options in your browser's print dialog for accurate measurements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}