import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Session } from "@supabase/supabase-js";
import { Calendar, MapPin, Users } from "lucide-react";

const MyBookings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
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
    const fetchBookings = async () => {
      if (user) {
        setLoading(true);
        const { data } = await supabase
          .from("bookings")
          .select(`
            *,
            destinations (
              name,
              location,
              image_url
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (data) {
          setBookings(data);
        }
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success";
      case "pending":
        return "bg-secondary";
      case "cancelled":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="mb-6 text-muted-foreground">
          View and manage your trip bookings
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    {booking.destinations?.image_url ? (
                      <img
                        src={booking.destinations.image_url}
                        alt={booking.destinations.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-light">
                        <span className="text-2xl font-bold text-primary">
                          {booking.destinations?.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <div>
                      <h3 className="font-bold text-foreground">
                        {booking.destinations?.name || "Destination"}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{booking.destinations?.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                          {new Date(booking.check_out_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{booking.number_of_travelers} Guests</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      {booking.status === "pending" && (
                        <Button size="sm" variant="outline">
                          Modify booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No bookings yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start exploring and book your dream destination!
            </p>
          </Card>
        )}
      </div>

      <BottomNav variant="user" />
    </div>
  );
};

export default MyBookings;
