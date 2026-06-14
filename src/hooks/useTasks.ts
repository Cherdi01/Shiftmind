import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { initialTasks } from "../data/defaults";
import { loadShiftMindData, saveTasks } from "../services/storage";
import { DayTask } from "../types";

export function useTasks(loaded: boolean) {
  const [tasks, setTasks] = useState<DayTask[]>(initialTasks);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => { if (data.tasks) setTasks(data.tasks); })
      .catch(() => Alert.alert("Speicherfehler", "Aufgaben konnten nicht geladen werden."))
      .finally(() => setTasksLoaded(true));
  }, []);

  useEffect(() => { if (loaded && tasksLoaded) saveTasks(tasks); }, [tasks, loaded, tasksLoaded]);

  function addTask(day: number, text: string) {
    const task: DayTask = {
      id: String(Date.now()),
      day,
      text,
      done: false,
    };
    setTasks((prev) => [...prev, task]);
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function resetTasks() {
    setTasks(initialTasks);
  }

  return { tasks, addTask, toggleTask, deleteTask, resetTasks };
}
