"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StudyPlan } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { LoaderCircle, SquarePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const formSchema = z.object({
  title: z.string().min(5),
  targetTopics: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const AddStudySession = ({ studyPlan }: { studyPlan: StudyPlan }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const targetTopics = studyPlan.topicTags.map((tag) => {
    let upperStr = tag.toUpperCase(); // Call toUpperCase directly on the string
    return { id: tag, label: upperStr };
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetTopics: [],
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const payload = {
      values,
      studyPlanId: studyPlan?.id,
    };
    try {
      const res = await fetch("/api/addStudySession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.log("not submitted");
        toast({
          title: "Failure to add study session",
          variant: "destructive",
        });
      } else {
        const data = await res.json();
        toast({
          title: "Study Session started ",
          description: `"${data?.studySession?.title||"test"}" added successfully ...`,
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error occur to start study session",
        variant: "destructive",
      });
    } finally {
      form.reset();
      setIsOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="flex gap-2 items-center">
            <SquarePlus />
            Session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Study Session</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetTopics"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Targeted Topics
                      </FormLabel>
                      <FormDescription>
                        Select the topics you want to cover in this session.
                      </FormDescription>
                    </div>
                    {targetTopics.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="targetTopics"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <p>Submit</p>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddStudySession;
