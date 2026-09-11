import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsStringLiteral,
  parseAsString,
} from "nuqs/server";

export const priorityEnumValues = ["urgent", "high", "medium", "low", "no-priority"] as const;
export const statusEnumValues = ["backlog", "todo", "in-progress", "in-review", "done"] as const;
export const viewEnumValues = ["board", "list"] as const;

export const issueFiltersParsers = {
  status: parseAsArrayOf(parseAsStringLiteral(statusEnumValues)).withDefault([]),
  priority: parseAsArrayOf(parseAsStringLiteral(priorityEnumValues)).withDefault([]),
  view: parseAsStringLiteral(viewEnumValues).withDefault("board"),
  project: parseAsString.withDefault(""),
};

export const issueFiltersCache = createSearchParamsCache(issueFiltersParsers);