import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddStudyPlanner from "./AddStudyPlanner";
import ShowStudyPlans from "./ShowStudyPlans";
const DashBoard = () => {
  return (
    <div className="w-full h-full">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Study Planner</CardTitle>
          <CardDescription>Simple yet modern study planner app.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddStudyPlanner/>
          <ShowStudyPlans/>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashBoard;
