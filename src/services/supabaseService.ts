
import { supabase } from "@/integrations/supabase/client";
import { FacebookPage, FacebookPost } from "@/lib/mockData";
import { v4 as uuidv4 } from 'uuid';

// Facebook Pages
export const addFacebookPage = async (pageData: {
  page_id: string;
  name: string;
  url: string;
  category?: string;
  user_id?: string;
}) => {
  const { data, error } = await supabase
    .from('facebook_pages')
    .insert([
      {
        ...pageData,
        is_configured: false,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0];
};

export const getFacebookPages = async (userId?: string) => {
  let query = supabase
    .from('facebook_pages')
    .select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const getFacebookPageById = async (id: string) => {
  const { data, error } = await supabase
    .from('facebook_pages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Scraped Posts
export const addScrapedPost = async (postData: {
  facebook_post_id: string;
  page_id: string;
  content?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  post_date?: string;
  image_url?: string;
}) => {
  const { data, error } = await supabase
    .from('scraped_posts')
    .insert([
      {
        ...postData,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0];
};

export const getPostsByPageId = async (pageId: string) => {
  const { data, error } = await supabase
    .from('scraped_posts')
    .select('*')
    .eq('page_id', pageId)
    .order('post_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Scraping Configs
export const addScrapingConfig = async (configData: {
  page_id: string;
  frequency: string;
  data_points: string[];
  depth: number;
  start_date?: string;
  end_date?: string;
}) => {
  const { data, error } = await supabase
    .from('scraping_configs')
    .insert([
      {
        ...configData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0];
};

export const getScrapingConfigByPageId = async (pageId: string) => {
  const { data, error } = await supabase
    .from('scraping_configs')
    .select('*')
    .eq('page_id', pageId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
};

// Scraping Stats
export const updateScrapingStats = async (userId: string, stats: {
  total_pages?: number;
  total_posts?: number;
  last_scraped?: string;
  next_scheduled?: string;
  success_rate?: number;
}) => {
  // First check if stats exist for this user
  const { data: existingStats } = await supabase
    .from('scraping_stats')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (existingStats) {
    // Update existing stats
    const { data, error } = await supabase
      .from('scraping_stats')
      .update({
        ...stats,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingStats.id)
      .select();
    
    if (error) throw error;
    return data?.[0];
  } else {
    // Create new stats
    const { data, error } = await supabase
      .from('scraping_stats')
      .insert([
        {
          user_id: userId,
          ...stats,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) throw error;
    return data?.[0];
  }
};

export const getScrapingStatsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('scraping_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Simulated scraping function (will be replaced by edge function)
export const simulateScrapeFacebookPage = async (url: string): Promise<FacebookPage | null> => {
  // For now, we'll use our mock data but store it in the database
  const isValidUrl = url.includes('facebook.com/') || url.includes('fb.com/');
  
  if (!isValidUrl) {
    return null;
  }
  
  // Extract page name from URL
  const pageName = url.split('/').pop() || '';
  const pageId = `fb_${Date.now()}`;
  
  // Create a simulated page
  const page: FacebookPage = {
    id: uuidv4(),
    name: pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
    category: Math.random() > 0.5 ? "Business" : "Community",
    followers: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 40000) + 800,
    description: `This is a simulated page for ${pageName}. Real scraping will be implemented with the edge function.`,
    lastUpdated: new Date().toISOString(),
    posts: []
  };
  
  // Generate 3-5 random posts
  const postCount = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < postCount; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const postDate = new Date();
    postDate.setDate(postDate.getDate() - daysAgo);
    
    const post: FacebookPost = {
      id: `post_${i}_${Date.now()}`,
      content: getRandomPostContent(page.name),
      date: postDate.toISOString(),
      likes: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 100) + 5,
      shares: Math.floor(Math.random() * 50) + 1
    };
    
    page.posts.push(post);
  }
  
  // Sort posts by date (newest first)
  page.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  try {
    // Store the page in the database
    const savedPage = await addFacebookPage({
      page_id: pageId,
      name: page.name,
      url: url,
      category: page.category
    });
    
    // Store each post
    if (savedPage) {
      for (const post of page.posts) {
        await addScrapedPost({
          facebook_post_id: post.id,
          page_id: savedPage.id,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          post_date: post.date
        });
      }
      
      // Add default scraping config
      await addScrapingConfig({
        page_id: savedPage.id,
        frequency: 'daily',
        data_points: ['posts', 'likes', 'comments'],
        depth: 10
      });
      
      // Return the page with its posts
      return {
        ...page,
        id: savedPage.id
      };
    }
  } catch (error) {
    console.error("Error saving scraped data:", error);
  }
  
  return page;
};

// Helper function to generate random post content
function getRandomPostContent(pageName: string): string {
  const templates = [
    `Check out our latest updates! #${pageName.replace(/\s+/g, '')}`,
    `Thank you to all our followers for your continued support! We couldn't do this without you.`,
    `We're excited to announce some big changes coming soon. Stay tuned for more information!`,
    `Happy to share that we've reached a new milestone. Thanks to everyone who made this possible!`,
    `Looking for feedback on our recent changes. Let us know what you think in the comments below!`,
    `Join us this weekend for a special event. We'd love to see you there!`,
    `New product alert! We've just launched something we think you'll love.`,
    `Throwback to when we first started this journey. How time flies!`,
    `Congratulations to our team for their hard work on our latest project.`,
    `We're hiring! Check out our website for more details on open positions.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}
