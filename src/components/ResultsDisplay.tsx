
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacebookPage, FacebookPost } from "@/lib/mockData";
import { CalendarIcon, ThumbsUp, MessageSquare, Share2, Users, Heart } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ResultsDisplayProps {
  data: FacebookPage | null;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  if (!data) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{data.name}</span>
          <Badge>{data.category}</Badge>
        </CardTitle>
        <CardDescription>{data.description}</CardDescription>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center text-sm">
            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{data.followers.toLocaleString()} followers</span>
          </div>
          <div className="flex items-center text-sm">
            <Heart className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{data.likes.toLocaleString()} likes</span>
          </div>
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>Last updated: {format(new Date(data.lastUpdated), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posts">
          <TabsList className="mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="space-y-4">
              {data.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engagement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Posts</span>
                      <span className="font-medium">{data.posts.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Likes</span>
                      <span className="font-medium">
                        {Math.round(
                          data.posts.reduce((acc, post) => acc + post.likes, 0) / data.posts.length
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Comments</span>
                      <span className="font-medium">
                        {Math.round(
                          data.posts.reduce((acc, post) => acc + post.comments, 0) / data.posts.length
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Shares</span>
                      <span className="font-medium">
                        {Math.round(
                          data.posts.reduce((acc, post) => acc + post.shares, 0) / data.posts.length
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Page Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center text-muted-foreground">
                    Growth chart will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PostCard({ post }: { post: FacebookPost }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-2">{post.content}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="mr-1 h-4 w-4" />
              <span>{post.shares}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
