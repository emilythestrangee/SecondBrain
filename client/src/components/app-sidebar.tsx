import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Brain,
  ListTodo,
  Sparkles,
  Timer,
  Network,
  Shield,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecurityHealth } from "@/hooks/use-security";

const menuItems = [
  {
    title: "Tasks",
    url: "/",
    icon: ListTodo,
  },
  {
    title: "Smart Queue",
    url: "/schedule",
    icon: Sparkles,
  },
  {
    title: "Focus Session",
    url: "/focus",
    icon: Timer,
  },
  {
    title: "Dependencies",
    url: "/dependencies",
    icon: Network,
  },
  {
    title: "Security Health",
    url: "/security",
    icon: Shield,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { data: securityHealth, isLoading } = useSecurityHealth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-6">
            <Brain className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">SecondBrain</h1>
              <p className="text-xs text-muted-foreground">Local-first task intelligence</p>
            </div>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Security Health</span>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono" data-testid="text-security-score">
                  {securityHealth?.currentScore ?? 95}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress
                value={securityHealth?.currentScore ?? 95}
                className="h-2"
                data-testid="progress-security-health"
              />
              <p className="text-xs text-muted-foreground">
                {securityHealth?.currentScore && securityHealth.currentScore >= 90
                  ? "Excellent security practices"
                  : "Good security practices"}
              </p>
            </div>
          )}
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
