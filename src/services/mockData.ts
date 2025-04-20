
import { Department, Complaint, AnalyticsData } from '../types';

export const departments: Department[] = [
  {
    id: 'water',
    name: 'Water Supply',
    icon: 'droplet',
    description: 'Issues related to water supply, quality, leakage or shortage',
    helplineNumber: '1916',
    emailId: 'water@citypulse.gov.in'
  },
  {
    id: 'garbage',
    name: 'Garbage Collection',
    icon: 'trash',
    description: 'Issues related to waste management, collection or dumping',
    helplineNumber: '1800-103-1977',
    emailId: 'garbage@citypulse.gov.in'
  },
  {
    id: 'roads',
    name: 'Roads & Traffic',
    icon: 'road',
    description: 'Issues related to road conditions, traffic signals or congestion',
    helplineNumber: '1073',
    emailId: 'roads@citypulse.gov.in'
  },
  {
    id: 'electricity',
    name: 'Electricity (BESCOM)',
    icon: 'zap',
    description: 'Issues related to power supply, outages or electrical infrastructure',
    helplineNumber: '1912',
    emailId: 'electricity@citypulse.gov.in'
  },
  {
    id: 'drainage',
    name: 'Drainage',
    icon: 'droplet',
    description: 'Issues related to drainage system, clogging or flooding',
    helplineNumber: '1916',
    emailId: 'drainage@citypulse.gov.in'
  },
  {
    id: 'streetlights',
    name: 'Street Lights',
    icon: 'lamp',
    description: 'Issues related to street lighting, damage or malfunction',
    helplineNumber: '1800-103-1977',
    emailId: 'streetlights@citypulse.gov.in'
  },
  {
    id: 'sewage',
    name: 'Sewage',
    icon: 'pipe',
    description: 'Issues related to sewage system, leakage or blockage',
    helplineNumber: '1916',
    emailId: 'sewage@citypulse.gov.in'
  },
  {
    id: 'parks',
    name: 'Parks & Playgrounds',
    icon: 'tree',
    description: 'Issues related to public parks, playgrounds or green spaces',
    helplineNumber: '1800-103-1977',
    emailId: 'parks@citypulse.gov.in'
  },
  {
    id: 'others',
    name: 'Others',
    icon: 'more-horizontal',
    description: 'Other civic issues not covered in the above categories',
    helplineNumber: '1800-103-1977',
    emailId: 'help@citypulse.gov.in'
  }
];

// Generate mock complaints
const generateMockComplaints = (): Complaint[] => {
  const statuses: Complaint['status'][] = ['pending', 'assigned', 'in-progress', 'resolved', 'closed'];
  const priorities: Complaint['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const areas = ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'JP Nagar', 'Marathahalli'];
  const pincodes = ['560038', '560034', '560066', '560102', '560041', '560078', '560037'];
  
  const complaints: Complaint[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const priorityIndex = Math.floor(Math.random() * priorities.length);
    const areaIndex = Math.floor(Math.random() * areas.length);
    
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
    
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 5));
    
    const comments = [];
    const commentCount = Math.floor(Math.random() * 5);
    
    for (let j = 0; j < commentCount; j++) {
      const commentDate = new Date(createdAt);
      commentDate.setDate(commentDate.getDate() + j + 1);
      
      comments.push({
        id: `comment-${i}-${j}`,
        text: `This is a comment on complaint #CP-2023-${i.toString().padStart(4, '0')}`,
        createdAt: commentDate,
        userId: `user-${Math.floor(Math.random() * 100)}`,
        userName: Math.random() > 0.5 ? 'Citizen User' : 'Department Official',
        userRole: Math.random() > 0.5 ? 'citizen' : 'official'
      });
    }
    
    complaints.push({
      id: `CP-2023-${i.toString().padStart(4, '0')}`,
      title: `${departments[departmentIndex].name} issue in ${areas[areaIndex]}`,
      description: `This is a detailed description of a ${departments[departmentIndex].name.toLowerCase()} related issue in ${areas[areaIndex]} area.`,
      department: departments[departmentIndex],
      location: {
        area: areas[areaIndex],
        pincode: pincodes[areaIndex],
        coordinates: {
          lat: 12.9716 + Math.random() * 0.05,
          lng: 77.5946 + Math.random() * 0.05
        }
      },
      status: statuses[statusIndex],
      createdAt,
      updatedAt,
      userId: 'user-123',
      userName: 'Rahul Sharma',
      upvotes: Math.floor(Math.random() * 50),
      priority: priorities[priorityIndex],
      comments,
      images: Math.random() > 0.5 ? ['https://placehold.co/600x400?text=Issue+Image'] : []
    });
  }
  
  return complaints;
};

export const complaints = generateMockComplaints();

// Generate mock analytics data
export const generateAnalyticsData = (): AnalyticsData => {
  const resolvedComplaints = complaints.filter(c => 
    c.status === 'resolved' || c.status === 'closed'
  ).length;
  
  const pendingComplaints = complaints.length - resolvedComplaints;
  
  // Department stats
  const departmentStats = departments.map(dept => {
    const deptComplaints = complaints.filter(c => c.department.id === dept.id);
    const resolved = deptComplaints.filter(c => 
      c.status === 'resolved' || c.status === 'closed'
    ).length;
    
    return {
      departmentId: dept.id,
      departmentName: dept.name,
      count: deptComplaints.length,
      resolved,
      pending: deptComplaints.length - resolved
    };
  }).filter(d => d.count > 0);
  
  // Area stats
  const areas = [...new Set(complaints.map(c => c.location.area))];
  const areaStats = areas.map(area => {
    const count = complaints.filter(c => c.location.area === area).length;
    return { area, count };
  }).sort((a, b) => b.count - a.count);
  
  // Trends data (last 30 days)
  const trendsData = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayComplaints = complaints.filter(c => {
      const complainDate = new Date(c.createdAt);
      return complainDate.toISOString().split('T')[0] === dateStr;
    });
    
    const resolved = complaints.filter(c => {
      const resolveDate = new Date(c.updatedAt);
      return (c.status === 'resolved' || c.status === 'closed') && 
        resolveDate.toISOString().split('T')[0] === dateStr;
    });
    
    trendsData.push({
      date: dateStr,
      complaints: dayComplaints.length,
      resolved: resolved.length
    });
  }
  
  // Calculate average resolution time
  const resolvedComplaintsList = complaints.filter(c => 
    c.status === 'resolved' || c.status === 'closed'
  );
  
  let totalResolutionTime = 0;
  
  resolvedComplaintsList.forEach(c => {
    const created = new Date(c.createdAt).getTime();
    const updated = new Date(c.updatedAt).getTime();
    const diffDays = (updated - created) / (1000 * 60 * 60 * 24);
    totalResolutionTime += diffDays;
  });
  
  const avgResolutionTime = resolvedComplaintsList.length > 0 
    ? +(totalResolutionTime / resolvedComplaintsList.length).toFixed(1) 
    : 0;
  
  return {
    totalComplaints: complaints.length,
    resolvedComplaints,
    pendingComplaints,
    avgResolutionTime,
    departmentStats,
    areaStats,
    trendsData
  };
};

export const analyticsData = generateAnalyticsData();
