
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut,
  Facebook
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ 
  children, 
  isLoggedIn, 
  onLogout, 
  activePage, 
  onNavigate 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Facebook className="h-6 w-6 text-[#1877f2]" />
            <h1 className="text-xl font-bold">FB Page Scraper</h1>
          </div>
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {isLoggedIn && (
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
            <nav className="p-4 space-y-2">
              <Button
                variant={activePage === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onNavigate("dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activePage === "history" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onNavigate("history")}
              >
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button
                variant={activePage === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onNavigate("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </aside>
        )}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Facebook Page Scraper - For educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}
