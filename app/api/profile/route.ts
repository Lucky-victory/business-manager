import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { IS_DEV } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, authSession.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", data: null, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const {
      id,
      name,
      email,
      image,
      username,
      displayUsername,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      role,
      currencyCode,
      currencySymbol,
      currencyName,
    } = user;

    return NextResponse.json(
      {
        data: {
          id,
          name,
          email,
          image,
          username,
          displayUsername,
          companyName,
          companyAddress,
          companyPhone,
          companyEmail,
          role,
          currencyCode,
          currencySymbol,
          currencyName,
        },
        message: "Profile fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch profile",
        message: IS_DEV ? error?.message : "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      username,
      displayUsername,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      currencyCode,
      currencySymbol,
      currencyName,
      image,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedUser = await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          name,
          username,
          displayUsername,
          companyName,
          companyAddress,
          companyPhone,
          companyEmail,
          image,
          currencyCode,
          currencySymbol,
          currencyName,
          updatedAt: new Date(),
        })
        .where(eq(users.id, authSession.user.id));

      return await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, authSession.user.id),
      });
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found", data: null, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const {
      id,
      name: updatedName,
      email,
      image: updatedImage,
      username: updatedUsername,
      displayUsername: updatedDisplayUsername,
      companyName: updatedCompanyName,
      companyAddress: updatedCompanyAddress,
      companyPhone: updatedCompanyPhone,
      companyEmail: updatedCompanyEmail,
      role,
    } = updatedUser;

    return NextResponse.json(
      {
        data: {
          id,
          name: updatedName,
          email,
          image: updatedImage,
          username: updatedUsername,
          displayUsername: updatedDisplayUsername,
          companyName: updatedCompanyName,
          companyAddress: updatedCompanyAddress,
          companyPhone: updatedCompanyPhone,
          companyEmail: updatedCompanyEmail,
          role,
        },
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update profile",
        message: IS_DEV ? error?.message : "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
