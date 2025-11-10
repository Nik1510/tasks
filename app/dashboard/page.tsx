"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Select Priority");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  

  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("api/users/dashboard");
      setTasks(res.data.tasks || []);
    } catch (error: any) {
      console.log("Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log("Error while logout", error.message);
      toast.error(error.message || "Logout failed", {
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (task.trim().length === 0) {
      toast.error("Please enter a valid task");
      return;
    }
    if (priority === "Select Priority") {
      toast.error("Please select a priority");
      return;
    }
    try {
      const response = await axios.post("api/users/dashboard", {
        title: task,
        priority,
      });
      toast.success("Task added successfully");
      setTask("");
      setPriority("Select Priority");
      setTasks((prev) => [response.data.task, ...prev]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error while adding tasks");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put("/api/users/dashboard", {
        taskId: id,
        status: newStatus,
      });
      toast.success("Task updated!");
      fetchTasks();
    } catch (error: any) {
      toast.error("Error updating task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/users/dashboard?taskId=${id}`);
      toast.success("Task deleted successfully");
      setTasks(tasks.filter((t: any) => t._id !== id));
    } catch (error: any) {
      toast.error("Error while deleting the task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "badge-success";
      case "in progress":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 to-base-300">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            ✓ TaskFlow
          </a>
        </div>

        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-xl border border-base-300"
            >
              <li>
                <a className="hover:bg-primary hover:text-primary-content transition-colors">
                  Profile
                </a>
              </li>
              <li>
                <a className="hover:bg-primary hover:text-primary-content transition-colors">
                  Settings
                </a>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="text-error hover:bg-error hover:text-error-content transition-colors"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="card bg-base-100 shadow-xl mb-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Add New Task</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                id="add-tasks"
                placeholder="What needs to be done?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                className="input input-bordered input-primary flex-1"
              />

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-outline btn-primary min-w-[140px]"
                >
                  {priority}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-lg border border-base-300"
                >
                  {["High", "Medium", "Low"].map((p) => (
                    <li key={p}>
                      <a
                        onClick={() => setPriority(p)}
                        className="hover:bg-primary hover:text-primary-content transition-colors"
                      >
                        <span className={`badge ${getPriorityColor(p)} badge-sm`}></span>
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleAddTask}
                className="btn btn-primary shadow-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">My Tasks</h2>
          <div className="badge badge-primary badge-lg">
            {tasks.length} tasks
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center py-20">
              <h3 className="text-2xl font-bold text-base-content/70">
                No tasks yet
              </h3>
              <p className="text-base-content/50">
                Add your first task to get started!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((t: any) => (
              <div
                key={t._id}
                className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-2">
                      <h3 className="card-title text-lg flex-1 wrap-break-word">
                        {t.title}
                      </h3>

                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-xs btn-circle hover:bg-base-200"
                      >
                        ⋮
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-48 p-2 shadow-lg border border-base-300"
                      >
                        <li>
                          <a
                            onClick={() =>
                              handleUpdateStatus(
                                t._id,
                                t.status === "completed"
                                  ? "pending"
                                  : "completed"
                              )
                            }
                            className="hover:bg-success hover:text-success-content transition-colors"
                          >
                            {t.status === "completed"
                              ? "Mark Pending"
                              : "Mark Complete"}
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => handleDeleteTask(t._id)}
                            className="hover:bg-error hover:text-error-content transition-colors"
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className={`badge ${getPriorityColor(t.priority)} gap-1`}>
                      {t.priority}
                    </div>
                    <div className={`badge ${getStatusColor(t.status)} gap-1`}>
                      {t.status || "pending"}
                    </div>
                  </div>

                  {t.createdAt && (
                    <p className="text-xs text-base-content/50 mt-2">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
