import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const getStudyPlan = await prisma.studyPlan.findUnique({
      where: {
        id: Number(id),
      },
    });

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
