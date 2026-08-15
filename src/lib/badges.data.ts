import { documentsList, leaveHistory } from "@/data/modules";

export type BadgeCounts = { pendingLeaves: number; unreadDocuments: number };

/** Stands in for the backend counts endpoint until Cloud is enabled. */
export async function fetchBadgeCounts(): Promise<BadgeCounts> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    pendingLeaves: leaveHistory.filter((r) => r.status === "Pending").length,
    unreadDocuments: documentsList.filter((d) => d.status !== "Valid").length,
  };
}
