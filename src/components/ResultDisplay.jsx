import { useState } from "react";
import { Maximize, BarChart2 } from "lucide-react";

export default function ResultDisplay({ data, originalImage }) {
  const [activeTab, setActiveTab] = useState("comparison");
  const [activeAlgo, setActiveAlgo] = useState("sobel");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  // Find the fastest algorithm
  const fastestAlgo = Object.entries(data).reduce(
    (fastest, [algo, info]) => 
      info.time < data[fastest].time ? algo : fastest, 
    "sobel"
  );

  // Calculate performance ratio for visualization
  const maxTime = Math.max(...Object.values(data).map(info => info.time));
  const getPerformanceRatio = (time) => (time / maxTime) * 100;

  const handleFullscreen = (imageType) => {
    if (imageType === "original") {
      setFullscreenImage({ src: originalImage, title: "Original Image" });
    } else {
      setFullscreenImage({ 
        src: `data:image/png;base64,${data[imageType].image}`, 
        title: `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} Edge Detection` 
      });
    }
  };

  const getColorClass = (algo) => {
    switch(algo) {
      case "sobel": return "from-blue-500 to-blue-700";
      case "canny": return "from-green-500 to-green-700";
      case "prewitt": return "from-purple-500 to-purple-700";
      default: return "from-gray-500 to-gray-700";
    }
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-900/50 rounded-lg p-1">
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "comparison" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("comparison")}
        >
          Side-by-Side Comparison
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "detailed" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("detailed")}
        >
          Detailed Analysis
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "performance" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance Metrics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "comparison" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/70 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-200">Original</h3>
              <button 
                onClick={() => handleFullscreen("original")}
                className="p-1 hover:bg-gray-700 rounded-md transition-colors"
              >
                <Maximize size={16} />
              </button>
            </div>
            <div className="p-3">
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {["sobel", "canny", "prewitt"].map((algo) => (
            <div 
              key={algo} 
              className={`bg-gray-900/70 rounded-xl overflow-hidden ${
                algo === fastestAlgo ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-200 capitalize">
                    {algo}
                    {algo === fastestAlgo && (
                      <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                        Fastest
                      </span>
                    )}
                  </h3>
                </div>
                <button 
                  onClick={() => handleFullscreen(algo)}
                  className="p-1 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Maximize size={16} />
                </button>
              </div>
              <div className="p-3">
                <img 
                  src={`data:image/png;base64,${data[algo].image}`} 
                  alt={`${algo} result`} 
                  className="w-full h-auto rounded-lg" 
                />
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-gray-400">Processing time:</span>
                  <span className="font-medium text-white">{data[algo].time.toFixed(4)}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "detailed" && (
        <div className="bg-gray-900/70 rounded-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <div className="flex">
              {["sobel", "canny", "prewitt"].map((algo) => (
                <button
                  key={algo}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeAlgo === algo ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
                  }`}
                  onClick={() => setActiveAlgo(algo)}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">Original Image</h4>
                    <div className="relative group">
                      <img 
                        src={originalImage} 
                        alt="Original" 
                        className="w-full h-auto rounded-lg border border-gray-700" 
                      />
                      <button 
                        onClick={() => handleFullscreen("original")}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        <Maximize size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2 capitalize">{activeAlgo} Result</h4>
                    <div className="relative group">
                      <img 
                        src={`data:image/png;base64,${data[activeAlgo].image}`} 
                        alt={`${activeAlgo} result`} 
                        className="w-full h-auto rounded-lg border border-gray-700" 
                      />
                      <button 
                        onClick={() => handleFullscreen(activeAlgo)}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        <Maximize size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-3">Processing Details</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-400">Algorithm</div>
                    <div className="text-white font-medium capitalize">{activeAlgo}</div>
                    
                    <div className="text-gray-400">Processing Time</div>
                    <div className="text-white font-medium">{data[activeAlgo].time.toFixed(4)}s</div>
                    
                    <div className="text-gray-400">Performance Rank</div>
                    <div className="text-white font-medium">
                      {Object.entries(data)
                        .sort((a, b) => a[1].time - b[1].time)
                        .findIndex(([algo]) => algo === activeAlgo) + 1}
                      {" of 3"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="bg-gray-800 p-4 rounded-lg h-full">
                  <h4 className="text-sm font-medium text-white mb-4 capitalize">{activeAlgo} Algorithm Details</h4>
                  
                  {activeAlgo === "sobel" && (
                    <div className="space-y-4 text-sm text-gray-300">
                      <p>The Sobel operator performs a 2-D spatial gradient measurement on an image, emphasizing regions of high spatial frequency that correspond to edges.</p>
                      <div>
                        <h5 className="font-medium text-white mb-1">Key Characteristics:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Uses two 3×3 kernels to calculate gradient approximations</li>
                          <li>Detects both horizontal and vertical edges</li>
                          <li>Computationally efficient</li>
                          <li>Somewhat sensitive to noise</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-1">Best suited for:</h5>
                        <p>Images with clear contrasts and when processing speed is important.</p>
                      </div>
                    </div>
                  )}
                  
                  {activeAlgo === "canny" && (
                    <div className="space-y-4 text-sm text-gray-300">
                      <p>The Canny edge detector is a multi-stage algorithm that can detect a wide range of edges in images while filtering out noise.</p>
                      <div>
                        <h5 className="font-medium text-white mb-1">Key Characteristics:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Noise reduction with Gaussian filter</li>
                          <li>Non-maximum suppression for thin edges</li>
                          <li>Hysteresis thresholding to track edges</li>
                          <li>Highest precision among common edge detectors</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-1">Best suited for:</h5>
                        <p>Complex images where edge quality is more important than processing speed.</p>
                      </div>
                    </div>
                  )}
                  
                  {activeAlgo === "prewitt" && (
                    <div className="space-y-4 text-sm text-gray-300">
                      <p>The Prewitt operator calculates the approximate gradient of image intensity, highlighting areas of high spatial frequency that correspond to edges.</p>
                      <div>
                        <h5 className="font-medium text-white mb-1">Key Characteristics:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Uses simple 3×3 kernels to approximate derivatives</li>
                          <li>Less sensitive to noise than Sobel</li>
                          <li>Computationally efficient</li>
                          <li>Better at detecting diagonal edges than some operators</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-1">Best suited for:</h5>
                        <p>Images where diagonal edges are important and when a simpler implementation is preferred.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="bg-gray-900/70 rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart2 size={20} className="mr-2" />
              Performance Comparison
            </h3>
            
            <div className="space-y-8">
              {/* Processing Time Bar Chart */}
              <div>
                <h4 className="text-sm text-gray-400 mb-4">Processing Time (seconds)</h4>
                <div className="space-y-4">
                  {Object.entries(data)
                    .sort((a, b) => a[1].time - b[1].time)
                    .map(([algo, info]) => (
                      <div key={algo} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium capitalize text-white">{algo}</span>
                          <span className="text-gray-300">{info.time.toFixed(4)}s</span>
                        </div>
                        <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getColorClass(algo)}`}
                            style={{ width: `${getPerformanceRatio(info.time)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Efficiency Analysis */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-3">Algorithm Efficiency Analysis</h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <p>
                    Among the three algorithms tested on this image, <span className="font-medium capitalize">{fastestAlgo}</span> performed 
                    the fastest with a processing time of {data[fastestAlgo].time.toFixed(4)}s.
                  </p>
                  
                  <div>
                    <h5 className="font-medium text-white mb-1">Relative Performance:</h5>
                    <ul className="space-y-2">
                      {Object.entries(data)
                        .sort((a, b) => a[1].time - b[1].time)
                        .map(([algo, info], index, sorted) => {
                          if (index === 0) return null; // Skip the fastest one as we mentioned it above
                          const ratio = (info.time / sorted[0][1].time).toFixed(2);
                          return (
                            <li key={algo}>
                              <span className="capitalize font-medium">{algo}</span> is {ratio}× slower than {sorted[0][0]}
                            </li>
                          );
                        }).filter(Boolean)}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-white mb-1">Considerations:</h5>
                    <p>
                      While speed is important, algorithm selection should also consider the specific edge detection 
                      qualities needed for your application. Canny typically produces cleaner edges but at a higher 
                      computational cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex flex-col">
            <div className="p-4 flex justify-between items-center bg-gray-900">
              <h3 className="text-white font-medium">{fullscreenImage.title}</h3>
              <button 
                onClick={() => setFullscreenImage(null)}
                className="p-2 rounded-md hover:bg-gray-800 text-gray-300"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <img 
                src={fullscreenImage.src} 
                alt={fullscreenImage.title} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
            
            <div className="p-4 bg-gray-900 flex justify-center gap-4">
              {["original", "sobel", "canny", "prewitt"].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "original") {
                      setFullscreenImage({ src: originalImage, title: "Original Image" });
                    } else {
                      setFullscreenImage({ 
                        src: `data:image/png;base64,${data[item].image}`, 
                        title: `${item.charAt(0).toUpperCase() + item.slice(1)} Edge Detection` 
                      });
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    (item === "original" && fullscreenImage.title === "Original Image") ||
                    fullscreenImage.title.toLowerCase().includes(item)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {item === "original" ? "Original" : item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}