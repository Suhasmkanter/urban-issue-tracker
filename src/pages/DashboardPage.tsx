
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { complaints, departments, analyticsData } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Complaint } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [urgentComplaints, setUrgentComplaints] = useState<Complaint[]>([]);
  
  useEffect(() => {
    // Get recent complaints
    const recent = [...complaints]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentComplaints(recent);
    
    // Get urgent complaints
    const urgent = complaints
      .filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed')
      .slice(0, 3);
    setUrgentComplaints(urgent);
    
    // Welcome toast for first time visitors
    if (user && !localStorage.getItem('welcomed')) {
      toast({
        title: `Welcome, ${user.name}!`,
        description: "Explore City Pulse to report and track civic issues in your area.",
      });
      localStorage.setItem('welcomed', 'true');
    }
  }, [user, toast]);
  
  // Prepare data for charts
  const departmentChartData = departments.map(dept => {
    const count = complaints.filter(c => c.department.id === dept.id).length;
    return {
      name: dept.name,
      complaints: count
    };
  }).filter(d => d.complaints > 0).sort((a, b) => b.complaints - a.complaints).slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to City Pulse - Your civic issues tracker
          </p>
        </div>
        <Button asChild>
          <Link to="/complaints/new">Report New Issue</Link>
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.resolvedComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((analyticsData.resolvedComplaints / analyticsData.totalComplaints) * 100)}% of total complaints
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting resolution
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgResolutionTime} days</div>
            <p className="text-xs text-muted-foreground">
              For resolved complaints
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Complaints</TabsTrigger>
          <TabsTrigger value="urgent">Urgent Issues</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Top Departments Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Complaints by Department</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="complaints" 
                      fill="#0ea5e9" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Top Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Top Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {analyticsData.areaStats.slice(0, 5).map((area, i) => (
                    <div className="flex items-center" key={area.area}>
                      <div className="w-2 h-2 rounded-full bg-city-blue-400 mr-2" />
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {area.area}
                        </p>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-city-blue-400 to-city-green-400" 
                            style={{ 
                              width: `${(area.count / analyticsData.areaStats[0].count) * 100}%` 
                            }} 
                          />
                        </div>
                      </div>
                      <div className="ml-auto font-medium">{area.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Emergency Info */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Helplines</AlertTitle>
            <AlertDescription>
              For emergencies, contact the helpline at <a href="tel:1800-103-1977" className="font-bold">1800-103-1977</a> or visit the <Link to="/emergency" className="font-bold text-primary">Emergency</Link> page.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            {recentComplaints.map(complaint => (
              <Card key={complaint.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Link to={`/complaints/${complaint.id}`} className="font-medium hover:underline">
                      {complaint.title}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'resolved' || complaint.status === 'closed'
                        ? 'bg-green-100 text-green-800'
                        : complaint.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      {complaint.department.name}
                      <span className="mx-2">•</span>
                      {complaint.location.area}
                    </div>
                    <p className="line-clamp-2">{complaint.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/complaints">View All Complaints</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="urgent" className="space-y-4">
          {urgentComplaints.length > 0 ? (
            <div className="space-y-4">
              {urgentComplaints.map(complaint => (
                <Card key={complaint.id} className="border-red-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Link to={`/complaints/${complaint.id}`} className="font-medium hover:underline">
                        {complaint.title}
                      </Link>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        {complaint.department.name}
                        <span className="mx-2">•</span>
                        {complaint.location.area}
                      </div>
                      <p className="line-clamp-2">{complaint.description}</p>
                      <div className="mt-2">
                        <Button size="sm" variant="secondary" asChild>
                          <Link to={`/complaints/${complaint.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-8 text-muted-foreground">
              <p>No urgent complaints at the moment</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
