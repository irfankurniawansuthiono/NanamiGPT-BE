import { ChatSessionType } from "@/types";
import { NextResponse } from "next/server";

export enum ResponseStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export type ResponseDataAPIType = {
  success: boolean;
  status: ResponseStatus;
  message: string;
  data: ChatSessionType[] | string | null;
};

export default function ResponseApi(
  success: boolean,
  status: ResponseStatus,
  message: string,
  data: any | null,
  headers?: Record<string, string>
) {
  const responseData: ResponseDataAPIType = {
    success,
    status,
    message,
    data,
  };

  return NextResponse.json(responseData, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });
}
