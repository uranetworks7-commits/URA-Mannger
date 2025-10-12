
'use client';

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
import { CreateXPostAccountForm } from "@/components/create-x-post-account-form"
import { CreateBitcoinAccountForm } from "@/components/create-bitcoin-account-form"
import { CreateChatAccountForm } from "@/components/create-chat-account-form"
import { CreateGunFightUserForm } from "@/components/create-gun-fight-user-form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">X Crypto Accounts</h1>
            <p className="text-muted-foreground mt-2">URA System</p>
        </div>
        <Tabs defaultValue="x-post" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="x-post">X Post</TabsTrigger>
            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="gun-fight">Gun Fight</TabsTrigger>
          </TabsList>
          <TabsContent value="x-post">
            <Card>
              <CardHeader>
                <CardTitle>Create X Post Account</CardTitle>
                <CardDescription>
                  Enter details to create a new X Post account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateXPostAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bitcoin">
            <Card>
              <CardHeader>
                <CardTitle>Create Bitcoin Account</CardTitle>
                <CardDescription>
                  Enter details for your new Bitcoin account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateBitcoinAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Create Chat Account</CardTitle>
                <CardDescription>
                  Enter details for your new Chat account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateChatAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gun-fight">
            <Card>
              <CardHeader>
                <CardTitle>Create Gun Fight User</CardTitle>
                <CardDescription>
                  Enter a username to create a new Gun Fight user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateGunFightUserForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
