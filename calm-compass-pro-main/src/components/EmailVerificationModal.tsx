import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, CheckCircle, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { sendVerificationEmail } from "./EmailService";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  clinicName: string;
  onVerified: () => void;
}

const EmailVerificationModal = ({ isOpen, onClose, email, clinicName, onVerified }: EmailVerificationModalProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [attempts, setAttempts] = useState(0);
  const [isResent, setIsResent] = useState(false);

  // Mock verification code for demo
  const DEMO_VERIFICATION_CODE = "123456";

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (verificationCode === DEMO_VERIFICATION_CODE) {
      setVerificationStatus('verified');
      toast.success("Email verified successfully!");
      setTimeout(() => {
        onVerified();
        onClose();
      }, 2000);
    } else {
      setVerificationStatus('failed');
      setAttempts(prev => prev + 1);
      toast.error("Invalid verification code. Please try again.");
      
      if (attempts >= 2) {
        toast.error("Too many failed attempts. Please request a new code.");
      }
    }
    
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      // Send verification email
      const success = await sendVerificationEmail(email, clinicName, DEMO_VERIFICATION_CODE);
      
      if (success) {
        setIsResent(true);
        toast.success("Verification code sent successfully!");
        
        // Reset verification status
        setVerificationStatus('pending');
        setVerificationCode("");
        setAttempts(0);
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    if (verificationStatus === 'verified') {
      onVerified();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Verification Required
          </DialogTitle>
          <DialogDescription>
            We've sent a verification code to your email address. Please enter it below to complete your clinic registration.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Email Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Verification Email Sent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Clinic:</span> {clinicName}
              </div>
              <div className="text-sm">
                <span className="font-medium">Email:</span> {email}
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span> 
                <Badge variant="outline" className="ml-2">
                  {verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {verificationStatus === 'verified' ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Email Verified!</h3>
                <p className="text-green-700">
                  Your clinic registration has been submitted successfully. 
                  We'll review your application and get back to you soon.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Verification Code Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Enter Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    disabled={isVerifying}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {verificationStatus === 'failed' && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <strong>Invalid code.</strong> Please check your email and try again.
                    {attempts >= 2 && (
                      <p className="mt-1">Too many failed attempts. Please request a new code.</p>
                    )}
                  </div>
                )}

                {/* Demo Code Hint */}
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                  <strong>Demo:</strong> Use code <code className="bg-gray-200 px-1 rounded">123456</code> to verify
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !verificationCode || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify Email
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isResending}
                >
                  {isResending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend
                    </>
                  )}
                </Button>
              </div>

              {isResent && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="inline h-4 w-4 mr-1" />
                  New verification code sent to your email
                </div>
              )}

              {/* Help Text */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Check your email inbox and spam folder</p>
                <p>• The code expires in 10 minutes</p>
                <p>• Contact support if you don't receive the email</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
          </Button>
          
          {verificationStatus === 'verified' && (
            <Button onClick={handleClose}>
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
