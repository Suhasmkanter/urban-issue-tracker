
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOtp, login, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await sendOtp(phone);
      if (success) {
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone"
        });
        setStep('otp');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await login(phone, otp);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to City Pulse!"
        });
        navigate('/');
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-city-blue-50 to-city-green-50">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gradient-to-r from-city-blue-400 to-city-green-400 p-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-city-blue-500 font-bold text-lg">CP</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-city-blue-500 to-city-green-500 bg-clip-text text-transparent">
            City Pulse
          </h1>
          <p className="mt-2 text-gray-600">Your voice for civic improvement</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'phone' ? 'Login with Phone' : 'Enter OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'Enter your Aadhaar-linked phone number' 
                : 'Enter the verification code sent to your phone'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || phone.length !== 10}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      pattern="[0-9]{6}"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              {step === 'otp' && (
                <Button 
                  variant="link" 
                  onClick={() => setStep('phone')}
                  className="w-full text-sm"
                >
                  Change phone number
                </Button>
              )}
              <p className="mt-4 text-sm text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
