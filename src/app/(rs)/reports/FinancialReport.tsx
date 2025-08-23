"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

type FinancialData = {
  totalRevenue: number;
  roomRevenue: number;
  serviceRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  averageRoomRate: number;
};

export function FinancialReport() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await fetch("/api/reports/financial");
        const data = await response.json();
        setFinancialData(data);
      } catch (error) {
        console.error("Failed to fetch financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!financialData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>No financial data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ${financialData.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Room Revenue</p>
            <p className="text-lg font-semibold">
              ${financialData.roomRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Service Revenue</p>
            <p className="text-lg font-semibold">
              ${financialData.serviceRevenue.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Avg Room Rate</p>
            <p className="text-lg font-semibold">
              ${financialData.averageRoomRate.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Payment Status
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  ${financialData.completedPayments.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm">
                  ${financialData.pendingPayments.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
