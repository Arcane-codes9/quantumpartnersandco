
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const plans = [
  {
    name: 'Starter',
    minDeposit: 100,
    maxDeposit: 999,
    profit: '2% daily',
    duration: '7 days',
    features: [
      'Instant withdrawal',
      '24/7 support',
      'No hidden fees',
    ],
  },
  {
    name: 'Pro',
    minDeposit: 1000,
    maxDeposit: 9999,
    profit: '2.5% daily',
    duration: '14 days',
    features: [
      'Priority support',
      'Personal manager',
      'Advanced analytics',
    ],
  },
  {
    name: 'Elite',
    minDeposit: 10000,
    maxDeposit: 100000,
    profit: '3% daily',
    duration: '30 days',
    features: [
      'VIP support',
      'Custom strategies',
      'Exclusive webinars',
    ],
  },
];


export default function Plan() {
  const nav = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" /> Trade Plans
            </h1>
            <p className="text-muted-foreground">Choose the best plan for your trading goals</p>
          </div>
        </div>

        <Card className="crypto-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Available Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Plan</th>
                    <th className="py-2 px-4 text-left">Profit</th>
                    <th className="py-2 px-4 text-left">Duration</th>
                    <th className="py-2 px-4 text-left">Min Deposit</th>
                    <th className="py-2 px-4 text-left">Max Deposit</th>
                    <th className="py-2 px-4 text-left">Features</th>
                    <th className="py-2 px-4 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.name} className="border-b hover:bg-secondary/30">
                      <td className="py-2 px-4 font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" /> {plan.name}
                      </td>
                      <td className="py-2 px-4">{plan.profit}</td>
                      <td className="py-2 px-4">{plan.duration}</td>
                      <td className="py-2 px-4 font-mono">${plan.minDeposit.toLocaleString()}</td>
                      <td className="py-2 px-4 font-mono">${plan.maxDeposit.toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                          {plan.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4">
                        <Button size="sm" onClick={() => nav(`/trading?plan=${plan.name}`)}>Choose</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
