import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold font-mono text-foreground">404</h1>
        <p className="mb-2 text-lg text-muted-foreground font-mono">ACCESS DENIED</p>
        <p className="mb-6 text-sm text-muted-foreground">This path does not exist in the maze.</p>
        <a href="/" className="font-mono text-sm text-foreground border border-border px-6 py-2 rounded hover:bg-accent transition-colors">
          Return to Base
        </a>
      </div>
    </div>
  );
};

export default NotFound;
