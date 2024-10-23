"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift } from "lucide-react";

const donationFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  wantNFT: z.boolean().default(false),
});

export default function DonationPage() {
  const form = useForm<z.infer<typeof donationFormSchema>>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "",
      email: "",
      wantNFT: false,
    },
  });

  function onSubmit(values: z.infer<typeof donationFormSchema>) {
    console.log("Form submitted:", values);
    let message = `Thank you for your donation of $${values.amount}. A confirmation has been sent to ${values.email}!`;
    if (values.wantNFT) {
      message += " You'll receive your exclusive NFT shortly.";
    }
    alert(message);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6 text-white">
        Support Our Cause
      </h1>
      <Card className="w-full max-w-md mx-auto bg-card border-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="text-sm font-medium">
                      Donation Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        {...field}
                        className="bg-background placeholder:text-muted-foreground/50"
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        className="bg-background placeholder:text-muted-foreground/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wantNFT"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                        <span>Get Free Digital Gift</span>
                        <Gift className="h-4 w-4" />
                      </FormLabel>
                      <FormDescription className="text-blue-400/70 text-xs">
                        Receive a unique NFT with your donation
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 mt-4"
              >
                Donate
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
