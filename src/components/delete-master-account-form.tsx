
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { deleteMasterAccount } from "@/app/actions";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const deleteMasterSchema = z.object({
  username: z.string().min(1, "Username is required."),
  chatName: z.string().min(1, "Chat name is required."),
  email: z.string().email("Please enter a valid email address."),
  confirmation: z.literal("delete", {
    errorMap: () => ({ message: "You must type 'delete' to confirm." }),
  }),
});

type FormValues = z.infer<typeof deleteMasterSchema>;

const initialState = {
  type: null,
  message: "",
  details: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" variant="destructive">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Permanently Delete Account
    </Button>
  );
}

export function DeleteMasterAccountForm() {
  const [state, formAction] = useActionState(deleteMasterAccount, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(deleteMasterSchema),
    defaultValues: {
      username: "",
      chatName: "",
      email: "",
      confirmation: undefined,
    },
  });

  useEffect(() => {
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
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form ref={formRef} action={formAction} className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This is a permanent and irreversible action. All data associated with this user across all platforms will be deleted.
          </AlertDescription>
        </Alert>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username to Delete</FormLabel>
              <FormControl>
                <Input placeholder="e.g. johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chatName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Deletion</FormLabel>
              <FormControl>
                <Input placeholder="Type 'delete' to confirm" {...field} />
              </FormControl>
              <FormDescription>
                To confirm, please type the word <strong>delete</strong> in the box above.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
