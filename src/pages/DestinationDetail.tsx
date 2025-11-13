import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin } from "lucide-react";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Destination not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {destination.image_url ? (
          <img
            src={destination.image_url}
            alt={destination.name}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-primary-light">
            <span className="text-6xl font-bold text-primary">
              {destination.name.charAt(0)}
            </span>
          </div>
        )}
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-4 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="mx-auto max-w-md p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {destination.name}
          </h1>
          
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{destination.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-secondary text-secondary" />
              <span className="text-lg font-bold">{destination.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({destination.total_reviews} reviews)
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <Card className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {destination.description || "Discover this amazing destination and create unforgettable memories."}
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="amenities" className="mt-4">
            <Card className="p-6">
              <div className="flex flex-wrap gap-2">
                {destination.amenities?.length > 0 ? (
                  destination.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No amenities listed</p>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="itinerary" className="mt-4">
            <Card className="p-6">
              <p className="text-muted-foreground">
                Custom itinerary will be available soon
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4">
            <Card className="p-6">
              <p className="text-muted-foreground">
                Reviews will be displayed here
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <Button
          className="w-full bg-primary text-lg font-semibold"
          size="lg"
          onClick={() => navigate(`/booking/${destination.id}`)}
        >
          Book Now - ₹{destination.price || "12,000"}
        </Button>
      </div>
    </div>
  );
};

export default DestinationDetail;
