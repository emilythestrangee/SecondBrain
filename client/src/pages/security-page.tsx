import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Clock,
} from "lucide-react";
import { useSecurityHealth } from "@/hooks/use-security";

export default function SecurityPage() {
  const { data: healthData, isLoading } = useSecurityHealth();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b bg-background p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold">Security Health</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Cybersecurity-aware features and behavioral analytics
          </p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card className="p-8">
              <div className="text-center mb-6 space-y-4">
                <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-96 mx-auto" />
              </div>
              <Skeleton className="h-3 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  const { currentScore, recommendations, recentActivity, badges } = healthData;

  const badgeIcons = {
    "No Interruptions": Shield,
    "Encryption Master": Lock,
    "Security Conscious": Eye,
    "Consistent Worker": Clock,
  };

  const securityPercentage = recentActivity.totalTasksCompleted > 0
    ? (recentActivity.securityTasksCompleted / recentActivity.totalTasksCompleted) * 100
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Security Health</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Cybersecurity-aware features and behavioral analytics
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overall Score */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4">
                <div className="text-center">
                  <div className="text-5xl font-bold font-mono" data-testid="text-overall-security-score">
                    {currentScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {currentScore >= 90 ? "Excellent" : currentScore >= 75 ? "Good" : "Fair"} Security Health
              </h2>
              <p className="text-muted-foreground">
                {currentScore >= 90
                  ? "You're following best practices for secure productivity"
                  : "Keep improving your security practices"}
              </p>
            </div>
            <Progress value={currentScore} className="h-3" data-testid="progress-overall-security" />
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Security Tasks</span>
              </div>
              <div className="text-3xl font-bold font-mono">{recentActivity.securityTasksCompleted}</div>
              <p className="text-xs text-muted-foreground">
                {securityPercentage.toFixed(0)}% of total tasks
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Tasks Completed</span>
              </div>
              <div className="text-3xl font-bold font-mono">{recentActivity.totalTasksCompleted}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Late-Night Sessions</span>
              </div>
              <div className="text-3xl font-bold font-mono">{recentActivity.lateNightSessions}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Security Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const isPositive = rec.toLowerCase().includes("excellent") || rec.toLowerCase().includes("great");
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                    data-testid={`recommendation-${index + 1}`}
                  >
                    {isPositive ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm flex-1">{rec}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Security Badges</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge) => {
                const BadgeIcon = badgeIcons[badge.name as keyof typeof badgeIcons] || Shield;
                return (
                  <div
                    key={badge.name}
                    className={`p-4 rounded-lg border-2 ${
                      badge.earned
                        ? 'border-primary bg-primary/5'
                        : 'border-dashed border-muted-foreground/30 opacity-50'
                    }`}
                    data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          badge.earned ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <BadgeIcon
                          className={`w-6 h-6 ${
                            badge.earned ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                      {badge.earned && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
