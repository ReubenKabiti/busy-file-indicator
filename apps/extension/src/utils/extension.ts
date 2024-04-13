import axios from "axios";
import { BASE_API_URL } from "../constants/key";

/**
 * Sync extension data with the server, once data posted, returns the files for that workspace synced with server files
 * @param workspaceId - The workspace id
 * @param localData - The local data to sync
 */
export async function syncExtension(workspaceId: string, localData: string) {
  const body = {
    workspace: workspaceId,
  };

  try {
    const response = await fetch(`${BASE_API_URL}/sync`, {
      method: "POST",
      body: localData,
    });
    // TODO: response should include files for that workspace. each file has a owner, if mark as busy, owner is the user id(github-email), if mark as idle, owner is empty
    return { files: "", success: response.status === 200 };
  } catch (error) {
    console.error("Error syncing extension:", error);
    return { files: "", success: false };
  }
}
