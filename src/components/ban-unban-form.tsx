
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import { banAccount, unbanAccount } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

const banUnbanSchema = z.object({
  username: z.string().min(1, "Username is required."),
  chatName: z.string().min(1, "Chat name is required."),
});

type FormValues = z.infer<typeof banUnbanSchema>;

const initialState = {
  type: null,
  message: "",
  details: [],
};

function SubmitButton({ actionType, isProcessing }: { actionType: 'ban' | 'unban', isProcessing: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isProcessing;
  const buttonText = actionType === 'ban' ? 'Ban Account' : 'Unban Account';
  const buttonVariant = actionType === 'ban' ? 'destructive' : 'default';

  return (
    <Button type="submit" disabled={isDisabled} className="w-full" variant={buttonVariant}>
      {isDisabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending && actionType === 'ban' ? 'Processing Ban...' : buttonText}
    </Button>
  );
}

export function BanUnbanForm({ actionType }: { actionType: 'ban' | 'unban' }) {
  const [state, formAction] = useActionState(actionType === 'ban' ? banAccount : unbanAccount, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(banUnbanSchema),
    defaultValues: {
      username: "",
      chatName: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    if (isSubmitting && actionType === 'ban') {
      setIsProcessing(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitting, actionType]);

  useEffect(() => {
    if (state.type) {
      setIsProcessing(false);
      setProgress(100);
    }

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
      <form ref={formRef} action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
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
        {isProcessing && actionType === 'ban' && (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">Processing... please wait 10 seconds.</p>
                <Progress value={progress} className="w-full" />
            </div>
        )}
        <SubmitButton actionType={actionType} isProcessing={isProcessing} />
      </form>
    </Form>
  );
}
