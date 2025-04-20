
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  MapPin,
  Upload,
  AlertTriangle,
  Camera,
  Image,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { departments } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';

// Form types
interface ComplaintFormValues {
  department: string;
  title: string;
  description: string;
  location: string;
  pincode: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  images: FileList | null;
}

const NewComplaintPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual'>('manual');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  // Get default department from URL if available
  const defaultDepartment = searchParams.get('department') || '';
  
  // Form definition
  const form = useForm<ComplaintFormValues>({
    defaultValues: {
      department: defaultDepartment,
      title: '',
      description: '',
      location: user?.location.area || '',
      pincode: user?.location.pincode || '',
      priority: 'medium',
      images: null
    }
  });
  
  // Location detection
  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationMethod('gps');
          toast({
            title: "Location detected",
            description: `Latitude: ${position.coords.latitude.toFixed(6)}, Longitude: ${position.coords.longitude.toFixed(6)}`
          });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Could not detect location",
            description: "Please enter your location manually",
            variant: "destructive"
          });
          setLocationMethod('manual');
          setIsDetectingLocation(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection",
        variant: "destructive"
      });
      setLocationMethod('manual');
      setIsDetectingLocation(false);
    }
  };
  
  // Form submission
  const onSubmit = (data: ComplaintFormValues) => {
    setIsSubmitting(true);
    
    // Mock form submission
    setTimeout(() => {
      console.log('Form data:', data);
      console.log('Location data:', locationMethod === 'gps' ? currentLocation : 'Manual entry');
      
      toast({
        title: "Complaint submitted successfully",
        description: "Your complaint has been registered with ID: CP-2023-0051"
      });
      
      setIsSubmitting(false);
      navigate('/complaints');
    }, 1500);
  };
  
  // Preview images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    form.setValue('images', files);
    
    const newPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPreviews.push(URL.createObjectURL(file));
    }
    
    setImagePreviews(newPreviews);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report a New Issue</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to report a civic issue in your area
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>
            Please provide detailed information about the issue to help officials address it effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the department that should handle this issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title of the issue" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your complaint
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the issue..." 
                        {...field} 
                        className="min-h-32"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible about the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Location Information</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      type="button" 
                      variant={locationMethod === 'gps' ? "default" : "outline"} 
                      onClick={() => detectLocation()}
                      disabled={isDetectingLocation}
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
                    </Button>
                    <Button 
                      type="button" 
                      variant={locationMethod === 'manual' ? "default" : "outline"} 
                      onClick={() => setLocationMethod('manual')}
                      className="flex items-center gap-2"
                    >
                      <Input type="text" className="w-4 h-4 p-0 border-0" />
                      Enter Manually
                    </Button>
                  </div>
                </div>
              
                {locationMethod === 'manual' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area/Locality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Indiranagar, Koramangala" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 560038" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {locationMethod === 'gps' && currentLocation && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      Using GPS coordinates
                    </div>
                    <p className="text-sm">
                      Latitude: {currentLocation.lat.toFixed(6)}<br />
                      Longitude: {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Low - Minor issue, can be fixed eventually
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Medium - Important issue that needs attention
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            High - Serious problem requiring prompt action
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="urgent" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                            Urgent - Critical situation needing immediate attention
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <div>
                  <FormLabel htmlFor="images">Upload Images (Optional)</FormLabel>
                  <div className="mt-2">
                    <label 
                      htmlFor="images" 
                      className="flex justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="font-medium text-sm mt-2">
                            Drag photos here or click to browse
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          You can upload up to 5 images (max 5MB each)
                        </span>
                      </div>
                      <Input 
                        id="images" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Image Previews</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon"
                            className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newPreviews = [...imagePreviews];
                              newPreviews.splice(index, 1);
                              setImagePreviews(newPreviews);
                              
                              // Also update the form value if possible
                              const currentFiles = form.getValues('images');
                              if (currentFiles) {
                                const dataTransfer = new DataTransfer();
                                Array.from(currentFiles).forEach((file, i) => {
                                  if (i !== index) {
                                    dataTransfer.items.add(file);
                                  }
                                });
                                form.setValue('images', dataTransfer.files);
                              }
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t flex flex-col items-start gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Your complaint will be publicly visible (except for your personal details)</span>
          </div>
          <div className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            <span>Photos help officials better understand and address the issue</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Accurate location information speeds up resolution</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewComplaintPage;
