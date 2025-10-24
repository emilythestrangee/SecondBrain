import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAnalyticsSummary, useFocusSessions } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useAnalyticsSummary();
  const { data: sessions, isLoading: sessionsLoading } = useFocusSessions();

  const isLoading = statsLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b bg-background p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Session telemetry, productivity metrics, and estimation accuracy
          </p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Session telemetry, productivity metrics, and estimation accuracy
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Sessions</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.totalSessions ?? 0}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Total Time</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.totalTime ?? 0}m</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Avg Session</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.avgSessionTime ?? 0}m</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Completed</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.tasksCompleted ?? 0}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Interruptions</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.interruptions ?? 0}</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Avg Energy</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stats?.avgEnergy ?? 0}</div>
            </Card>
          </div>

          {/* Session History */}
          {sessions && sessions.length > 0 ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Session History</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Interruptions</TableHead>
                    <TableHead>Pauses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id} data-testid={`row-session-${session.id}`}>
                      <TableCell className="font-medium">
                        {new Date(session.startedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{Math.round(session.totalDuration / 60)}m</Badge>
                      </TableCell>
                      <TableCell>{session.tasksCompleted}</TableCell>
                      <TableCell>
                        <Badge variant={session.interruptions === 0 ? "outline" : "destructive"}>
                          {session.interruptions}
                        </Badge>
                      </TableCell>
                      <TableCell>{session.pauseCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No session data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Complete some focus sessions to see analytics and insights about your productivity patterns
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
