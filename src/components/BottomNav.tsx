import { Home, Search, FileText, User } from "lucide-react";
import { NavLink } from "./NavLink";

interface BottomNavProps {
  variant?: "user" | "admin";
}

export const BottomNav = ({ variant = "user" }: BottomNavProps) => {
  const userLinks = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/bookings", icon: FileText, label: "Bookings" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin", icon: Home, label: "Dashboard" },
    { to: "/admin/destinations", icon: Search, label: "Destinations" },
    { to: "/admin/bookings", icon: FileText, label: "Bookings" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const links = variant === "admin" ? adminLinks : userLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-6 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            activeClassName="text-primary"
          >
            <link.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
