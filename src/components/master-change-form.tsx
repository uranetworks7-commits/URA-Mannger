
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
import { updateMasterAccount } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const masterChangeSchema = z.object({
    currentUsername: z.string().min(1, "Current username is required."),
    newUsername: z.string().optional(),
    newChatName: z.string().optional(),
    newEmail: z.string().email("Please enter a valid email.").optional().or(z.literal('')),
}).refine(data => data.newUsername || data.newChatName || data.newEmail, {
    message: "At least one new value (username, chat name, or email) must be provided.",
    path: ["newUsername"],
});

type FormValues = z.infer<typeof masterChangeSchema>;

const initialState = {
  type: null,
  message: "",
  details: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Update Account Details
    </Button>
  );
}

export function MasterChangeForm() {
  const [state, formAction] = useActionState(updateMasterAccount, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(masterChangeSchema),
    defaultValues: {
      currentUsername: "",
      newUsername: "",
      newChatName: "",
      newEmail: "",
    },
  });

  useEffect(() => {
    if (state.type) {
      if (state.type === "success") {
        toast({
          title: state.message,
          description: (
              state.details && state.details.length > 0 &&
              <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                  <AccordionTrigger>View Details</AccordionTrigger>
                  <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                      {state.details?.map((detail: string, index: number) => (
                          <li key={index} className="text-sm">{detail}</li>
                      ))}
                      </ul>
                  </AccordionContent>
                  </AccordionItem>
              </Accordion>
          ),
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
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form ref={formRef} action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="currentUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Username</FormLabel>
              <FormControl>
                <Input placeholder="The user's current username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Username (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="The user's new username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newChatName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Chat Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="The user's new chat name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="The user's new email address" {...field} />
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
