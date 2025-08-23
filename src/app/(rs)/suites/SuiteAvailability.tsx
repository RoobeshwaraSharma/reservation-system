"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Calendar, DollarSign } from "lucide-react";

type Suite = {
  id: number;
  roomNumber: string;
  roomType: string;
  bedType: string;
  maxOccupants: number | null;
  maxChildren: number | null;
  status: string;
  ratePerNight: string | null;
  ratePerWeek: string | null;
  ratePerMonth: string | null;
};

export function SuiteAvailability() {
  const [suites, setSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const response = await fetch("/api/suites/available");
        if (response.ok) {
          const data = await response.json();
          setSuites(data);
        }
      } catch (error) {
        console.error("Failed to fetch suites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuites();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Occupied":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Suite Availability
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Suite Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suites.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No suites available
            </p>
          ) : (
            suites.map((suite) => (
              <div key={suite.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Suite {suite.roomNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {suite.bedType} • Max {suite.maxOccupants} adults,{" "}
                      {suite.maxChildren} children
                    </p>
                  </div>
                  <Badge className={getStatusColor(suite.status)}>
                    {suite.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Night: ${suite.ratePerNight || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Week: ${suite.ratePerWeek || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>Month: ${suite.ratePerMonth || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Suites: {suites.length}</span>
            <span>
              Available: {suites.filter((s) => s.status === "Available").length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
