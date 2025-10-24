import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskList } from "@/components/task-list";
import { TaskDialog } from "@/components/task-dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type FilterType = "all" | "active" | "completed";

export default function TasksPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your intelligent task system
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            data-testid="button-add-task"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="px-6 pb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-tasks"
            />
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1" data-testid="tab-all">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1" data-testid="tab-active">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1" data-testid="tab-completed">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <TaskList filter={filter} searchQuery={searchQuery} />
        </div>
      </div>

      {/* Add Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
