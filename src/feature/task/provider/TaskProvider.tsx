import { type ReactNode, useEffect, useState } from "react";

import { type ExecuteTask, type Task, TaskContext } from "../context/TaskContext";

interface TaskProviderProps {
  children: ReactNode;
  executeTask: ExecuteTask;
}

export function TaskProvider({children, executeTask }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const startTask = (name: string, data?: unknown) => {
    const task: Task = {
      id: crypto.randomUUID(),
      name,
      progress: 0,
      status: "pending",
      data,
    };

    setTasks((prev) => [...prev, task]);
  };

  const processQueue = () => {
    const isRunning = tasks.some(
    (task) => task.status === "running"
  );

    if (isRunning) { return }

    const nextTask = tasks.find(
      (task) => task.status === "pending"
    );

    if (!nextTask) { return }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === nextTask.id
          ? {
              ...task,
              status: "running",
            }
          : task
      )
    );

    executeTask(nextTask, (progress) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === nextTask.id
            ? {
                ...task,
                progress,
              }
            : task
        )
      );
    })
      .then((result) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === nextTask.id
              ? {
                  ...task,
                  progress: 100,
                  status: "completed",
                  result,
                }
              : task
          )
        );
      })
      .catch((error) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === nextTask.id
              ? {
                  ...task,
                  status: "error",
                  error: error instanceof Error ? error.message : "Unknown error",
                }
              : task
          )
        );
      });
  };

  const pauseTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "paused",
            }
          : task
      )
    );
  };

  const resumeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "pending",
            }
          : task
      )
    );
  };

  const cancelTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "cancelled",
            }
          : task
      )
    );
  };

  useEffect(() => {
    processQueue();
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        startTask,
        pauseTask,
        resumeTask,
        cancelTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}