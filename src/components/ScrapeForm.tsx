
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { FacebookPage } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScrapeFormProps {
  onScrapeComplete: (data: FacebookPage) => void;
}

export function ScrapeForm({ onScrapeComplete }: ScrapeFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a Facebook page URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Calling edge function with URL:", url);
      
      // Call the edge function to scrape the page
      const { data, error } = await supabase.functions.invoke('scrape-facebook-page', {
        body: { url }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      console.log("Edge function response:", data);
      
      if (data) {
        toast({
          title: "Success",
          description: `Successfully scraped ${data.name}`,
        });
        onScrapeComplete(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to scrape the page. Please check the URL and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Scraping error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrape Facebook Page</CardTitle>
        <CardDescription>
          Enter the URL of the Facebook page you want to scrape
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://www.facebook.com/pagename"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scrape
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Try these example URLs for demo:</p>
            <ul className="list-disc list-inside mt-1">
              <li>facebook.com/TechInnovations</li>
              <li>facebook.com/GreenEarthInitiative</li>
              <li>facebook.com/AnyPageName</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
