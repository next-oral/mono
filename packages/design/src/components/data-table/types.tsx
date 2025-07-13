import type { LucideIcon } from "lucide-react";

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  labels?: IssueLabel[];
  assignee?: User;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
}

export interface User {
  id: string;
  name: string;
  picture: string;
}

export interface IssueLabel {
  id: string;
  name: string;
  color: string;
}

export interface IssueStatus {
  id: "backlog" | "todo" | "in-progress" | "done";
  name: string;
  order: number;
  icon: LucideIcon;
}
