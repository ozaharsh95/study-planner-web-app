import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(10),
  targetTopics: z.string().array(),
});

const payloadSchema = z.object({
  studyPlanId: z.number(),
  values: formSchema,
});

export async function POST(request: NextRequest) {
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
    const createStudySession = await prisma.studySession.create({
      data: {
        title: data?.values?.title,
        studyPlan: {
          connect: {
            id: data?.studyPlanId,
          },
        },
        targetTopics: data?.values?.targetTopics,
      },
    });

    if (!createStudySession) {
      return NextResponse.json(
        { error: "Study session could not created", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, studySession: createStudySession },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    console.error("Error in study session POST request:", err);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
