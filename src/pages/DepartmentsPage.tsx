
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { departments } from '../services/mockData';
import { SearchIcon, Phone, MapPin, Mail } from 'lucide-react';

const DepartmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    dept => dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get icon component based on icon name
  const getDepartmentIcon = (iconName: string) => {
    const iconStyle = "w-10 h-10 bg-city-blue-50 text-city-blue-500 p-2 rounded-lg";
    
    switch (iconName) {
      case 'droplet':
        return <div className={iconStyle}>💧</div>;
      case 'trash':
        return <div className={iconStyle}>🗑️</div>;
      case 'road':
        return <div className={iconStyle}>🛣️</div>;
      case 'zap':
        return <div className={iconStyle}>⚡</div>;
      case 'lamp':
        return <div className={iconStyle}>💡</div>;
      case 'pipe':
        return <div className={iconStyle}>🚿</div>;
      case 'tree':
        return <div className={iconStyle}>🌳</div>;
      case 'more-horizontal':
        return <div className={iconStyle}>⋯</div>;
      default:
        return <div className={iconStyle}>📋</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground mt-2">
          Explore our civic departments and report issues by category
        </p>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search departments..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {getDepartmentIcon(department.icon)}
                <CardTitle>{department.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mt-2 line-clamp-2">
                {department.description}
              </CardDescription>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a 
                    href={`tel:${department.helplineNumber}`}
                    className="text-city-blue-500 hover:underline"
                  >
                    {department.helplineNumber}
                  </a>
                </div>
                
                {department.emailId && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${department.emailId}`}
                      className="text-city-blue-500 hover:underline"
                    >
                      {department.emailId}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/departments/${department.id}`}>
                  View Details
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={`/complaints/new?department=${department.id}`}>
                  Report Issue
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No departments found matching "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
