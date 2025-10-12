
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { BanUnbanForm } from "@/components/ban-unban-form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DangerZonePage() {
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
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Ban or unban user accounts. These actions are critical and should be handled with care.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ban" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ban">Ban Account</TabsTrigger>
                <TabsTrigger value="unban">Unban Account</TabsTrigger>
              </TabsList>
              <TabsContent value="ban" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ban User Account</CardTitle>
                    <CardDescription>
                      This will append #URA225 to the username across all services, effectively banning them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BanUnbanForm actionType="ban" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="unban" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Unban User Account</CardTitle>
                    <CardDescription>
                      This will remove #URA225 from the username, restoring their access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BanUnbanForm actionType="unban" />
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
