
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [moderatorId, setModeratorId] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (moderatorId === 'URA225') {
      localStorage.setItem('isModerator', 'true');
      router.replace('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid Moderator ID.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Moderator Login</CardTitle>
            <CardDescription>Please enter your Moderator ID to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moderatorId">Moderator ID</Label>
                <Input
                  id="moderatorId"
                  type="text"
                  value={moderatorId}
                  onChange={(e) => setModeratorId(e.target.value)}
                  placeholder="Enter your ID"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
