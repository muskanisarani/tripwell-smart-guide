import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const [travelerName, setTravelerName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [numberOfTravelers, setNumberOfTravelers] = useState("1");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

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
      if (session?.user) {
        setEmail(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    if (!id) return;
    
    const { data } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) {
      setDestination(data);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to make a booking");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        destination_id: id,
        traveler_name: travelerName,
        traveler_age: parseInt(age) || null,
        traveler_gender: gender,
        email,
        phone,
        number_of_travelers: parseInt(numberOfTravelers),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        payment_method: paymentMethod,
        total_amount: destination?.price ? parseFloat(destination.price) * parseInt(numberOfTravelers) : null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Booking created successfully!");
      navigate("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="mx-auto max-w-md">
        <div className="sticky top-0 z-10 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Booking / Payment</h1>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-6 p-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Traveler details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="travelerName">Traveler name</Label>
                <Input
                  id="travelerName"
                  placeholder="Enter traveler name"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Contact details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Travel details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="numberOfTravelers">Number of travelers</Label>
                <Input
                  id="numberOfTravelers"
                  type="number"
                  min="1"
                  value={numberOfTravelers}
                  onChange={(e) => setNumberOfTravelers(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Payment options</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi">UPI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet">Wallets</Label>
              </div>
            </RadioGroup>
          </Card>

          <Button
            type="submit"
            className="w-full bg-primary text-lg font-semibold"
            size="lg"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
