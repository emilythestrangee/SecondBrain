import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  Zap,
  Star,
  TrendingUp,
  PlayCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useGenerateSchedule } from "@/hooks/use-schedule";
import type { ScheduleResult } from "@shared/schema";

export default function SchedulePage() {
  const [timeBudget, setTimeBudget] = useState(90);
  const [energyBudget, setEnergyBudget] = useState(3);
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null);

  const generateSchedule = useGenerateSchedule();

  const getEnergyLabel = (energy: number) => {
    if (energy <= 2) return "Low Energy";
    if (energy === 3) return "Medium Energy";
    if (energy === 4) return "High Energy";
    return "Maximum Energy";
  };

  const getEnergyColor = (energy: number) => {
    if (energy <= 2) return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (energy <= 3) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  };

  const handleSchedule = async () => {
    const result = await generateSchedule.mutateAsync({
      timeBudgetMinutes: timeBudget,
      energyBudget,
    });
    setScheduleResult(result);
  };

  const handleStartSession = () => {
    // TODO: Navigate to focus session with selected tasks
    window.location.href = "/focus";
  };

  const avgEnergy = scheduleResult
    ? scheduleResult.selectedTasks.reduce((sum, t) => sum + t.energyCost, 0) /
      (scheduleResult.selectedTasks.length || 1)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Smart Queue</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered task scheduling using knapsack optimization and greedy heuristics
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Configuration Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule Configuration</h2>
            
            <div className="space-y-6">
              {/* Time Budget */}
              <div className="space-y-3">
                <Label className="text-base">
                  Time Budget: <span className="font-mono font-semibold">{timeBudget}</span> minutes
                </Label>
                <Slider
                  min={15}
                  max={240}
                  step={15}
                  value={[timeBudget]}
                  onValueChange={(vals) => setTimeBudget(vals[0])}
                  data-testid="slider-time-budget"
                />
                <p className="text-xs text-muted-foreground">
                  How much time do you have available?
                </p>
              </div>

              {/* Energy Budget */}
              <div className="space-y-3">
                <Label className="text-base">
                  Energy Level: <span className="font-semibold">{getEnergyLabel(energyBudget)}</span>
                </Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[energyBudget]}
                  onValueChange={(vals) => setEnergyBudget(vals[0])}
                  data-testid="slider-energy-budget"
                />
                <p className="text-xs text-muted-foreground">
                  How much mental/physical energy do you have?
                </p>
              </div>

              <Button
                onClick={handleSchedule}
                className="w-full"
                size="lg"
                disabled={generateSchedule.isPending}
                data-testid="button-generate-schedule"
              >
                {generateSchedule.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Optimal Schedule
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {scheduleResult && (
            <>
              {/* Algorithm Info */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{scheduleResult.explanation}</AlertDescription>
              </Alert>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Total Duration</span>
                  </div>
                  <div className="text-3xl font-bold font-mono">{scheduleResult.totalDuration}</div>
                  <p className="text-xs text-muted-foreground">minutes of {timeBudget}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Avg Energy</span>
                  </div>
                  <div className="text-3xl font-bold font-mono">{avgEnergy.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">out of {energyBudget}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Total Value</span>
                  </div>
                  <div className="text-3xl font-bold font-mono">{scheduleResult.totalValue}</div>
                  <p className="text-xs text-muted-foreground">priority points</p>
                </Card>
              </div>

              {/* Selected Tasks */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    Selected Tasks ({scheduleResult.selectedTasks.length})
                  </h2>
                  {scheduleResult.selectedTasks.length > 0 && (
                    <Button onClick={handleStartSession} data-testid="button-start-focus-session">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Focus Session
                    </Button>
                  )}
                </div>

                {scheduleResult.selectedTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No tasks match your constraints. Try adjusting your time or energy budget.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {scheduleResult.selectedTasks.map((task, index) => (
                      <div key={task.id}>
                        {index > 0 && <Separator className="my-3" />}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-mono text-muted-foreground">
                                #{index + 1}
                              </span>
                              <h3 className="text-base font-medium">{task.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
