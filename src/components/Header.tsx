import { HomeIcon, LogOut, CheckCircle, MenuIcon, Book } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { NavButton } from "@/components/NavButton";
import { ModeToggle } from "@/components/ModeToggle";
import { NavButtonMenu } from "./NavButtonMenu";

type Props = {
  isCustomer: boolean;
  isManager?: boolean;
};
export function Header({ isCustomer, isManager }: Props) {
  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20">
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <NavButton
            href={`${isCustomer ? "/reservations" : "/cico"}`}
            label="home"
            icon={HomeIcon}
          />
          <Link
            href={`${isCustomer ? "/reservations" : "/cico"}`}
            className="flex justify-center items-center gap-2 ml-0"
            title="home"
          >
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
              Hotel Reservation
            </h1>
          </Link>
        </div>
        <div className="flex items-center">
          {!isCustomer && (
            <NavButtonMenu
              icon={CheckCircle}
              label="Check In/Check Out"
              choices={[{ title: "Check In/Check Out", href: "/cico" }]}
            />
          )}
          {isCustomer && (
            <NavButtonMenu
              icon={Book}
              label="Customers Menu"
              choices={[
                { title: "Reservations", href: "/reservations" },
                { title: "Travel Company Booking", href: "/travel-company" },
              ]}
            />
          )}
          {!isCustomer && (
            <NavButtonMenu
              icon={Book}
              label="Hotel Menu"
              choices={[
                { title: "Reservations", href: "/reservations" },
                { title: "Suite Booking", href: "/suites" },
                { title: "Travel Company Booking", href: "/travel-company" },
              ]}
            />
          )}

          {!isCustomer && (
            <NavButtonMenu
              icon={MenuIcon}
              label="Hotel Menu"
              choices={[
                { title: "Rooms", href: "/rooms" },
                { title: "Services", href: "/services" },
                ...(isManager ? [{ title: "Reports", href: "/reports" }] : []),
              ]}
            />
          )}

          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label="LogOut"
            title="logOut"
            className="rounded-full"
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
