"use client";

import type React from "react";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://derrick.rw");
  const [qrCode, setQRCode] = useState("https://derrick.rw");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>("M");
  const qrCodeRef = useRef<SVGSVGElement>(null);

  const generateQRCode = (e: React.FormEvent) => {
    e.preventDefault();
    setQRCode(url);
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    // Set canvas dimensions to match QR code size
    canvas.width = size;
    canvas.height = size;

    // Create a data URL from the SVG
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Create download link
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${new Date().getTime()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up
      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateQRCode} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="Enter a URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">QR Code Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="size">
                Size: {size}x{size}
              </Label>
              <Slider
                id="size"
                min={100}
                max={400}
                step={10}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="errorCorrection">Error Correction Level</Label>
              <Select
                value={errorCorrection}
                onValueChange={(value: string) => setErrorCorrection(value as ErrorCorrectionLevel)}
              >
                <SelectTrigger id="errorCorrection">
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Generate QR Code
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {qrCode && (
            <div className="mt-4 flex flex-col items-center">
              <QRCodeSVG
                ref={qrCodeRef}
                value={qrCode}
                size={size}
                fgColor={color}
                bgColor={backgroundColor}
                level={errorCorrection}
                includeMargin={true}
              />
              <Button onClick={downloadQRCode} className="mt-4 flex items-center gap-2" variant="outline">
                <Download size={16} />
                Download QR Code
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
