
export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  followers: number;
  likes: number;
  description: string;
  posts: FacebookPost[];
  lastUpdated: string;
}

export interface FacebookPost {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export const mockPages: FacebookPage[] = [
  {
    id: "123456789",
    name: "Tech Innovations",
    category: "Technology Company",
    followers: 25430,
    likes: 24890,
    description: "Leading the way in technology innovation and digital transformation.",
    lastUpdated: new Date().toISOString(),
    posts: [
      {
        id: "post1",
        content: "Excited to announce our new AI-powered platform launching next month! Stay tuned for more details. #TechInnovation #AI",
        date: "2023-05-15T14:30:00Z",
        likes: 342,
        comments: 56,
        shares: 78
      },
      {
        id: "post2",
        content: "Our team is growing! We're looking for talented developers to join our mission. Apply through the link in bio. #Hiring #TechJobs",
        date: "2023-05-10T09:15:00Z",
        likes: 189,
        comments: 23,
        shares: 45
      },
      {
        id: "post3",
        content: "Check out our CEO's interview on the future of technology and sustainable innovation. Link in comments!",
        date: "2023-05-05T16:45:00Z",
        likes: 267,
        comments: 34,
        shares: 62
      }
    ]
  },
  {
    id: "987654321",
    name: "Green Earth Initiative",
    category: "Environmental Organization",
    followers: 18750,
    likes: 18200,
    description: "Working together for a sustainable future and a healthier planet.",
    lastUpdated: new Date().toISOString(),
    posts: [
      {
        id: "post1",
        content: "Join us this Saturday for our beach cleanup event! Bring friends and family to help protect our oceans. #CleanBeaches #Environment",
        date: "2023-05-14T10:00:00Z",
        likes: 423,
        comments: 87,
        shares: 112
      },
      {
        id: "post2",
        content: "Our new report on renewable energy adoption is now available. Download it for free on our website! #RenewableEnergy #ClimateAction",
        date: "2023-05-08T13:20:00Z",
        likes: 256,
        comments: 42,
        shares: 89
      },
      {
        id: "post3",
        content: "Thank you to all volunteers who participated in yesterday's tree planting event. Together we planted over 500 trees! 🌳 #Reforestation",
        date: "2023-05-02T18:30:00Z",
        likes: 512,
        comments: 76,
        shares: 134
      }
    ]
  }
];

export const mockScrapingHistory = [
  {
    id: "scrape1",
    url: "facebook.com/TechInnovations",
    date: "2023-05-15T14:30:00Z",
    status: "completed",
    pageId: "123456789"
  },
  {
    id: "scrape2",
    url: "facebook.com/GreenEarthInitiative",
    date: "2023-05-14T10:00:00Z",
    status: "completed",
    pageId: "987654321"
  },
  {
    id: "scrape3",
    url: "facebook.com/DigitalArtists",
    date: "2023-05-10T09:15:00Z",
    status: "failed",
    error: "Page not accessible"
  }
];

// Simulate a login process
export const mockLogin = (username: string, password: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username && password) {
        resolve({ success: true, message: "Login successful" });
      } else {
        resolve({ success: false, message: "Invalid credentials" });
      }
    }, 1500);
  });
};

// Simulate a scraping process
export const mockScrapePage = (url: string): Promise<FacebookPage | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url.includes("TechInnovations")) {
        resolve(mockPages[0]);
      } else if (url.includes("GreenEarthInitiative")) {
        resolve(mockPages[1]);
      } else if (Math.random() > 0.3) {
        // Randomly return one of the mock pages for other URLs
        resolve(mockPages[Math.floor(Math.random() * mockPages.length)]);
      } else {
        resolve(null);
      }
    }, 2000);
  });
};
