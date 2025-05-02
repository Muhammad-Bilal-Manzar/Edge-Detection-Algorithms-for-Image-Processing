import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 leading-tight py-1">
            Edge Detection Comparator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Advanced visualization tool for comparing Sobel, Canny, and Prewitt edge detection algorithms
          </p>
        </header>
        
        <UploadForm />
        
        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2025 Edge Detection Analysis Project</p>
        </footer>
      </div>
    </div>
  );
}

export default App;