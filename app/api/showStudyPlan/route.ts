import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const getStudyPlan = await prisma.studyPlan.findMany();

    if (!getStudyPlan) {
      return NextResponse.json(
        { error: "StudyPlan could not fetched", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, studyPlans: getStudyPlan },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    console.error("Error in GET request:", err);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
