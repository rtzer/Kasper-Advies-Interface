import { Card } from '@/components/ui/card';

export default function ClientTasks({ klantId }: { klantId: string }) {
  return (
    <Card className="p-6">
      <p className="text-ka-gray-500 dark:text-gray-400">
        Taken voor klant {klantId} worden hier getoond.
        (Wordt in Prompt 5 gebouwd)
      </p>
    </Card>
  );
}
