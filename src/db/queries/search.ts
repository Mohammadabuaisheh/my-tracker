import { db } from "@/db";
import { sql } from "drizzle-orm";
import type { IssueStatus, IssuePriority } from "@/types/issue";

export interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  rank: number;
}

// Ensure the FTS5 virtual table and sync triggers exist
export async function initFtsTable() {
  await db.run(sql`
    CREATE VIRTUAL TABLE IF NOT EXISTS issues_fts USING fts5(
      id UNINDEXED,
      title,
      description
    );
  `);

  // Sync existing issues into FTS if table was just created
  await db.run(sql`
    INSERT OR IGNORE INTO issues_fts(id, title, description)
    SELECT id, title, COALESCE(description, '') FROM issues
    WHERE id NOT IN (SELECT id FROM issues_fts);
  `);
}

export async function searchIssues(query: string): Promise<SearchResult[]> {
  const sanitized = query.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  if (!sanitized) return [];

  // Match tokenized query with prefix wildcards for real-time autocomplete
  const ftsQuery = `${sanitized}*`;

  try {
    const results = await db.all(sql`
      SELECT 
        i.id, 
        i.title, 
        i.description, 
        i.status, 
        i.priority, 
        bm25(issues_fts) as rank
      FROM issues_fts
      JOIN issues i ON i.id = issues_fts.id
      WHERE issues_fts MATCH ${ftsQuery}
      ORDER BY rank
      LIMIT 10;
    `);

    return results as SearchResult[];
  } catch {
    // Fallback to substring matching if FTS expression is invalid
    const fallback = await db.all(sql`
      SELECT id, title, description, status, priority, 0 as rank
      FROM issues
      WHERE title LIKE ${`%${sanitized}%`} OR description LIKE ${`%${sanitized}%`}
      LIMIT 10;
    `);

    return fallback as SearchResult[];
  }
}