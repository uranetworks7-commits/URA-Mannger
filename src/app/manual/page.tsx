
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
import { CreateMainLoginForm } from "@/components/create-main-login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ManualPage() {
  const router = useRouter();

  useEffect(() => {
    const isModerator = localStorage.getItem('isModerator') === 'true';
    if (!isModerator) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-5xl">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Manual Account Creation</CardTitle>
            <CardDescription>
              Create accounts for each service individually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="x-post" orientation="vertical" className="w-full flex gap-8">
              <TabsList className="flex flex-col h-auto justify-start">
                <TabsTrigger value="x-post" className="w-full justify-start">X Post</TabsTrigger>
                <TabsTrigger value="chat" className="w-full justify-start">Chat</TabsTrigger>
                <TabsTrigger value="gun-fight" className="w-full justify-start">Gun Fight</TabsTrigger>
                <TabsTrigger value="gift-box" className="w-full justify-start">Gift Box</TabsTrigger>
                <TabsTrigger value="ura-trade" className="w-full justify-start">URA Trade</TabsTrigger>
                <TabsTrigger value="main-login" className="w-full justify-start">Main Login</TabsTrigger>
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
                 <TabsContent value="main-login" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Main Login User</CardTitle>
                      <CardDescription>
                        Enter a username and email to create a new user.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CreateMainLoginForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
