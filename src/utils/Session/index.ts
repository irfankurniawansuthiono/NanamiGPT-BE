"use server";
import fs from "fs";
import path from "path";
import Response from "../CreateResponse";

export const checkSession = async (id: string) => {
  try {
    const filePath = path.join(process.cwd(), "src", "database", `${id}.json`);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return Response(true, "New session created", []);
    }

    const data = fs.readFileSync(filePath, "utf-8");

    if (!data.trim()) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return Response(true, "Session reinitialized", []);
    }

    try {
      const sessions = JSON.parse(data);

      if (!Array.isArray(sessions)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return Response(true, "Session reset to array", []);
      }

      return Response(
        true,
        "Session found",
        sessions as { message: string; reply: string }[]
      );
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      fs.writeFileSync(filePath, JSON.stringify([]));
      return Response(true, "Session reset due to invalid data", []);
    }
  } catch (error: any) {
    console.error("File operation error:", error.message);
    return Response(false, error.message, null);
  }
};

export const updateSession = async (
  id: string,
  data: { message: string; reply: string; timestamp: string }
) => {
  try {
    const filePath = path.join(process.cwd(), "src", "database", `${id}.json`);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    const dataJSON = fs.readFileSync(filePath, "utf-8");

    if (!dataJSON.trim()) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return Response(true, "Session reinitialized", []);
    }

    try {
      const sessions = JSON.parse(dataJSON);

      if (!Array.isArray(sessions)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return Response(true, "Session reset to array", []);
      }

      sessions.push(data);

      fs.writeFileSync(filePath, JSON.stringify(sessions));

      return Response(true, "Session updated", sessions);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      fs.writeFileSync(filePath, JSON.stringify([]));
      return Response(true, "Session reset due to invalid data", []);
    }
  } catch (error: any) {
    console.error("File operation error:", error.message);
    return Response(false, error.message, null);
  }
};

export const deleteSession = async (id: string) => {
  try {
    const filePath = path.join(process.cwd(), "src", "database", `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return Response(true, "Session deleted successfully", null);
    } else {
      return Response(false, "Session file not found", null);
    }
  } catch (error: any) {
    console.error("File operation error:", error.message);
    return Response(false, error.message, null);
  }
};

// delete All Session
export const deleteAllSession = async (id: string[]) => {
  try {
    id.forEach((sessionId) => {
      const filePath = path.join(
        process.cwd(),
        "src",
        "database",
        `${sessionId}.json`
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    return Response(true, "All session deleted successfully", null);
  } catch (error: any) {
    console.error("File operation error:", error.message);
    return Response(false, error.message, null);
  }
};
