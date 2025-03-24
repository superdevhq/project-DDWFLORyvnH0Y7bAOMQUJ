
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockScrapingHistory, mockPages } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";
import { FacebookPage } from "@/lib/mockData";

interface ScrapingHistoryProps {
  onViewResult: (data: FacebookPage) => void;
}

export function ScrapingHistory({ onViewResult }: ScrapingHistoryProps) {
  const handleViewResult = (pageId: string) => {
    const page = mockPages.find(p => p.id === pageId);
    if (page) {
      onViewResult(page);
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
        <div className="space-y-4">
          {mockScrapingHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.url}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(item.date), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={item.status === "completed" ? "default" : "destructive"}
                >
                  {item.status}
                </Badge>
                {item.status === "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewResult(item.pageId)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Retry</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
