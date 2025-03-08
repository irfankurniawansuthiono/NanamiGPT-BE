import ResponseApi, { ResponseStatus } from "@/utils/CreateResponseApi";
import { deleteAllSession } from "@/utils/Session";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const { id }: { id: string[] } = await request.json();
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
    const { success, message } = await deleteAllSession(id);
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
