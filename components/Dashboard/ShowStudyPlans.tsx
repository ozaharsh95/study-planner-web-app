"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { StudyPlan } from "@prisma/client";
import { Badge } from "../ui/badge";
import { formatDateFxn } from "@/lib/dateFormats";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import AddStudySession from "./AddStudySession";
import { useToast } from "@/hooks/use-toast";

const ShowStudyPlans = () => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const { toast } = useToast();

  const fetchStudyPlans = async () => {
    try {
      const res = await fetch("/api/showStudyPlan");
      if (res.status == 200) {
        const data = await res.json();
        setStudyPlans(data?.studyPlans);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const deleteStudyPlan = async (id: number) => {
    try {
      const res = await fetch("/api/deleteStudyPlan", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.status === 200) {
        toast({
          title: "Successfully Deleted Study Plan ✅",
        });
      } else {
        toast({
          title: "failed to Delete Study Plan ",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error occur to delete study plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-10">
      <div>
        <CardTitle>View All Study Plans</CardTitle>
        <CardDescription>
          All created study plans are diplsyed below.
        </CardDescription>
      </div>
      <div className="my-8 px-4 flex flex-col gap-4">
        {studyPlans && 
          (studyPlans.length > 0 &&
            studyPlans.map((studyPlan) => (
              <Card key={studyPlan?.id}>
                <CardHeader>
                  <CardTitle>{studyPlan.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    {studyPlan.topicTags.map((tag) => (
                      <Badge variant="outline" key={tag}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <h1>Due Date : {formatDateFxn(studyPlan?.expectedTime)}</h1>
                  </div>
                  <div className="flex gap-2 items-center justify-start">
                    <AddStudySession studyPlan={studyPlan} />
                    <div className="flex items-center rounded-lg bg-primary text-sm px-3 py-2  h-10 transition-all duration-150 ease-[cubic-bezier(0.4,_0,_0.2,_1)]  hover:bg-primary/90">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Trash2 color="white" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure to delete ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your study plan and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteStudyPlan(studyPlan?.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )))}
      </div>
    </div>
  );
};

export default ShowStudyPlans;
