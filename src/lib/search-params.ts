import {
  createSearchParamsCache,
  parseAsString,
  parseAsArrayOf,
  parseAsStringEnum,
} from "nuqs/server";

export const statusEnumValues = [
  "backlog",
  "todo",
  "in-progress",
  "in-review",
  "done",
] as const;

export const priorityEnumValues = [
  "no-priority",
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const viewEnumValues = ["board", "list"] as const;

export const issueFiltersParsers = {
  view: parseAsStringEnum([...viewEnumValues]).withDefault("board"),
  search: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum([...statusEnumValues])).withDefault([]),
  priority: parseAsArrayOf(parseAsStringEnum([...priorityEnumValues])).withDefault([]),
  sortBy: parseAsStringEnum(["position", "createdAt", "priority"]).withDefault("position"),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
};

export const issueFiltersCache = createSearchParamsCache(issueFiltersParsers);