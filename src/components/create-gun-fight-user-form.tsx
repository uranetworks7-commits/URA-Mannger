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
import { createGunFightUser } from "@/app/actions";
import { Loader2 } from "lucide-react";

const gunFightSchema = z.object({
  username: z.string().min(1, "Username is required."),
});

type GunFightFormValues = z.infer<typeof gunFightSchema>;

const initialState = {
  type: null,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Create User
    </Button>
  );
}

export function CreateGunFightUserForm() {
  const [state, formAction] = useActionState(createGunFightUser, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<GunFightFormValues>({
    resolver: zodResolver(gunFightSchema),
    defaultValues: {
      username: "",
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
                <Input placeholder="Enter username" {...field} />
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
