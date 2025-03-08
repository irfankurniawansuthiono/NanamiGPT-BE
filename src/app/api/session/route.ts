import ResponseApi, { ResponseStatus } from "@/utils/CreateResponseApi";
import { checkSession, deleteSession, updateSession } from "@/utils/Session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const token = request.headers.get("authorization");
  if (!token || token !== process.env.SESSION_TOKEN) {
    return ResponseApi(
      false,
      ResponseStatus.UNAUTHORIZED,
      "UNAUTHORIZED",
      null
    );
  }
  if (!id) {
    return ResponseApi(
      false,
      ResponseStatus.BAD_REQUEST,
      "BAD REQUEST (id is missing)",
      null
    );
  }
  try {
    const data = await checkSession(id);
    if (data) {
      return ResponseApi(true, ResponseStatus.OK, "Session found", data.data);
    }
    return ResponseApi(
      false,
      ResponseStatus.INTERNAL_SERVER_ERROR,
      "INTERNAL SERVER ERROR",
      null
    );
  } catch (error: any) {
    console.error("Error checking session:", error);
    return ResponseApi(
      false,
      ResponseStatus.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization");
  if (!token || token !== process.env.SESSION_TOKEN) {
    return ResponseApi(
      false,
      ResponseStatus.UNAUTHORIZED,
      "UNAUTHORIZED",
      null
    );
  }
  const { message, reply, id, timestamp } = await request.json();
  if (!id) {
    return ResponseApi(false, ResponseStatus.BAD_REQUEST, "BAD REQUEST", null);
  }
  try {
    const data = await updateSession(id, { message, reply, timestamp });
    if (data) {
      return ResponseApi(true, ResponseStatus.OK, "Session found", data.data);
    }
    return ResponseApi(
      false,
      ResponseStatus.INTERNAL_SERVER_ERROR,
      "INTERNAL SERVER ERROR",
      null
    );
  } catch (error: any) {
    console.error("Error checking session:", error);
    return ResponseApi(
      false,
      ResponseStatus.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get("authorization");
  if (!token || token !== process.env.SESSION_TOKEN) {
    return ResponseApi(
      false,
      ResponseStatus.UNAUTHORIZED,
      "UNAUTHORIZED",
      null
    );
  }
  const { id } = await request.json();
  try {
    const { success, message } = await deleteSession(id);
    if (success) {
      return ResponseApi(true, ResponseStatus.OK, message, null);
    } else {
      throw new Error(message);
    }
  } catch (error: any) {
    console.error(error.message);
    return ResponseApi(
      false,
      ResponseStatus.INTERNAL_SERVER_ERROR,
      "something went wrong while delete session",
      null
    );
  }
}
