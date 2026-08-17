import { createContext } from "react";

export type TaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "error"
  | "paused"
  | "cancelled";

export interface Task {
  id: string;
  name: string;
  progress: number;
  status: TaskStatus;
  data?: unknown;
  result?: unknown;
  error?: string;
}

export type ExecuteTask<T = unknown> = (task: Task, onProgress: (progress: number) => void) => Promise<T>;

interface TaskContextValue {
  tasks: Task[];
  startTask: (name: string, data?: unknown) => void;
  pauseTask: (id: string) => void;
  resumeTask: (id: string) => void;
  cancelTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);