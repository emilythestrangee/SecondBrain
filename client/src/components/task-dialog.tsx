import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type Task } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useEffect } from "react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const form = useForm({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      notes: "",
      dueDate: null as Date | null,
      durationMinutes: 30,
      energyCost: 3,
      value: 50,
      dependsOn: [] as string[],
      completed: false,
    },
  });

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        notes: task.notes || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        durationMinutes: task.durationMinutes,
        energyCost: task.energyCost,
        value: task.value,
        dependsOn: task.dependsOn,
        completed: task.completed,
      });
    } else {
      form.reset({
        title: "",
        notes: "",
        dueDate: null,
        durationMinutes: 30,
        energyCost: 3,
        value: 50,
        dependsOn: [],
        completed: false,
      });
    }
  }, [task, form]);

  const onSubmit = async (data: any) => {
    try {
      if (task) {
        await updateTask.mutateAsync({
          id: task.id,
          data,
        });
      } else {
        await createTask.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            Configure task properties for intelligent scheduling and dependency tracking
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Implement encryption feature"
                      {...field}
                      data-testid="input-task-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details, requirements, or context..."
                      className="resize-none min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-task-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                          data-testid="button-select-due-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Optional deadline for this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration: {field.value} minutes</FormLabel>
                  <FormControl>
                    <Slider
                      min={5}
                      max={240}
                      step={5}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      data-testid="slider-duration"
                    />
                  </FormControl>
                  <FormDescription>
                    How long you expect this task to take
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Energy Cost */}
            <FormField
              control={form.control}
              name="energyCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Cost: {field.value}/5</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      data-testid="slider-energy"
                    />
                  </FormControl>
                  <FormDescription>
                    Mental/physical energy required (1=low, 5=high)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value/Priority */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Value: {field.value}/100</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      data-testid="slider-value"
                    />
                  </FormControl>
                  <FormDescription>
                    Importance/value score for scheduling optimization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-save-task">
                {isPending ? "Saving..." : task ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
