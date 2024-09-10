import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(10),
  targetTopics: z.string().array(),
});

const payloadSchema = z.object({
  studyPlanId: z.number(),
  values: formSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = payloadSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    const data = parsedBody.data;

    const newStudySession = await prisma.studySession.create({
      data: {
        title: data?.values?.title,
        targetTopics: data?.values?.targetTopics,
        studyPlan: {
          connect: { id: data?.studyPlanId },
        },
      },
    });

    if (!newStudySession) {
      return NextResponse.json(
        { error: "StudySession could not created", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, studySession: newStudySession },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    console.error("Error in POST request of addStudySession:", err);
    return NextResponse.json(
      { error: "Internal Server Error at addStudySession", success: false },
      { status: 500 }
    );
  }
}
