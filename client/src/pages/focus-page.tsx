import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  SkipForward,
  StopCircle,
  Coffee,
  Eye,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [breakType, setBreakType] = useState<"breathing" | "eye" | "device">("breathing");

  const mockTasks = [
    { id: "1", title: "Implement greedy scheduler", duration: 45 },
    { id: "2", title: "Design dependency graph visualization", duration: 45 },
  ];

  const currentTask = mockTasks[currentTaskIndex];
  const totalTasks = mockTasks.length;
  const currentTaskDuration = currentTask?.duration || 0;
  const currentTaskSeconds = currentTaskDuration * 60;
  const progress = (elapsedSeconds / currentTaskSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          
          // Check for break suggestions every 20 minutes
          if (next > 0 && next % (20 * 60) === 0) {
            handleBreakSuggestion();
          }
          
          // Auto-complete task
          if (next >= currentTaskSeconds) {
            handleTaskComplete();
            return 0;
          }
          
          return next;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, currentTaskSeconds]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setCurrentTaskIndex(0);
  };

  const handleSkip = () => {
    if (currentTaskIndex < totalTasks - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setElapsedSeconds(0);
    } else {
      handleStop();
    }
  };

  const handleTaskComplete = () => {
    if (currentTaskIndex < totalTasks - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setElapsedSeconds(0);
    } else {
      setIsActive(false);
    }
  };

  const handleBreakSuggestion = () => {
    const breaks = ["breathing", "eye", "device"] as const;
    setBreakType(breaks[Math.floor(Math.random() * breaks.length)]);
    setShowBreakDialog(true);
    setIsPaused(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const breakSuggestions = {
    breathing: {
      icon: Coffee,
      title: "5-Second Breathing Exercise",
      description: "Take a deep breath in for 5 seconds, hold for 5, exhale for 5. Repeat 3 times.",
    },
    eye: {
      icon: Eye,
      title: "20-20-20 Eye Break",
      description: "Look at something 20 feet away for 20 seconds to reduce eye strain.",
    },
    device: {
      icon: Lock,
      title: "Device Lock Reminder",
      description: "Lock your device and take a 5-minute break to stretch and move around.",
    },
  };

  const breakInfo = breakSuggestions[breakType];
  const BreakIcon = breakInfo.icon;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b p-6">
        <h1 className="text-2xl font-semibold mb-1">Focus Session</h1>
        <p className="text-sm text-muted-foreground">
          Pomodoro-style sessions with telemetry tracking and break suggestions
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Main Timer Card */}
          <Card className="p-8 text-center">
            {!isActive ? (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Ready to Focus?</h2>
                  <p className="text-muted-foreground">
                    Start your focus session with {totalTasks} tasks
                  </p>
                </div>
                <Button size="lg" onClick={handleStart} data-testid="button-start-session">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Task */}
                <div>
                  <Badge variant="outline" className="mb-3">
                    Task {currentTaskIndex + 1} of {totalTasks}
                  </Badge>
                  <h2 className="text-xl font-semibold mb-1">{currentTask?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentTaskDuration} minutes estimated
                  </p>
                </div>

                {/* Timer */}
                <div className="py-6">
                  <div className="text-7xl font-bold font-mono tracking-tight" data-testid="text-timer">
                    {formatTime(elapsedSeconds)}
                  </div>
                  <Progress value={progress} className="mt-6 h-3" data-testid="progress-timer" />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStop}
                    data-testid="button-stop"
                  >
                    <StopCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePause}
                    className="px-8"
                    data-testid="button-pause"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSkip}
                    data-testid="button-skip"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Task Queue */}
          {isActive && (
            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Upcoming Tasks</h3>
              <div className="space-y-2">
                {mockTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === currentTaskIndex
                        ? 'bg-primary/10'
                        : index < currentTaskIndex
                        ? 'opacity-50'
                        : 'bg-muted/50'
                    }`}
                  >
                    {index < currentTaskIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        index === currentTaskIndex ? 'border-primary' : 'border-muted-foreground'
                      }`} />
                    )}
                    <span className="text-sm flex-1">{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.duration}m
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Break Suggestion Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BreakIcon className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle>{breakInfo.title}</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {breakInfo.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowBreakDialog(false)}
            >
              Skip Break
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowBreakDialog(false);
                setIsPaused(true);
              }}
            >
              Take Break
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
