
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
import { createMasterAccount } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const masterAccountSchema = z.object({
  username: z.string().min(1, "A universal username is required."),
  chatName: z.string().min(1, "A universal chat name is required."),
});

type MasterFormValues = z.infer<typeof masterAccountSchema>;

const initialState = {
  type: null,
  message: "",
  details: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Create All Accounts
    </Button>
  );
}

export function CreateMasterAccountForm() {
  const [state, formAction] = useActionState(createMasterAccount, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<MasterFormValues>({
    resolver: zodResolver(masterAccountSchema),
    defaultValues: {
      username: "",
      chatName: "",
    },
  });

  useEffect(() => {
    if (state.type === "success") {
      toast({
        title: state.message,
        description: (
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
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="font-semibold text-foreground mb-2">Universal Details</h3>
            <p className="text-sm text-muted-foreground mb-4">This username and chat name will be used across all account creations where applicable.</p>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Universal Username</FormLabel>
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
                  <FormLabel>Universal Chat Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <SubmitButton />
      </form>
    </Form>
  );
}
