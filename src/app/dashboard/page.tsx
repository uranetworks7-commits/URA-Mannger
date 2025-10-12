
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
import { CreateXPostAccountForm } from "@/components/create-x-post-account-form"
import { CreateChatAccountForm } from "@/components/create-chat-account-form"
import { CreateGunFightUserForm } from "@/components/create-gun-fight-user-form"
import { CreateGiftBoxUserForm } from "@/components/create-gift-box-user-form"
import { CreateUraTradeAccountForm } from "@/components/create-ura-trade-account-form"
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
          <TabsTrigger value="manual" className="w-full justify-start">Manual</TabsTrigger>
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
          <TabsContent value="manual" className="mt-0">
            <Tabs defaultValue="x-post" orientation="vertical" className="w-full flex gap-8">
              <TabsList className="flex flex-col h-auto justify-start">
                <TabsTrigger value="x-post" className="w-full justify-start">X Post</TabsTrigger>
                <TabsTrigger value="chat" className="w-full justify-start">Chat</TabsTrigger>
                <TabsTrigger value="gun-fight" className="w-full justify-start">Gun Fight</TabsTrigger>
                <TabsTrigger value="gift-box" className="w-full justify-start">Gift Box</TabsTrigger>
                <TabsTrigger value="ura-trade" className="w-full justify-start">URA Trade</TabsTrigger>
              </TabsList>
              <div className="flex-grow">
                <TabsContent value="x-post" className="mt-0">
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
                <TabsContent value="chat" className="mt-0">
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
                <TabsContent value="gun-fight" className="mt-0">
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
                <TabsContent value="gift-box" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Gift Box User</CardTitle>
                      <CardDescription>
                        Enter a username to create a new Gift Box user.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CreateGiftBoxUserForm />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="ura-trade" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create URA Trade Account</CardTitle>
                      <CardDescription>
                        Enter details to create a new URA Trade account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CreateUraTradeAccountForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
