import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Users, 
  MousePointerClick, 
  Eye, 
  Clock, 
  LogOut,
  RefreshCw,
  ArrowLeft,
  Mail,
  Building,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import type { DemoRequest, AnalyticsEvent } from "@shared/schema";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AnalyticsSummary {
  eventType: string;
  count: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading, error: authError } = useQuery<{ success: boolean; user: AdminUser }>({
    queryKey: ["/api/admin/me"],
  });

  // Fetch demo requests
  const { data: leadsData, isLoading: leadsLoading, refetch: refetchLeads } = useQuery<{ 
    success: boolean; 
    data: DemoRequest[];
    pagination: { limit: number; offset: number; total: number };
  }>({
    queryKey: ["/api/admin/demo-requests"],
    enabled: !!authData?.success,
  });

  // Fetch analytics summary
  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery<{
    success: boolean;
    data: AnalyticsSummary[];
  }>({
    queryKey: ["/api/admin/analytics/summary"],
    enabled: !!authData?.success,
  });

  // Fetch recent events
  const { data: eventsData, isLoading: eventsLoading } = useQuery<{
    success: boolean;
    data: AnalyticsEvent[];
  }>({
    queryKey: ["/api/admin/analytics/events"],
    enabled: !!authData?.success,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      setLocation("/admin");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (authError || !authData?.success)) {
      setLocation("/admin");
    }
  }, [authLoading, authError, authData, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-symmetri-orange mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authData?.success) {
    return null;
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "page_view": return <Eye className="w-4 h-4" />;
      case "cta_click": return <MousePointerClick className="w-4 h-4" />;
      case "scroll_depth": return <BarChart3 className="w-4 h-4" />;
      case "time_on_page": return <Clock className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const formatEventCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-card/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-muted-foreground hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-white">Symmetri Admin</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {authData.user.username}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-admin-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-card/50 border border-white/10">
            <TabsTrigger value="leads" data-testid="tab-leads">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Demo Requests</h2>
                <p className="text-muted-foreground">
                  {leadsData?.pagination.total || 0} total leads
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetchLeads()}
                data-testid="button-refresh-leads"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card className="bg-card/50 border-white/10">
              <CardContent className="p-0">
                {leadsLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : leadsData?.data.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No demo requests yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Email</TableHead>
                        <TableHead className="text-muted-foreground">Company</TableHead>
                        <TableHead className="text-muted-foreground">Team Size</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadsData?.data.map((lead) => (
                        <TableRow 
                          key={lead.id} 
                          className="border-white/10"
                          data-testid={`row-lead-${lead.id}`}
                        >
                          <TableCell className="font-medium text-white">
                            {lead.name}
                          </TableCell>
                          <TableCell>
                            <a 
                              href={`mailto:${lead.email}`}
                              className="text-symmetri-orange hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {lead.company}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lead.teamSize ? (
                              <Badge variant="secondary" className="text-xs">
                                {lead.teamSize}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground/50">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(lead.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {lead.source || "cta"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
                <p className="text-muted-foreground">Track user engagement metrics</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetchAnalytics()}
                data-testid="button-refresh-analytics"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Event counts summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analyticsLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-card/50 border-white/10">
                    <CardContent className="p-4">
                      <Skeleton className="h-10 w-full mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                analyticsData?.data.map((item) => (
                  <Card 
                    key={item.eventType} 
                    className="bg-card/50 border-white/10"
                    data-testid={`card-analytics-${item.eventType}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        {getEventIcon(item.eventType)}
                        <span className="text-sm capitalize">
                          {item.eventType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {formatEventCount(item.count)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Recent events table */}
            <Card className="bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Events</CardTitle>
                <CardDescription>Last 100 tracked events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {eventsLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Event</TableHead>
                          <TableHead className="text-muted-foreground">Data</TableHead>
                          <TableHead className="text-muted-foreground">Session</TableHead>
                          <TableHead className="text-muted-foreground">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventsData?.data.slice(0, 50).map((event) => (
                          <TableRow 
                            key={event.id} 
                            className="border-white/10"
                          >
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {event.eventType.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                              {event.eventData ? JSON.stringify(event.eventData) : "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs font-mono">
                              {event.sessionId?.slice(0, 12)}...
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {formatDate(event.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
