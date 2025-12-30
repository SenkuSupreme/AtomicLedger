"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Filter, 
  Search, 
  CheckSquare, 
  Clock, 
  Target,
  Globe,
  Database,
  Cpu,
  Shield,
  Zap,
  Activity,
  Layers
} from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import TaskForm from "@/components/TaskForm";
import { ITask } from "@/lib/models/Task";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function TasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Partial<ITask>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setShowTaskForm(false);
        toast.success("Task created successfully");
      } else {
        toast.error("Failed to create task");
      }
    } catch (error) {
      toast.error("Error creating task");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<ITask>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(
          tasks.map((task) => (task._id === taskId ? updatedTask : task))
        );
        setEditingTask(undefined);
        setShowTaskForm(false);
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Synchronizing Action Mesh...
      </div>
    );
  }

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-sky-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Action Node 08 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Cpu size={10} className="text-blue-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Operational Mesh: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Action Terminal
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "High-frequency operational workflow management. Execute tactical protocols and synchronize mission-critical tasks within the institutional board."
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => setShowTaskForm(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Protocol</span>
          </button>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
        {[
          { icon: <Target size={18} />, label: "Total Nodes", value: stats.total, color: "blue" },
          { icon: <Clock size={18} />, label: "Pending Sync", value: stats.todo, color: "gray" },
          { icon: <Activity size={18} />, label: "In Progress", value: stats.inProgress, color: "sky" },
          { icon: <CheckSquare size={18} />, label: "Finalized", value: stats.done, color: "emerald" },
          { icon: <Layers size={18} />, label: "High Priority", value: stats.highPriority, color: "red" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="p-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white/40 group-hover:bg-white group-hover:text-black transition-all">
                   {stat.icon}
                </div>
                <span className={`text-2xl font-black italic transition-colors ${stat.color === "red" ? "text-red-400" : "text-white/80 group-hover:text-white"}`}>{stat.value}</span>
             </div>
             <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-tight">
                {stat.label}
             </div>
          </div>
        ))}
      </div>

      {/* Institutional Filter Mesh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Scan signals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white placeholder:text-white/10 text-[11px] font-black uppercase tracking-[0.3em] focus:border-blue-500/30 focus:outline-none focus:bg-white/[0.04] transition-all backdrop-blur-md shadow-inner italic"
          />
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-blue-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
        >
          <option value="all">All Priorities</option>
          <option value="high">Critical Level</option>
          <option value="medium">Standard Level</option>
          <option value="low">Low Intensity</option>
        </select>
      </div>

      {/* Kanban Board Mesh */}
      <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[4rem] p-12 min-h-[600px] relative z-10 shadow-3xl hover:bg-[#0A0A0A]/60 transition-all duration-1000 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Execution Board
              </h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mt-2 italic">
                Drag & Drop Protocol Management
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
               <span className="text-[10px] font-black text-blue-500/40 uppercase tracking-widest italic">Neural Link Active</span>
            </div>
          </div>

          <KanbanBoard
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={() => setShowTaskForm(true)}
          />
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={
            editingTask
              ? (updates) => handleUpdateTask(editingTask._id!, updates)
              : handleCreateTask
          }
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
}
