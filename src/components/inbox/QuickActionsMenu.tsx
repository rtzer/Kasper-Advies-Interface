import { useState } from "react";
import { User, Tag, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAssignConversation, useUpdateConversationTags, useUpdateConversationPriority } from "@/lib/api/conversations";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsMenuProps {
  conversationId: string;
  conversationName: string;
  currentAssignee?: string;
  currentTags: string[];
  currentPriority: 'urgent' | 'high' | 'normal' | 'low';
}

const teamMembers = [
  "Harm-Jan Kaspers",
  "Julie van den Berg",
  "Tom Jansen",
  "Sarah de Vries"
];

export function QuickActionsMenu({ 
  conversationId, 
  conversationName,
  currentAssignee,
  currentTags,
  currentPriority 
}: QuickActionsMenuProps) {
  const { toast } = useToast();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || "");
  const [tags, setTags] = useState<string[]>(currentTags);
  const [newTag, setNewTag] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(currentPriority);

  const assignMutation = useAssignConversation();
  const updateTagsMutation = useUpdateConversationTags();
  const updatePriorityMutation = useUpdateConversationPriority();

  const handleAssign = () => {
    assignMutation.mutate(
      { conversationId, assignedTo: selectedAssignee },
      {
        onSuccess: () => {
          toast({
            title: "Conversatie toegewezen",
            description: `Toegewezen aan ${selectedAssignee}`,
          });
          setAssignDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Fout",
            description: "Kon conversatie niet toewijzen",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveTags = () => {
    updateTagsMutation.mutate(
      { conversationId, tags },
      {
        onSuccess: () => {
          toast({
            title: "Tags bijgewerkt",
            description: `Tags voor ${conversationName} zijn bijgewerkt`,
          });
          setTagDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Fout",
            description: "Kon tags niet bijwerken",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleUpdatePriority = () => {
    updatePriorityMutation.mutate(
      { conversationId, priority: selectedPriority },
      {
        onSuccess: () => {
          toast({
            title: "Prioriteit bijgewerkt",
            description: `Prioriteit ingesteld op ${selectedPriority}`,
          });
          setPriorityDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Fout",
            description: "Kon prioriteit niet bijwerken",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 hover:bg-red-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'normal': return 'bg-blue-500 hover:bg-blue-600';
      case 'low': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <>
      {/* Quick Action Buttons */}
      <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAssignDialogOpen(true);
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Toewijzen"
        >
          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTagDialogOpen(true);
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Tag toevoegen"
        >
          <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPriorityDialogOpen(true);
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Prioriteit aanpassen"
        >
          <Flag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Conversatie toewijzen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Wijs "{conversationName}" toe aan een teamlid
            </p>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer teamlid" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleAssign} disabled={!selectedAssignee || assignMutation.isPending}>
              {assignMutation.isPending ? "Toewijzen..." : "Toewijzen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Tags beheren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nieuwe tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outline">
                Toevoegen
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">Geen tags</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleSaveTags} disabled={updateTagsMutation.isPending}>
              {updateTagsMutation.isPending ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Prioriteit aanpassen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Stel prioriteit in voor "{conversationName}"
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['urgent', 'high', 'normal', 'low'] as const).map((priority) => (
                <Button
                  key={priority}
                  variant={selectedPriority === priority ? "default" : "outline"}
                  className={selectedPriority === priority ? getPriorityColor(priority) : ""}
                  onClick={() => setSelectedPriority(priority)}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {priority === 'urgent' && 'Urgent'}
                  {priority === 'high' && 'Hoog'}
                  {priority === 'normal' && 'Normaal'}
                  {priority === 'low' && 'Laag'}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPriorityDialogOpen(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpdatePriority} disabled={updatePriorityMutation.isPending}>
              {updatePriorityMutation.isPending ? "Bijwerken..." : "Bijwerken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
