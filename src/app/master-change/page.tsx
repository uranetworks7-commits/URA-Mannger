
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MasterChangeForm } from "@/components/master-change-form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MasterChangePage() {
  const router = useRouter();

  useEffect(() => {
    const isModerator = localStorage.getItem('isModerator') === 'true';
    if (!isModerator) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Master Change</CardTitle>
            <CardDescription>
              Update user details across all services. Enter the current username and the new information you want to set.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MasterChangeForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
