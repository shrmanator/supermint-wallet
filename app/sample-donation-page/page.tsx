"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
      message += " You'll receive your digital gift shortly.";
    }
    alert(message);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Support Our Cause
      </h1>
      <Card className="max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Donation Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wantNFT"
                render={({ field }) => (
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="nft"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="nft" className="flex items-center gap-2">
                        Get Free Digital Gift <Gift className="h-4 w-4" />
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a unique NFT with your donation
                      </p>
                    </div>
                  </div>
                )}
              />
              <Button type="submit" className="w-full">
                Donate
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
