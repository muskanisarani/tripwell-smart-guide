import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Session } from "@supabase/supabase-js";
import { Plane, Hotel, Calendar, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
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
    <div className="min-h-screen bg-gradient-to-b from-primary-light/20 to-background pb-20">
      <div className="mx-auto max-w-md p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hi, Welcome Back
            </h1>
            <p className="mt-1 text-muted-foreground">
              {profile?.full_name || user?.email || "Traveler"}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => navigate("/search")}
          >
            <MapPin className="h-4 w-4" />
            Search
          </Button>
          <Button className="gap-2 bg-primary">
            <Plane className="h-4 w-4" />
            New Trip
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.label}
                className="flex cursor-pointer flex-col items-center gap-3 p-6 transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => navigate("/search")}
              >
                <div className={`rounded-full ${category.color} p-4`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium">{category.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Quick Links</h2>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Card
                key={link.label}
                className="flex cursor-pointer items-center gap-4 p-4 transition-all hover:shadow-md"
                onClick={() => navigate(link.label === "My Bookings" ? "/bookings" : "/search")}
              >
                <div className="rounded-full bg-primary-light p-3">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{link.label}</span>
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
