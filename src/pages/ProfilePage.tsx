
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, UserCheck, MapPin, Star, Settings, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { complaints } from '../services/mockData';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: 'user@example.com',
    area: user?.location?.area || '',
    pincode: user?.location?.pincode || '',
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
    setIsEditing(false);
  };
  
  // Get user's complaints
  const userComplaints = complaints.filter(c => c.userId === 'user-123');
  
  // Calculate stats
  const resolvedComplaints = userComplaints.filter(c => 
    c.status === 'resolved' || c.status === 'closed'
  ).length;
  const pendingComplaints = userComplaints.length - resolvedComplaints;
  const totalUpvotes = userComplaints.reduce((total, complaint) => total + complaint.upvotes, 0);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Column - User Profile */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <UserCheck className="h-3.5 w-3.5 text-green-500" />
                  <span>Aadhaar Verified</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location.area}, {user.location.city}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{userComplaints.length}</p>
                  <p className="text-xs text-muted-foreground">Issues</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{resolvedComplaints}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{totalUpvotes}</p>
                  <p className="text-xs text-muted-foreground">Upvotes</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Civic Engagement</span>
                  <span>Active</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-city-blue-400 to-city-green-400" 
                    style={{ width: '75%' }} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on your complaints, updates and community involvement
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Tabs */}
        <div className="md:col-span-5">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="complaints">My Complaints</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Manage your personal details and address
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{formData.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50 flex items-center">
                          {formData.phone}
                          <UserCheck className="h-4 w-4 ml-2 text-green-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{formData.email}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area">Area/Locality</Label>
                      {isEditing ? (
                        <Input
                          id="area"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{formData.area}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      {isEditing ? (
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{formData.pincode}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="p-2 border rounded-md bg-muted/50">{user.location.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Verification</CardTitle>
                  <CardDescription>
                    Your account verification status and details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Aadhaar Verification</h3>
                        <p className="text-sm text-muted-foreground">Your identity has been verified</p>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">Verified</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Address Verification</h3>
                        <p className="text-sm text-muted-foreground">Your address has been verified</p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-medium">Verified</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Complaints Tab */}
            <TabsContent value="complaints">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>My Complaints</CardTitle>
                      <CardDescription>
                        View and track all your complaints
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/complaints/new')}>
                      Report New Issue
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userComplaints.length > 0 ? (
                      userComplaints.slice(0, 5).map((complaint) => (
                        <div 
                          key={complaint.id}
                          className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{complaint.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{complaint.id}</span>
                              <span>•</span>
                              <span>{complaint.department.name}</span>
                              <span>•</span>
                              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div>
                            <Button 
                              variant="ghost" 
                              onClick={() => navigate(`/complaints/${complaint.id}`)}
                              className={`px-3 py-1 text-xs rounded-full ${
                                complaint.status === 'resolved' || complaint.status === 'closed'
                                  ? 'bg-green-100 text-green-800'
                                  : complaint.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't reported any complaints yet</p>
                        <Button variant="link" onClick={() => navigate('/complaints/new')}>
                          Report your first issue
                        </Button>
                      </div>
                    )}
                    
                    {userComplaints.length > 5 && (
                      <div className="text-center">
                        <Button variant="link" onClick={() => navigate('/my-complaints')}>
                          View all my complaints
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Complaint Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-md text-center">
                      <div className="text-2xl font-bold">{userComplaints.length}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-md text-center">
                      <div className="text-2xl font-bold text-yellow-700">{pendingComplaints}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-md text-center">
                      <div className="text-2xl font-bold text-green-700">{resolvedComplaints}</div>
                      <div className="text-sm text-muted-foreground">Resolved</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md text-center">
                      <div className="text-2xl font-bold text-blue-700">{totalUpvotes}</div>
                      <div className="text-sm text-muted-foreground">Upvotes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Notifications</h3>
                          <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">App Preferences</h3>
                          <p className="text-sm text-muted-foreground">Customize your app experience</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Language</h3>
                          <p className="text-sm text-muted-foreground">Change your preferred language</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        English
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your privacy preferences and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Data Privacy</h3>
                          <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Profile Visibility</h3>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Private
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full">
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
