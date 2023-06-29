import Button from '@/components/ui/Button';
import { db } from '@/lib/db';

export default async function Home() {
  await db.set('hello2', 'hello2');
  return (
    <main>
      <Button>Hello</Button>
    </main>
  );
}
