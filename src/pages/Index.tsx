
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { LoginForm } from "@/components/LoginForm";
import { ScrapeForm } from "@/components/ScrapeForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ScrapingHistory } from "@/components/ScrapingHistory";
import { FacebookPage } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, AlertCircle } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [scrapedData, setScrapedData] = useState<FacebookPage | null>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScrapedData(null);
  };

  const handleScrapeComplete = (data: FacebookPage) => {
    setScrapedData(data);
  };

  const handleViewResult = (data: FacebookPage) => {
    setScrapedData(data);
    setActivePage("dashboard");
  };

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {activePage === "dashboard" && (
            <div className="space-y-6">
              <ScrapeForm onScrapeComplete={handleScrapeComplete} />
              {scrapedData && <ResultsDisplay data={scrapedData} />}
            </div>
          )}

          {activePage === "history" && (
            <ScrapingHistory onViewResult={handleViewResult} />
          )}

          {activePage === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure your Facebook scraping preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="scraping">Scraping</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border rounded-md bg-yellow-50">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-sm">
                          This is a mock application. Settings are not functional yet.
                          <br />
                          Supabase integration will be added later for backend capabilities.
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        When Supabase is connected, this section will include:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                        <li>User preferences</li>
                        <li>Theme settings</li>
                        <li>Notification preferences</li>
                        <li>Data export options</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="scraping" className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Scraping settings will include:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                      <li>Data to collect (posts, comments, reactions)</li>
                      <li>Time range for scraping</li>
                      <li>Rate limiting options</li>
                      <li>Proxy settings</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="account" className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Account settings will include:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                      <li>Facebook account management</li>
                      <li>API key configuration</li>
                      <li>Usage statistics</li>
                      <li>Subscription management</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Layout>
  );
};

export default Index;
