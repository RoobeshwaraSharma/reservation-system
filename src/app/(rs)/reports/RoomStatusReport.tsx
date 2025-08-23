"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Home, Users, Calendar } from "lucide-react";

type RoomStatusData = {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  upcomingBookings: number;
  occupancyRate: number;
};

export function RoomStatusReport() {
  const [roomData, setRoomData] = useState<RoomStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch("/api/reports/room-status");
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Failed to fetch room status data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Room Status Report
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

  if (!roomData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Room Status Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>No room status data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Room Status Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Current Occupancy
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {roomData.occupancyRate}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {roomData.availableRooms}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Occupied</span>
            </div>
            <p className="text-lg font-semibold text-orange-600">
              {roomData.occupiedRooms}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <p className="text-lg font-semibold text-red-600">
              {roomData.maintenanceRooms}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="text-lg font-semibold text-blue-600">
              {roomData.upcomingBookings}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Rooms</span>
            <span className="text-lg font-semibold">{roomData.totalRooms}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
