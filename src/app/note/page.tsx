// src/app/note/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

type FilterType = "all" | "active" | "completed";
type SortType = "newest" | "oldest" | "priority";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map(
        (
          task: Omit<Task, "createdAt" | "updatedAt"> & {
            createdAt: string;
            updatedAt: string;
          }
        ) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        })
      );
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      completed: false,
      priority: newTask.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask({ title: "", description: "", priority: "medium" });
    setIsAddingTask(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    updateTask(id, {
      completed: !tasks.find((t) => t.id === id)?.completed,
    });
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);

      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const TaskForm = ({
    task,
    onSave,
    onCancel,
  }: {
    task?: Task;
    onSave: (data: {
      title: string;
      description: string;
      priority: Task["priority"];
    }) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || ("medium" as Task["priority"]),
    });

    return (
      <div className="bg-white p-4 rounded-lg border-2 border-blue-200 shadow-sm">
        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <textarea
          placeholder="Task description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full p-2 border border-gray-300 rounded-md mb-3 h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex items-center justify-between">
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                priority: e.target.value as Task["priority"],
              }))
            }
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => onSave(formData)}
              disabled={!formData.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-1"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
              </select>

              <button
                onClick={() => setIsAddingTask(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 whitespace-nowrap"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="mb-6">
            <TaskForm
              onSave={(data) => {
                setNewTask(data);
                addTask();
              }}
              onCancel={() => {
                setIsAddingTask(false);
                setNewTask({ title: "", description: "", priority: "medium" });
              }}
            />
          </div>
        )}

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.length}
            </div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.completed).length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tasks.filter((t) => !t.completed).length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-red-600">
              {
                tasks.filter((t) => t.priority === "high" && !t.completed)
                  .length
              }
            </div>
            <div className="text-gray-600">High Priority</div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-500 text-lg">
                {searchTerm ? "No tasks match your search" : "No tasks found"}
              </div>
              {!isAddingTask && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create your first task
                </button>
              )}
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {editingTaskId === task.id ? (
                  <div className="p-4">
                    <TaskForm
                      task={task}
                      onSave={(data) => {
                        updateTask(task.id, data);
                        setEditingTaskId(null);
                      }}
                      onCancel={() => setEditingTaskId(null)}
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-500"
                        }`}
                      >
                        {task.completed && <CheckIcon className="w-4 h-4" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-semibold ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p
                                className={`mt-1 text-sm ${
                                  task.completed
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}{" "}
                                Priority
                              </span>
                              <span className="text-xs text-gray-500">
                                Created {task.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => setEditingTaskId(task.id)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
