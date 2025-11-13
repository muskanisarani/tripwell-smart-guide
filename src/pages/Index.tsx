import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Calendar, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-accent">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/10 p-6 backdrop-blur-sm">
              <Plane className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="mb-4 text-5xl font-bold">
            Travel & Tourism Management
          </h1>
          <p className="mb-8 text-xl text-white/90">
            Discover, Plan, and Book Your Dream Destinations
          </p>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/register")}
            >
              Sign Up Free
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <MapPin className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-bold">Explore Destinations</h3>
              <p className="text-white/80">
                Discover amazing places around the world
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <Calendar className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-bold">Easy Booking</h3>
              <p className="text-white/80">
                Book your trips with just a few clicks
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <Shield className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-bold">Secure Payments</h3>
              <p className="text-white/80">
                Your transactions are safe and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
