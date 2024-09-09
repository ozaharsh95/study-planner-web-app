import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, statusText: "invalid request body" },
        { status: 412 }
      );
    }
    const resDeleteStudyPlan = await prisma.studyPlan.delete({
      where: {
        id,
      },
    });

    if (!resDeleteStudyPlan) {
      return NextResponse.json(
        { success: false, statusText: "studyplan is not deleted ..!!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, statusText: "studyplan deleted successfully..!!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    console.error("Error in DELETE studyplan request:", err);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
