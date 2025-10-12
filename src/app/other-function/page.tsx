
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, ref, child } from 'firebase/database';
import { mailDb, redeemRequestDb, withdrawalDb } from '@/lib/firebase';
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

interface Withdrawal {
    id: string;
    amount: number;
    fee: number;
    redeemCode: string;
    status: string;
    timestamp: number;
    totalDeducted: number;
    userId: string;
    username: string;
    withdrawalId: string;
}

export default function OtherFunctionPage() {
  const router = useRouter();
  const [mails, setMails] = useState<Mail[]>([]);
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
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

        // Fetch Withdrawals
        const withdrawalSnapshot = await get(child(ref(withdrawalDb), 'users'));
        if (withdrawalSnapshot.exists()) {
            const usersData = withdrawalSnapshot.val();
            const loadedWithdrawals: Withdrawal[] = [];
            for (const userId in usersData) {
                if (usersData[userId].withdrawals) {
                    for (const withdrawalId in usersData[userId].withdrawals) {
                        loadedWithdrawals.push({
                            id: withdrawalId,
                            ...usersData[userId].withdrawals[withdrawalId]
                        });
                    }
                }
            }
            setWithdrawals(loadedWithdrawals);
        } else {
            setWithdrawals([]);
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
      <div className="w-full max-w-2xl">
        <Button asChild variant="outline" size="sm" className="mb-4">
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
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
                <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
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
              <TabsContent value="redeem">
                <Card>
                  <CardHeader>
                    <CardTitle>Redeems</CardTitle>
                    <CardDescription>All redeems are listed here.</CardDescription>
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
              <TabsContent value="withdrawal">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal Information</CardTitle>
                    <CardDescription>All withdrawals are listed here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading && <p>Loading withdrawals...</p>}
                    {error && <p className="text-destructive">Error: {error}</p>}
                    {!loading && !error && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Redeem Code</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {withdrawals.length > 0 ? (
                            withdrawals.map(withdrawal => (
                              <TableRow key={withdrawal.id}>
                                <TableCell>{withdrawal.username}</TableCell>
                                <TableCell>{withdrawal.amount}</TableCell>
                                <TableCell>{withdrawal.fee}</TableCell>
                                <TableCell>{withdrawal.status}</TableCell>
                                <TableCell>{withdrawal.redeemCode}</TableCell>
                                <TableCell>{new Date(withdrawal.timestamp).toLocaleString()}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                No withdrawals found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="form">
                <Card>
                  <CardHeader>
                    <CardTitle>External Form</CardTitle>
                    <CardDescription>Click the button to view the external form.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="https://ura-services.netlify.app" target="_blank" rel="noopener noreferrer">
                        View Form
                      </Link>
                    </Button>
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
