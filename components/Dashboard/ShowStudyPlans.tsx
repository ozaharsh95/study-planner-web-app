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

import { StudyPlan } from "@prisma/client";
import { Badge } from "../ui/badge";
import { formatDateFxn } from "@/lib/dateFormats";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";
import { Trash2 } from "lucide-react";
import AddStudySession from "./AddStudySession";

const ShowStudyPlans = () => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

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
  return (
    <div className="my-10">
      <div>
        <CardTitle>View All Study Plans</CardTitle>
        <CardDescription>
          All created study plans are diplsyed below.
        </CardDescription>
      </div>
      <div className="my-8 px-4 flex flex-col gap-4">
        {studyPlans && studyPlans.length === 0 && (
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no Study Plans
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start as soon as you add a study plan.
              </p>
            </div>
          </div>
        )}
        {studyPlans &&
          studyPlans.length > 0 &&
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
                <div className="flex gap-2">
                  <AddStudySession studyPlan={studyPlan} />
                  <Button variant={"destructive"}>
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ShowStudyPlans;
