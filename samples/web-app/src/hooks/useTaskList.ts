import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createTask,
  deleteTaskById,
  subscribeToTasks,
  toggleTaskDone,
  type CreateTaskInput,
  type TaskWithId,
} from "../lib/taskAdapter";

interface UseTaskListResult {
  tasks: TaskWithId[];
  loading: boolean;
  error: string | null;
  mutationError: string | null;
  actionTaskId: string | null;
  create: (input: CreateTaskInput) => Promise<void>;
  toggle: (task: TaskWithId) => Promise<void>;
  remove: (taskId: string) => Promise<void>;
}

export function useTaskList(): UseTaskListResult {
  const [tasks, setTasks] = useState<TaskWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTasks(
      (nextTasks) => {
        setTasks(nextTasks);
        setLoading(false);
        setError(null);
      },
      (nextError) => {
        setLoading(false);
        setError(nextError.message);
      },
    );

    return unsubscribe;
  }, []);

  const create = useCallback(async (input: CreateTaskInput) => {
    setMutationError(null);

    try {
      await createTask(input);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Failed to create task";
      setMutationError(message);
      throw nextError;
    }
  }, []);

  const toggle = useCallback(async (task: TaskWithId) => {
    setMutationError(null);
    setActionTaskId(task.id);

    try {
      await toggleTaskDone(task);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Failed to update task";
      setMutationError(message);
      throw nextError;
    } finally {
      setActionTaskId(null);
    }
  }, []);

  const remove = useCallback(async (taskId: string) => {
    setMutationError(null);
    setActionTaskId(taskId);

    try {
      await deleteTaskById(taskId);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Failed to delete task";
      setMutationError(message);
      throw nextError;
    } finally {
      setActionTaskId(null);
    }
  }, []);

  return useMemo(
    () => ({
      tasks,
      loading,
      error,
      mutationError,
      actionTaskId,
      create,
      toggle,
      remove,
    }),
    [
      tasks,
      loading,
      error,
      mutationError,
      actionTaskId,
      create,
      toggle,
      remove,
    ],
  );
}
