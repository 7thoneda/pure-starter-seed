import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { Copy, Gift, Users, Clock } from 'lucide-react';

export function ReferralScreen() {
  const [inputCode, setInputCode] = useState('');
  const { 
    userCode, 
    referrals, 
    premiumExpiry, 
    hasPremium, 
    isLoading, 
    useReferralCode, 
    copyReferralLink 
  } = useReferrals();

  const handleUseCode = async () => {
    if (inputCode.trim()) {
      const success = await useReferralCode(inputCode.trim());
      if (success) {
        setInputCode('');
      }
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Referral Rewards</h1>
          <p className="text-muted-foreground">Invite friends and earn 24 hours of premium for each successful referral!</p>
        </div>

        {/* Premium Status */}
        {hasPremium && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-primary">
                <Gift className="h-5 w-5" />
                <span className="font-semibold">Premium Active</span>
                <Badge variant="secondary">
                  Expires {premiumExpiry?.toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Your Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Your Referral Code
              </CardTitle>
              <CardDescription>
                Share this code with friends to earn premium time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={userCode} readOnly className="font-mono text-lg" />
                <Button onClick={copyReferralLink} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Share this link: {window.location.origin}?ref={userCode}
              </div>
            </CardContent>
          </Card>

          {/* Use Referral Code */}
          <Card>
            <CardHeader>
              <CardTitle>Use Referral Code</CardTitle>
              <CardDescription>
                Enter a friend's referral code to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input 
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Enter referral code"
                  className="font-mono"
                />
                <Button onClick={handleUseCode} disabled={!inputCode.trim()}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{completedReferrals}</div>
                  <div className="text-sm text-muted-foreground">Successful Referrals</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{completedReferrals * 24}h</div>
                  <div className="text-sm text-muted-foreground">Premium Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{referrals.filter(r => r.status === 'pending').length}</div>
                  <div className="text-sm text-muted-foreground">Pending Referrals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-1">Share Your Code</h3>
                <p className="text-sm text-muted-foreground">Copy your unique referral code and share it with friends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-1">Friend Signs Up</h3>
                <p className="text-sm text-muted-foreground">Your friend uses your code when they join</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-1">Earn Premium</h3>
                <p className="text-sm text-muted-foreground">Get 24 hours of premium access for each successful referral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}