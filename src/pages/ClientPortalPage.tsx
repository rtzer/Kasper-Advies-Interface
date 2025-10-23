import { useState } from 'react';
import { Upload, Clock, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/lib/api/projects';
import { formatDeadline, getStatusColor, getStatusLabel } from '@/lib/utils/projectHelpers';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function ClientPortalPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // In production, this would be filtered by authenticated client
  // For now, showing mock data
  const { data: projectsData, isLoading } = useProjects({});
  
  // Filter to active projects only
  const activeProjects = (projectsData?.results || []).filter(
    p => p.status !== 'afgerond' && p.status !== 'niet-gestart'
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Selecteer eerst bestanden om te uploaden');
      return;
    }

    setUploading(true);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success(`${selectedFiles.length} ${selectedFiles.length === 1 ? 'bestand' : 'bestanden'} succesvol geüpload!`);
    setSelectedFiles([]);
    setUploading(false);
  };

  const projectsNeedingAction = activeProjects.filter(
    p => p.status === 'wacht-op-klant'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ka-navy/5 to-ka-green/5 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ka-navy/5 to-ka-green/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welkom bij Kaspers Advies
          </h1>
          <p className="text-muted-foreground">
            Uw persoonlijke projecten overzicht
          </p>
        </div>

        {/* Action Required Alert */}
        {projectsNeedingAction.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Actie Vereist
              </CardTitle>
              <CardDescription className="text-yellow-700">
                {projectsNeedingAction.length} {projectsNeedingAction.length === 1 ? 'project wacht' : 'projecten wachten'} op uw input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectsNeedingAction.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-yellow-200 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Deadline: {formatDeadline(project.deadline)}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Actie nodig</Badge>
                  </div>
                  <div className="text-sm text-foreground">
                    <p className="font-medium mb-1">Wij hebben de volgende documenten nodig:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Bankafschriften van laatste kwartaal</li>
                      <li>Alle inkoop- en verkoopfacturen</li>
                      <li>Overzicht van contante uitgaven</li>
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Lopende Projecten</CardTitle>
            <CardDescription>
              Overzicht van al uw actieve projecten bij Kaspers Advies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeProjects.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">Geen actieve projecten op dit moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDeadline(project.deadline)}
                          </span>
                          <span>{project.responsible_team_member}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Voortgang</span>
                        <span className="font-medium">{project.completion_percentage}%</span>
                      </div>
                      <Progress value={project.completion_percentage} className="h-2" />
                    </div>

                    {project.status === 'wacht-op-klant' && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-yellow-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Wij wachten op uw documenten
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-ka-green" />
              Documenten Uploaden
            </CardTitle>
            <CardDescription>
              Upload hier de gevraagde documenten voor uw projecten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-ka-green hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Sleep bestanden hierheen of klik om te selecteren
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, Word, Excel, of afbeeldingen (max 10MB per bestand)
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm font-medium text-foreground">
                  Geselecteerde bestanden ({selectedFiles.length}):
                </p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        disabled={uploading}
                      >
                        Verwijder
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full bg-ka-green hover:bg-ka-green/90"
            >
              {uploading ? (
                <>Bezig met uploaden...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'bestand' : 'bestanden'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-ka-green/20 bg-gradient-to-br from-ka-green/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg">Hulp Nodig?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Heeft u vragen over uw projecten of het uploaden van documenten? Neem gerust contact met ons op.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Afspraak Maken
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
