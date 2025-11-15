import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserType, Session } from "@supabase/supabase-js";
import { Plane, Hotel, Calendar, Heart, MapPin, User, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        setProfile(profileData);

        // Fetch recent bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select(`
            *,
            destinations (*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);
        
        setBookings(bookingsData || []);

        // Fetch popular destinations
        const { data: destinationsData } = await supabase
          .from("destinations")
          .select("*")
          .order("rating", { ascending: false })
          .limit(6);
        
        setDestinations(destinationsData || []);
        
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const upcomingTrips = bookings.filter(
    (booking) => new Date(booking.check_in_date) > new Date()
  ).length;

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (booking.total_amount || 0),
    0
  );

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
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-20">
      <div className="mx-auto max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hi, {profile?.full_name || "Traveler"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ready for your next adventure?
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <User className="h-7 w-7" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{bookings.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Trips</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{upcomingTrips}</div>
              <div className="text-xs text-muted-foreground mt-1">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground mt-1">Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 rounded-2xl bg-card shadow-md p-2">
          <div className="flex-1 flex items-center gap-2 px-3">
            <MapPin className="h-5 w-5 text-primary" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onClick={() => navigate("/search")}
              readOnly
            />
          </div>
          <Button size="icon" className="h-10 w-10 rounded-xl shadow-sm" onClick={() => navigate("/search")}>
            <MapPin className="h-5 w-5" />
          </Button>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/bookings")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/booking/${booking.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={booking.destinations?.image_url || "/placeholder.svg"}
                        alt={booking.destinations?.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {booking.destinations?.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{booking.destinations?.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(booking.check_in_date).toLocaleDateString()}</span>
                        </div>
                        <Badge className="mt-2" variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">Book by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card
                key={category.label}
                className="flex cursor-pointer flex-col items-center gap-3 p-4 transition-all hover:shadow-lg border-0 shadow-md"
                onClick={() => navigate("/search")}
              >
                <div className={`rounded-xl ${category.color} p-3 text-white`}>
                  <category.icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-medium text-center">{category.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Popular Destinations</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/search")}>
              See All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {destinations.slice(0, 4).map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/destination/${destination.id}`)}
              >
                <div className="relative">
                  <img
                    src={destination.image_url || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ {destination.rating}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{destination.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-primary">
                      ${destination.price}/night
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Card
                key={link.label}
                className="flex cursor-pointer flex-col items-center gap-3 p-4 transition-all hover:shadow-lg border-0 shadow-md"
                onClick={() => navigate(link.label === "My Bookings" ? "/bookings" : "/search")}
              >
                <div className="rounded-xl bg-primary/10 p-3">
                  <link.icon className="h-7 w-7 text-primary" />
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
