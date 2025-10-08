import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

export default function FlowbiteNotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="mb-4 text-9xl font-bold text-gray-900 dark:text-white">404</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Pagina niet gevonden
        </h2>
        <p className="mb-8 text-lg text-gray-500 dark:text-gray-400 max-w-md">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            Terug naar Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Ga terug
          </button>
        </div>
      </div>
    </div>
  );
}
