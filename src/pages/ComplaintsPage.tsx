
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare 
} from 'lucide-react';
import { complaints, departments } from '../services/mockData';
import { Complaint } from '../types';

const ComplaintsPage = () => {
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    let result = [...complaints];
    
    // Search functionality
    if (searchQuery) {
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.location.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter(complaint => complaint.department.id === departmentFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(complaint => complaint.status === statusFilter);
    }
    
    // Sort functionality
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'comments':
        result.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setFilteredComplaints(result);
  }, [searchQuery, departmentFilter, statusFilter, sortBy]);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Complaints</h1>
          <p className="text-muted-foreground">
            View and track all public complaints in your city
          </p>
        </div>
        <Button asChild>
          <Link to="/complaints/new">Report New Issue</Link>
        </Button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search complaints..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={departmentFilter} 
          onValueChange={setDepartmentFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredComplaints.length} complaints
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={sortBy} 
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="upvotes">Most Upvotes</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <Link to={`/complaints/${complaint.id}`} className="font-medium text-lg hover:underline">
                    {complaint.title}
                  </Link>
                  <div className="flex gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getStatusBadgeColor(complaint.status)}
                    >
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getPriorityBadgeColor(complaint.priority)}
                    >
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <span>{complaint.id}</span>
                  <span>•</span>
                  <span>{complaint.department.name}</span>
                  <span>•</span>
                  <span>{complaint.location.area}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm">{complaint.description}</p>
                
                {complaint.images && complaint.images.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {complaint.images.map((img, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden"
                      >
                        <img 
                          src={img} 
                          alt={`Complaint image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {complaint.upvotes} Upvotes
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {complaint.comments.length} Comments
                  </span>
                </div>
                <Button size="sm" variant="secondary" asChild>
                  <Link to={`/complaints/${complaint.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No complaints found matching your criteria</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
