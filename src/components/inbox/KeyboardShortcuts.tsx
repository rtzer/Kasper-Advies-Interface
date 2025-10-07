import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcuts = ({ open, onOpenChange }: KeyboardShortcutsProps) => {
  const shortcuts = [
    { keys: "Ctrl/Cmd + K", description: "Zoeken in gesprekken" },
    { keys: "Ctrl/Cmd + /", description: "Toon sneltoetsen" },
    { keys: "Ctrl/Cmd + U", description: "Upload bestand" },
    { keys: "Enter", description: "Verstuur bericht" },
    { keys: "Shift + Enter", description: "Nieuwe regel" },
    { keys: "Escape", description: "Sluit dialogen" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sneltoetsen</DialogTitle>
          <DialogDescription>
            Toetsenbord shortcuts om sneller te werken
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const useKeyboardShortcuts = (handlers: {
  onSearch?: () => void;
  onUpload?: () => void;
  onShowShortcuts?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "k") {
        e.preventDefault();
        handlers.onSearch?.();
      } else if (modKey && e.key === "/") {
        e.preventDefault();
        handlers.onShowShortcuts?.();
      } else if (modKey && e.key === "u") {
        e.preventDefault();
        handlers.onUpload?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
};
