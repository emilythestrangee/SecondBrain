import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GraphNode {
  id: string;
  title: string;
  completed: boolean;
  x: number;
  y: number;
  dependsOn: string[];
}

export default function DependenciesPage() {
  // Mock graph data - positioned for visual layout
  const nodes: GraphNode[] = [
    {
      id: "4",
      title: "Implement greedy scheduler",
      completed: true,
      x: 150,
      y: 100,
      dependsOn: [],
    },
    {
      id: "3",
      title: "Write unit tests for scheduler",
      completed: false,
      x: 150,
      y: 250,
      dependsOn: ["4"],
    },
    {
      id: "1",
      title: "Implement AES-256 encryption",
      completed: false,
      x: 450,
      y: 100,
      dependsOn: [],
    },
    {
      id: "2",
      title: "Design dependency graph",
      completed: false,
      x: 450,
      y: 250,
      dependsOn: [],
    },
  ];

  const hasCycle = false; // Would be computed by DFS algorithm

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Task Dependencies</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Visualize task relationships and detect circular dependencies using DFS
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Cycle Detection Alert */}
          {hasCycle ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Circular dependency detected!</span>
                {" "}The graph contains a cycle which must be resolved before tasks can be scheduled.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <span className="font-medium">No cycles detected.</span>
                {" "}Task dependency graph is valid and can be used for scheduling.
              </AlertDescription>
            </Alert>
          )}

          {/* Graph Visualization */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Dependency Graph</h2>
              <p className="text-sm text-muted-foreground">
                Interactive visualization showing task relationships
              </p>
            </div>

            {/* SVG Graph */}
            <div className="bg-muted/30 rounded-lg p-8 min-h-[400px] relative">
              <svg className="w-full h-[400px]" viewBox="0 0 600 350">
                {/* Draw edges first (behind nodes) */}
                {nodes.map((node) =>
                  node.dependsOn.map((depId) => {
                    const depNode = nodes.find((n) => n.id === depId);
                    if (!depNode) return null;
                    
                    return (
                      <g key={`${node.id}-${depId}`}>
                        {/* Arrow line */}
                        <line
                          x1={depNode.x}
                          y1={depNode.y}
                          x2={node.x}
                          y2={node.y}
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    );
                  })
                )}

                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill="hsl(var(--primary))"
                    />
                  </marker>
                </defs>

                {/* Draw nodes */}
                {nodes.map((node) => (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {/* Node circle */}
                    <circle
                      r="12"
                      fill={node.completed ? "hsl(var(--primary))" : "hsl(var(--background))"}
                      stroke={node.completed ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth="2"
                    />
                    {node.completed && (
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontSize="12"
                        fill="hsl(var(--primary-foreground))"
                      >
                        ✓
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </Card>

          {/* Legend & Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legend */}
            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm">Completed Task</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-border" />
                  <span className="text-sm">Pending Task</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="40" height="2">
                    <line
                      x1="0"
                      y1="1"
                      x2="40"
                      y2="1"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-sm">Dependency Arrow</span>
                </div>
              </div>
            </Card>

            {/* Task List */}
            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4">All Tasks ({nodes.length})</h3>
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover-elevate"
                  >
                    {node.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{node.title}</p>
                      {node.dependsOn.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Depends on: {node.dependsOn.length} task{node.dependsOn.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
