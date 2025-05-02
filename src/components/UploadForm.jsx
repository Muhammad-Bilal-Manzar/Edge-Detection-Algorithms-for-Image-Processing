import { useState } from "react";
import ResultDisplay from "./ResultDisplay";
import { Upload, ArrowRight, ImagePlus } from "lucide-react";

export default function UploadForm() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
  };

  return (
    <div className="w-full max-w-6xl bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-1">Image Analysis</h2>
        <p className="text-gray-400 text-sm">Upload an image to compare different edge detection algorithms</p>
      </div>

      <div className="p-6">
        {!results ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div 
                className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  previewUrl ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-blue-400 hover:bg-gray-700/50"
                }`}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-full w-full object-contain p-2" 
                  />
                ) : (
                  <>
                    <ImagePlus size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-300">Click to select an image</p>
                    <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG</p>
                  </>
                )}
              </div>
              
              <input 
                id="fileInput" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <div className="flex gap-3 mt-4 w-full">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex-1"
                  disabled={!selectedFile}
                >
                  Reset
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload size={18} />
                      Process Image
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 bg-gray-900/50 p-5 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">About Edge Detection</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-blue-400">Sobel Operator</h4>
                  <p>Calculates the gradient of image intensity at each pixel. It emphasizes edges in both horizontal and vertical directions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-400">Canny Edge Detection</h4>
                  <p>Multi-stage algorithm that detects edges while suppressing noise, often producing cleaner results with thinner edges.</p>
                </div>
                <div>
                  <h4 className="font-medium text-purple-400">Prewitt Operator</h4>
                  <p>Similar to Sobel but with different kernel values, sometimes providing better orientation estimation for certain images.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Analysis Results</h3>
              <button
                onClick={resetForm}
                className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                New Analysis
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
              </div>
              <ArrowRight size={24} className="text-gray-400" />
              <div className="flex-1 bg-gray-900/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Processing Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {["sobel", "canny", "prewitt"].map((algo) => (
                    <div key={algo} className="text-sm">
                      <span className={`font-semibold ${
                        algo === "sobel" ? "text-blue-400" : 
                        algo === "canny" ? "text-green-400" : 
                        "text-purple-400"
                      }`}>
                        {algo.charAt(0).toUpperCase() + algo.slice(1)}
                      </span>
                      <span className="block text-white text-xs">
                        {results[algo].time.toFixed(4)}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <ResultDisplay data={results} originalImage={previewUrl} />
          </div>
        )}
      </div>
    </div>
  );
}