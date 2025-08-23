"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Calendar, Users, TrendingUp } from "lucide-react";

type OccupancyData = {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  revenue: number;
};

export function DailyOccupancyReport() {
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        const response = await fetch("/api/reports/occupancy");
        const data = await response.json();
        setOccupancyData(data);
      } catch (error) {
        console.error("Failed to fetch occupancy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancyData();
  }, []);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayData = occupancyData.find(
    (data) => data.date === yesterday.toISOString().split("T")[0]
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Occupancy Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Daily Occupancy Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {yesterdayData ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Yesterday&apos;s Occupancy
              </span>
              <span className="text-2xl font-bold text-green-600">
                {yesterdayData.occupancyRate}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>
                {yesterdayData.occupiedRooms} / {yesterdayData.totalRooms} rooms
                occupied
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Revenue: ${yesterdayData.revenue.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No data available for yesterday</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
