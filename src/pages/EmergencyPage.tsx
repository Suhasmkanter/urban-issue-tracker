
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  AlertTriangle, 
  Heart, 
  Droplet, 
  Zap, 
  Flame, 
  Shield
} from 'lucide-react';

const EmergencyPage = () => {
  const emergencyContacts = [
    {
      category: 'Common Emergencies',
      contacts: [
        { name: 'Police Control Room', number: '100', icon: Shield },
        { name: 'Fire Control Room', number: '101', icon: Flame },
        { name: 'Ambulance', number: '108', icon: Heart },
        { name: 'Emergency Disaster Management', number: '112', icon: AlertTriangle },
        { name: 'Women Helpline', number: '1091', icon: Phone },
      ]
    },
    {
      category: 'Municipal Services',
      contacts: [
        { name: 'Water Supply Emergency', number: '1916', icon: Droplet },
        { name: 'Electricity (BESCOM) Helpline', number: '1912', icon: Zap },
        { name: 'Garbage Collection', number: '1800-103-1977', icon: Phone },
        { name: 'Road & Traffic Issues', number: '1073', icon: Phone },
        { name: 'Drainage & Sewage', number: '1916', icon: Phone },
      ]
    },
    {
      category: 'Medical Services',
      contacts: [
        { name: 'Medical Helpline', number: '104', icon: Heart },
        { name: 'Blood Bank', number: '1910', icon: Heart },
        { name: 'COVID-19 Helpline', number: '1075', icon: Heart },
        { name: 'Mental Health Helpline', number: '1800-599-0019', icon: Phone },
      ]
    },
  ];
  
  const safetyTips = [
    {
      title: 'Water-Related',
      tips: [
        'Store drinking water in clean containers',
        'Report water contamination immediately',
        'Report water leakages to prevent wastage',
        'During water shortage, use water judiciously'
      ]
    },
    {
      title: 'Electricity',
      tips: [
        'Stay away from broken power lines',
        'Report power outages promptly',
        'Keep electrical equipment away from water',
        'Report exposed wiring in public places'
      ]
    },
    {
      title: 'Roads & Traffic',
      tips: [
        'Report pot holes and damaged roads',
        'Report non-functional traffic signals',
        'Stay clear of waterlogged roads',
        'Report fallen trees or obstacles on roads'
      ]
    },
    {
      title: 'Waste Management',
      tips: [
        'Segregate waste into wet and dry',
        'Report missed garbage collection',
        'Don\'t burn garbage in the open',
        'Report unauthorized dumping sites'
      ]
    },
    {
      title: 'Monsoon Safety',
      tips: [
        'Report clogged drains before monsoon',
        'Avoid waterlogged areas',
        'Report fallen trees or electric poles',
        'Keep emergency numbers handy'
      ]
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency Help & Services</h1>
          <p className="text-muted-foreground mt-2">
            Important contacts and safety information for civic emergencies
          </p>
        </div>
        <Button size="lg" className="gap-2 bg-red-500 hover:bg-red-600">
          <Phone className="h-4 w-4" />
          Emergency: 112
        </Button>
      </div>
      
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            For life-threatening emergencies, call 112 immediately. This page provides contacts for civic issues 
            and non-life-threatening situations.
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="contacts" className="flex-1 sm:flex-initial">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="safety" className="flex-1 sm:flex-initial">Safety Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="space-y-4">
          {emergencyContacts.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>Important contact numbers for emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.contacts.map((contact, contactIndex) => (
                    <div 
                      key={contactIndex}
                      className="flex items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="p-2 mr-3 bg-primary/10 rounded-full">
                        <contact.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.name}</h3>
                        <a 
                          href={`tel:${contact.number}`} 
                          className="text-primary hover:underline"
                        >
                          {contact.number}
                        </a>
                      </div>
                      <Button size="icon" variant="ghost" asChild>
                        <a href={`tel:${contact.number}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {safetyTips.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.title} Safety</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <div className="p-1 mr-2 bg-secondary/10 rounded-full">
                          <AlertTriangle className="h-3 w-3 text-secondary" />
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>First Aid Basics</CardTitle>
              <CardDescription>Essential first aid knowledge for common emergencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">For Minor Burns</h3>
                  <p className="text-sm text-muted-foreground">
                    Cool the burn with cold running water for at least 10 minutes. 
                    Cover with a clean, non-sticky bandage or cloth. Do not apply ice directly.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">For Cuts and Wounds</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean the wound with soap and water. Apply pressure to stop bleeding. 
                    Cover with a clean bandage. Seek medical help for deep wounds.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">For Electric Shock</h3>
                  <p className="text-sm text-muted-foreground">
                    Do not touch the person if they are still in contact with the electrical source.
                    Turn off the power source if possible. Call emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Report a Civic Emergency</CardTitle>
          <CardDescription>
            If you encounter an urgent civic issue that requires immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="w-full sm:w-auto" asChild>
            <a href="tel:1800-103-1977">Call Municipal Helpline</a>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Report Emergency Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPage;
