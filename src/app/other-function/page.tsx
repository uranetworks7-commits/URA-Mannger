
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, ref, child } from 'firebase/database';
import { mailDb } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Mail {
  id: string;
  message: string;
  reply: string;
  timestamp: number;
  username: string;
}

export default function OtherFunctionPage() {
  const router = useRouter();
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isModerator = localStorage.getItem('isModerator') === 'true';
    if (!isModerator) {
      router.replace('/login');
      return;
    }

    const fetchMails = async () => {
      try {
        const dbRef = ref(mailDb);
        const snapshot = await get(child(dbRef, 'mails'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedMails: Mail[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setMails(loadedMails);
        } else {
          setMails([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch mails.");
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Mail Box</CardTitle>
            <CardDescription>All received mails are listed here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading mails...</p>}
            {error && <p className="text-destructive">Error: {error}</p>}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Reply</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mails.length > 0 ? (
                    mails.map(mail => (
                      <TableRow key={mail.id}>
                        <TableCell>{mail.username}</TableCell>
                        <TableCell>{mail.message}</TableCell>
                        <TableCell>{mail.reply}</TableCell>
                        <TableCell>{new Date(mail.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No mails found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
