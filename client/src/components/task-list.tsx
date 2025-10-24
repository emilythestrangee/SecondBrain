import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  Zap,
  Star,
  MoreVertical,
  Network,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/task-dialog";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import type { Task } from "@shared/schema";

interface TaskListProps {
  filter: "all" | "active" | "completed";
  searchQuery: string;
}

export function TaskList({ filter, searchQuery }: TaskListProps) {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!tasks) {
    return null;
  }

  // Filter tasks
  let filteredTasks = tasks;
  
  if (filter === "active") {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed);
  }

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.notes?.toLowerCase().includes(query)
    );
  }

  const getEnergyColor = (energy: number) => {
    if (energy <= 2) return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (energy <= 3) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  };

  const handleToggleComplete = async (task: Task) => {
    await updateTask.mutateAsync({
      id: task.id,
      data: { completed: !task.completed },
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync(taskId);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {searchQuery
            ? "Try adjusting your search query"
            : "Create your first task to get started with intelligent task management"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`p-4 hover-elevate ${task.completed ? 'opacity-60' : ''}`}
            data-testid={`card-task-${task.id}`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleComplete(task)}
                className="mt-1"
                disabled={updateTask.isPending}
                data-testid={`checkbox-task-${task.id}`}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-medium mb-1 ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </h3>
                {task.notes && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {task.notes}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-2">
                  {task.dueDate && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {task.durationMinutes}m
                  </Badge>
                  <Badge variant="outline" className={`gap-1 ${getEnergyColor(task.energyCost)}`}>
                    <Zap className="w-3 h-3" />
                    Energy {task.energyCost}/5
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Star className="w-3 h-3" />
                    Value {task.value}
                  </Badge>
                  {task.dependsOn.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Network className="w-3 h-3" />
                      {task.dependsOn.length} deps
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    data-testid={`button-task-menu-${task.id}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(task)} data-testid={`button-edit-task-${task.id}`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(task.id)}
                    data-testid={`button-delete-task-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask || undefined}
      />
    </>
  );
}
