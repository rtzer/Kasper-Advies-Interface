import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FileUploadDialog = ({ open, onOpenChange }: FileUploadDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    toast({
      title: "Bestanden uploaden",
      description: `${files.length} bestand(en) worden geüpload...`,
    });
    setFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bestanden uploaden</DialogTitle>
          <DialogDescription>
            Kies bestanden om te uploaden naar dit gesprek
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Klik om bestanden te selecteren
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0}>
              Upload ({files.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
