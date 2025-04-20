
export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  helplineNumber: string;
  emailId?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  department: Department;
  location: {
    area: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userName: string;
  upvotes: number;
  images?: string[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: Comment[];
  escalations?: Escalation[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userRole: 'citizen' | 'official' | 'admin';
}

export interface Escalation {
  id: string;
  reason: string;
  level: number;
  escalatedTo: string;
  escalatedAt: Date;
}

export interface AnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  avgResolutionTime: number; // in days
  departmentStats: {
    departmentId: string;
    departmentName: string;
    count: number;
    resolved: number;
    pending: number;
  }[];
  areaStats: {
    area: string;
    count: number;
  }[];
  trendsData: {
    date: string;
    complaints: number;
    resolved: number;
  }[];
}
