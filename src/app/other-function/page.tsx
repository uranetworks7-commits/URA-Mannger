
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, ref, child } from 'firebase/database';
import { mailDb, redeemRequestDb } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Mail {
  id: string;
  message: string;
  reply: string;
  timestamp: number;
  username: string;
}

interface RedeemRequest {
  id: string;
  amount: number;
  newBalance: number;
  time: string;
  username: string;
}

export default function OtherFunctionPage() {
  const router = useRouter();
  const [mails, setMails] = useState<Mail[]>([]);
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isModerator = localStorage.getItem('isModerator') === 'true';
    if (!isModerator) {
      router.replace('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Mails
        const mailSnapshot = await get(child(ref(mailDb), 'mails'));
        if (mailSnapshot.exists()) {
          const data = mailSnapshot.val();
          const loadedMails: Mail[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setMails(loadedMails);
        } else {
          setMails([]);
        }

        // Fetch Redeem Requests
        const redeemSnapshot = await get(child(ref(redeemRequestDb), 'redeemRequests'));
        if (redeemSnapshot.exists()) {
            const data = redeemSnapshot.val();
            const loadedRequests: RedeemRequest[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));
            setRedeemRequests(loadedRequests);
        } else {
            setRedeemRequests([]);
        }

      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Other Functions</CardTitle>
            <CardDescription>View mails and redeem requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mail-box">
              <TabsList>
                <TabsTrigger value="mail-box">Mail Box</TabsTrigger>
                <TabsTrigger value="redeem-request">Redeem Request</TabsTrigger>
              </TabsList>
              <TabsContent value="mail-box">
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
              </TabsContent>
              <TabsContent value="redeem-request">
                <Card>
                  <CardHeader>
                    <CardTitle>Redeem Requests</CardTitle>
                    <CardDescription>All redeem requests are listed here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading && <p>Loading requests...</p>}
                    {error && <p className="text-destructive">Error: {error}</p>}
                    {!loading && !error && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>New Balance</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {redeemRequests.length > 0 ? (
                            redeemRequests.map(request => (
                              <TableRow key={request.id}>
                                <TableCell>{request.username}</TableCell>
                                <TableCell>{request.amount}</TableCell>
                                <TableCell>{request.newBalance}</TableCell>
                                <TableCell>{request.time}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No redeem requests found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
