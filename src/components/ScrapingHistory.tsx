
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { FacebookPage } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ScrapingHistoryProps {
  onViewResult: (data: FacebookPage) => void;
}

interface ScrapingHistoryItem {
  id: string;
  url: string;
  name: string;
  created_at: string;
  page_id: string;
}

export function ScrapingHistory({ onViewResult }: ScrapingHistoryProps) {
  const [history, setHistory] = useState<ScrapingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScrapingHistory();
  }, []);

  const fetchScrapingHistory = async () => {
    setLoading(true);
    try {
      // Fetch pages from the database
      const { data, error } = await supabase
        .from('facebook_pages')
        .select('id, url, name, page_id, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to load scraping history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (pageId: string) => {
    try {
      // Fetch page details
      const { data: pageData, error: pageError } = await supabase
        .from('facebook_pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (pageError) throw pageError;
      
      // Fetch posts for this page
      const { data: postsData, error: postsError } = await supabase
        .from('scraped_posts')
        .select('*')
        .eq('page_id', pageId)
        .order('post_date', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Format data to match our FacebookPage interface
      const formattedPage: FacebookPage = {
        id: pageData.id,
        name: pageData.name,
        category: pageData.category || "Unknown",
        followers: Math.floor(Math.random() * 50000) + 1000, // Simulated for now
        likes: Math.floor(Math.random() * 40000) + 800, // Simulated for now
        description: `Facebook page for ${pageData.name}`,
        lastUpdated: pageData.created_at,
        posts: postsData.map(post => ({
          id: post.facebook_post_id,
          content: post.content || "",
          date: post.post_date || new Date().toISOString(),
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0
        }))
      };
      
      onViewResult(formattedPage);
    } catch (error) {
      console.error("Error fetching page details:", error);
      toast({
        title: "Error",
        description: "Failed to load page details",
        variant: "destructive",
      });
    }
  };

  const handleRetry = async (url: string, pageId: string) => {
    try {
      toast({
        title: "Info",
        description: "Re-scraping page...",
      });

      console.log("Retrying scrape for URL:", url);
      
      // Call the edge function to re-scrape the page
      const { data, error } = await supabase.functions.invoke('scrape-facebook-page', {
        body: { url }
      });
      
      if (error) {
        console.error("Edge function retry error:", error);
        throw error;
      }
      
      console.log("Edge function retry response:", data);

      if (data) {
        toast({
          title: "Success",
          description: `Successfully re-scraped ${data.name}`,
        });
        fetchScrapingHistory(); // Refresh the list
      }
    } catch (error) {
      console.error("Error re-scraping:", error);
      toast({
        title: "Error",
        description: "Failed to re-scrape the page",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scraping History</CardTitle>
        <CardDescription>
          View your recent Facebook page scraping activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scraping history found. Try scraping a Facebook page first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.url}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>
                    completed
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewResult(item.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRetry(item.url, item.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Retry</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
