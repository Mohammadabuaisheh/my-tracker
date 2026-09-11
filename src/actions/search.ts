"use server";

import { searchIssues, initFtsTable, type SearchResult } from "@/db/queries/search";

export async function executeSearch(query: string): Promise<SearchResult[]> {
  try {
    await initFtsTable();
    return await searchIssues(query);
  } catch (error) {
    console.error("Search action failed:", error);
    return [];
  }
}