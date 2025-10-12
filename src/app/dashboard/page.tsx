
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
import { CreateMasterAccountForm } from "@/components/create-master-account-form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isModerator = localStorage.getItem('isModerator') === 'true';
    if (!isModerator) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">X Crypto Accounts</h1>
          <p className="text-muted-foreground mt-2">URA System</p>
      </div>
      <Tabs defaultValue="master-account" orientation="vertical" className="w-full max-w-5xl flex gap-8">
        <TabsList className="flex flex-col h-auto justify-start">
          <TabsTrigger value="master-account" className="w-full justify-start">Master Account</TabsTrigger>
          <Link href="/manual" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>
            Manual
          </Link>
           <Link href="/other-function" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>
            Other Function
          </Link>
        </TabsList>
        <div className="flex-grow">
          <TabsContent value="master-account" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Create Master Account</CardTitle>
                <CardDescription>
                  Create all accounts at once with a single form.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateMasterAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
