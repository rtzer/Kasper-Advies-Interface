import { Card } from '@/components/ui/card';

export default function ClientContactPersons({ klantId }: { klantId: string }) {
  return (
    <Card className="p-6">
      <p className="text-ka-gray-500 dark:text-gray-400">
        Contactpersonen voor klant {klantId} worden hier getoond.
      </p>
    </Card>
  );
}
