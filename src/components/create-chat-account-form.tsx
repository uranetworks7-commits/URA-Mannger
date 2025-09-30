"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChatAccount } from "@/app/actions";
import { Loader2 } from "lucide-react";

const chatAccountSchema = z.object({
  username: z.string().min(1, "Username is required."),
  customName: z.string().min(1, "Custom name is required."),
  profileImageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

type ChatFormValues = z.infer<typeof chatAccountSchema>;

const initialState = {
  type: null,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Create Account
    </Button>
  );
}

export function CreateChatAccountForm() {
  const [state, formAction] = useActionState(createChatAccount, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatAccountSchema),
    defaultValues: {
      username: "",
      customName: "",
      profileImageUrl: "",
    },
  });

  useEffect(() => {
    if (state.type === "success") {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      });
      form.reset();
      formRef.current?.reset();
    } else if (state.type === "error" && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form ref={formRef} action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g. arman@45" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. @Bruce Banner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
