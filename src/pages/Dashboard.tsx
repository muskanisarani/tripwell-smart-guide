import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User as UserType, Session } from "@supabase/supabase-js";
import { Plane, Hotel, Calendar, Heart, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const categories = [
    { icon: Plane, label: "Flights", color: "bg-blue-500" },
    { icon: Hotel, label: "Hotels", color: "bg-green-500" },
    { icon: MapPin, label: "Packages", color: "bg-purple-500" },
  ];

  const quickLinks = [
    { icon: Calendar, label: "My Bookings" },
    { icon: MapPin, label: "Top Destinations" },
    { icon: Heart, label: "Wishlist" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="mx-auto max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hi, Welcome Back
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
            <User className="h-6 w-6" />
          </div>
        </div>

        <div className="mb-6 flex gap-2 rounded-2xl bg-muted/50 p-1.5">
          <div className="flex-1 flex items-center gap-2 px-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="flex-1 bg-transparent text-sm outline-none"
              onClick={() => navigate("/search")}
              readOnly
            />
          </div>
          <Button size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate("/search")}>
            +
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-foreground">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.label}
                className="flex cursor-pointer flex-col items-center gap-3 p-4 transition-all hover:shadow-md border-0"
                onClick={() => navigate("/search")}
              >
                <div className="rounded-xl bg-muted p-3">
                  <category.icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-medium">{category.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">Quick Links</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Card
                key={link.label}
                className="flex cursor-pointer flex-col items-center gap-3 p-4 transition-all hover:shadow-md border-0"
                onClick={() => navigate(link.label === "My Bookings" ? "/bookings" : "/search")}
              >
                <div className="rounded-xl bg-muted p-3">
                  <link.icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-medium text-center">{link.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav variant="user" />
    </div>
  );
};

export default Dashboard;
