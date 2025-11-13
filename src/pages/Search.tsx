import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("destinations")
      .select("*")
      .order("rating", { ascending: false });
    
    if (data) {
      setDestinations(data);
    }
    setLoading(false);
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Where do you want to go?
        </h1>

        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                onClick={() => navigate(`/destination/${destination.id}`)}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    {destination.image_url ? (
                      <img
                        src={destination.image_url}
                        alt={destination.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-light">
                        <span className="text-2xl font-bold text-primary">
                          {destination.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.location}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="font-semibold">{destination.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({destination.total_reviews})
                        </span>
                      </div>
                      
                      <Button size="sm" className="bg-primary">
                        {destination.price ? `₹${destination.price}` : "Book Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredDestinations.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No destinations found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav variant="user" />
    </div>
  );
};

export default Search;
