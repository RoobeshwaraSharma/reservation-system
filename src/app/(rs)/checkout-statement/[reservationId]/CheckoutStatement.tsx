"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

type StatementData = {
  reservationId: number;
  customerName: string;
  customerEmail: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  isTravelCompany: boolean;
  travelCompanyName: string | null;
  rooms: Array<{
    roomNumber: string;
    roomType: string;
    bedType: string;
    ratePerNight: string | null;
    assignedDate: string | null;
    checkInTime: string | null;
    checkOutTime: string | null;
  }>;
  services: Array<{
    serviceName: string;
    chargePerPerson: string | null;
    totalCharge: string | null;
    assignDate: string | null;
  }>;
  billAmount: string;
  totalPaid: string;
  balance: string;
  totalServices: string;
  payments: Array<{
    amount: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
  }>;
  generatedAt: string;
  statementNumber: string;
};

export function CheckoutStatement({
  reservationId,
}: {
  reservationId: number;
}) {
  const [statementData, setStatementData] = useState<StatementData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const response = await fetch(
          `/api/checkout-statement/${reservationId}`
        );
        if (response.ok) {
          const data = await response.json();
          setStatementData(data);
        } else {
          console.error("Failed to fetch statement");
        }
      } catch (error) {
        console.error("Error fetching statement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();
  }, [reservationId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!statementData) return;

    const statementText = `
CHECKOUT STATEMENT
${statementData.statementNumber}

Customer: ${statementData.customerName}
Email: ${statementData.customerEmail}
Check-in: ${new Date(statementData.checkInDate).toLocaleDateString()}
Check-out: ${new Date(statementData.checkOutDate).toLocaleDateString()}
Status: ${statementData.status}

${
  statementData.isTravelCompany
    ? `Travel Company: ${statementData.travelCompanyName}`
    : ""
}

ROOMS:
${statementData.rooms
  .map(
    (room) => `- Room ${room.roomNumber} (${room.roomType}, ${room.bedType})`
  )
  .join("\n")}

SERVICES:
${statementData.services
  .map((service) => `- ${service.serviceName}: $${service.totalCharge}`)
  .join("\n")}

FINANCIAL SUMMARY:
Bill Amount: $${statementData.billAmount}
Total Paid: $${statementData.totalPaid}
Balance: $${statementData.balance}
Total Services: $${statementData.totalServices}

PAYMENTS:
${statementData.payments
  .map(
    (payment) =>
      `- $${payment.amount} (${payment.paymentMethod}) - ${payment.paymentStatus}`
  )
  .join("\n")}

Generated: ${new Date(statementData.generatedAt).toLocaleString()}
    `;

    const blob = new Blob([statementText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${reservationId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!statementData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load statement</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Checkout Statement</CardTitle>
              <p className="text-muted-foreground mt-1">
                {statementData.statementNumber}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer Information */}
      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{statementData.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{statementData.customerEmail}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Check-in Date</p>
            <p className="font-medium">
              {new Date(statementData.checkInDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Check-out Date</p>
            <p className="font-medium">
              {new Date(statementData.checkOutDate).toLocaleDateString()}
            </p>
          </div>
          {statementData.isTravelCompany && statementData.travelCompanyName && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Travel Company</p>
              <p className="font-medium">{statementData.travelCompanyName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rooms */}
      {statementData.rooms.length > 0 && (
        <Card className="print:shadow-none">
          <CardHeader>
            <CardTitle>Assigned Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statementData.rooms.map((room, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Room Number
                      </p>
                      <p className="font-medium">{room.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{room.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bed Type</p>
                      <p className="font-medium">{room.bedType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Rate/Night
                      </p>
                      <p className="font-medium">
                        {room.ratePerNight ? `$${room.ratePerNight}` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services */}
      {statementData.services.length > 0 && (
        <Card className="print:shadow-none">
          <CardHeader>
            <CardTitle>Additional Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statementData.services.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned:{" "}
                      {service.assignDate
                        ? new Date(service.assignDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${service.totalCharge || "0.00"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Bill Amount:</span>
              <span className="font-medium">${statementData.billAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Services:</span>
              <span className="font-medium">
                ${statementData.totalServices}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-medium text-green-600">
                ${statementData.totalPaid}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Balance:</span>
                <span
                  className={
                    parseFloat(statementData.balance) > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  ${statementData.balance}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      {statementData.payments.length > 0 && (
        <Card className="print:shadow-none">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statementData.payments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">${payment.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.paymentMethod} - {payment.paymentStatus}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <Card className="print:shadow-none">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          <p>
            Generated on {new Date(statementData.generatedAt).toLocaleString()}
          </p>
          <p>Thank you for choosing our hotel!</p>
        </CardContent>
      </Card>
    </div>
  );
}
