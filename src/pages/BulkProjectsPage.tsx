import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BulkBTWCreator from '@/components/projects/BulkBTWCreator';

export default function BulkProjectsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/app/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar projecten
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Bulk Projecten Aanmaken
        </h1>
        <p className="text-muted-foreground mt-1">
          Maak meerdere projecten tegelijk aan voor efficiënt beheer
        </p>
      </div>

      <BulkBTWCreator />
    </div>
  );
}
