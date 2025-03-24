
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

interface FacebookPost {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  image_url?: string;
}

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  followers: number;
  likes: number;
  description: string;
  posts: FacebookPost[];
  lastUpdated: string;
}

// This would be replaced with actual scraping logic
function simulateScraping(url: string): Promise<FacebookPage | null> {
  return new Promise((resolve) => {
    // Check if URL is valid
    if (!url.includes('facebook.com/') && !url.includes('fb.com/')) {
      resolve(null);
      return;
    }
    
    // Extract page name from URL
    const pageName = url.split('/').pop() || '';
    const pageId = `fb_${Date.now()}`;
    
    // Create a simulated page
    const page: FacebookPage = {
      id: crypto.randomUUID(),
      name: pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      category: Math.random() > 0.5 ? "Business" : "Community",
      followers: Math.floor(Math.random() * 50000) + 1000,
      likes: Math.floor(Math.random() * 40000) + 800,
      description: `This is a simulated page for ${pageName}. In a real implementation, this would be scraped from Facebook.`,
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
    
    // Simulate network delay
    setTimeout(() => {
      resolve(page);
    }, 2000);
  });
}

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

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Simulate scraping the Facebook page
    const scrapedPage = await simulateScraping(url)
    
    if (!scrapedPage) {
      return new Response(
        JSON.stringify({ error: 'Failed to scrape page. Invalid URL or page not accessible.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Store the page in the database
    const { data: savedPage, error: pageError } = await supabaseClient
      .from('facebook_pages')
      .insert([{
        page_id: scrapedPage.id,
        name: scrapedPage.name,
        url: url,
        category: scrapedPage.category,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (pageError) {
      throw pageError
    }
    
    // Store each post
    for (const post of scrapedPage.posts) {
      const { error: postError } = await supabaseClient
        .from('scraped_posts')
        .insert([{
          facebook_post_id: post.id,
          page_id: savedPage.id,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          post_date: post.date,
          created_at: new Date().toISOString()
        }])
      
      if (postError) {
        console.error('Error saving post:', postError)
      }
    }
    
    // Add default scraping config
    const { error: configError } = await supabaseClient
      .from('scraping_configs')
      .insert([{
        page_id: savedPage.id,
        frequency: 'daily',
        data_points: ['posts', 'likes', 'comments'],
        depth: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (configError) {
      console.error('Error saving config:', configError)
    }
    
    // Update scraping stats (if user is authenticated)
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (user) {
      // Check if stats exist for this user
      const { data: existingStats } = await supabaseClient
        .from('scraping_stats')
        .select('id, total_pages, total_posts')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (existingStats) {
        // Update existing stats
        await supabaseClient
          .from('scraping_stats')
          .update({
            total_pages: (existingStats.total_pages || 0) + 1,
            total_posts: (existingStats.total_posts || 0) + scrapedPage.posts.length,
            last_scraped: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStats.id)
      } else {
        // Create new stats
        await supabaseClient
          .from('scraping_stats')
          .insert([{
            user_id: user.id,
            total_pages: 1,
            total_posts: scrapedPage.posts.length,
            last_scraped: new Date().toISOString(),
            success_rate: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
      }
    }
    
    // Return the saved page with its posts
    return new Response(
      JSON.stringify({
        id: savedPage.id,
        name: scrapedPage.name,
        category: scrapedPage.category,
        followers: scrapedPage.followers,
        likes: scrapedPage.likes,
        description: scrapedPage.description,
        posts: scrapedPage.posts,
        lastUpdated: scrapedPage.lastUpdated
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in scrape-facebook-page:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
