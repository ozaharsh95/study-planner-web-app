import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(10),
  complitionDate: z.string(),
  tags: z.string().array(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = formSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    const data = parsedBody.data;
    console.log(data);

    const createStudyPlan = await prisma.studyPlan.create({
      data: {
        title: data.title,
        expectedTime: data.complitionDate,
        topicTags: data.tags,
      },
    });

    if (!createStudyPlan) {
      return NextResponse.json(
        { error: "StudyPlan could not created", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, studyPlan: createStudyPlan },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    console.error("Error in POST request:", err);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
