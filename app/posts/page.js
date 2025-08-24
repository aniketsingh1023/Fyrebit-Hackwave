"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Image as ImageIcon,
  Video,
  MapPin,
  Hash,
  Loader2,
  X,
  Send,
  Eye,
  Clock,
  User,
  AlertCircle,
  Upload,
  Sparkles,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [error, setError] = useState("");

  // Create post form state
  const [newPost, setNewPost] = useState({
    caption: "",
    media: [],
    hashtags: [],
    location: "",
    type: "post",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [generateSuggestions, setGenerateSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const MinimalDoodles = () => (
    <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
      <div className="absolute top-20 left-10 w-8 h-8 border border-stone-400 rotate-45"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-stone-300 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-12 h-1 bg-stone-400"></div>
      <div className="absolute bottom-40 right-10 w-10 h-10 border border-stone-400 rounded-full"></div>
      <div className="absolute bottom-60 left-20 w-16 h-1 bg-stone-300"></div>
      <div className="absolute top-1/3 right-1/4 w-4 h-4 border border-stone-400"></div>
      <div className="absolute bottom-20 left-1/3 w-6 h-6 border border-stone-400 rotate-45"></div>

      <svg
        className="absolute top-32 left-1/2 w-24 h-24 stroke-stone-300 opacity-30"
        viewBox="0 0 100 100"
      >
        <path d="M10,50 L90,50" fill="none" strokeWidth="1" />
        <path d="M50,10 L50,90" fill="none" strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-40 left-1/4 w-20 h-20 stroke-stone-300 opacity-30"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="25" fill="none" strokeWidth="1" />
      </svg>
    </div>
  );

  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      if (data.success) {
        if (reset) {
          setPosts(data.posts || []);
        } else {
          setPosts((prev) => [...prev, ...(data.posts || [])]);
        }
        setHasMore(data.pagination?.hasMore || false);
        setPage(pageNum);

        // Initialize liked posts state
        if (session && data.posts) {
          const liked = new Set();
          data.posts.forEach((post) => {
            if (post.userInteraction?.isLiked) {
              liked.add(post._id);
            }
          });
          setLikedPosts((prev) => new Set([...prev, ...liked]));
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    if (!postId) return;

    try {
      setLoadingComments(true);
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();

      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setCreateError(
        "Some files were skipped. Only images and videos under 10MB are allowed."
      );
    }

    setMediaFiles(validFiles);
    setCreateError("");
  };

  const generateAISuggestions = async () => {
    if (mediaFiles.length === 0) {
      setCreateError(
        "Please upload media files first to generate suggestions."
      );
      return;
    }

    try {
      setLoadingSuggestions(true);
      const formData = new FormData();
      formData.append("media", mediaFiles[0]);
      formData.append("context", newPost.caption);
      formData.append("postType", newPost.type);

      const res = await fetch("/api/posts/suggestions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAiSuggestions(data.suggestions);
      } else {
        setCreateError(data.error || "Failed to generate suggestions");
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setCreateError("Failed to generate AI suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!session) return;

    if (!newPost.caption.trim() && mediaFiles.length === 0) {
      setCreateError("Please add content or media to your post.");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const formData = new FormData();
      formData.append("caption", newPost.caption);
      formData.append("location", newPost.location);
      formData.append("type", newPost.type);
      formData.append("hashtags", JSON.stringify(newPost.hashtags));
      formData.append("generateSuggestions", generateSuggestions);

      // Add media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      if (data.success) {
        setPosts((prev) => [data.post, ...prev]);
        setNewPost({
          caption: "",
          media: [],
          hashtags: [],
          location: "",
          type: "post",
        });
        setMediaFiles([]);
        setAiSuggestions(null);
        setCreateModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setCreateError(
        error.message || "Failed to create post. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();

      if (data.success) {
        const newLiked = new Set(likedPosts);
        if (data.liked) {
          newLiked.add(postId);
        } else {
          newLiked.delete(postId);
        }
        setLikedPosts(newLiked);

        // Update posts state
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? { ...post, likesCount: data.likesCount }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session || !selectedPost || !newComment.trim()) return;

    setPostingComment(true);
    try {
      const res = await fetch(`/api/posts/${selectedPost._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");

        // Update post comments count
        setPosts((prev) =>
          prev.map((post) =>
            post._id === selectedPost._id
              ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const extractHashtags = (text) => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
    return hashtags.map((tag) => tag.slice(1));
  };

  const handleCaptionChange = (text) => {
    setNewPost((prev) => ({
      ...prev,
      caption: text,
      hashtags: extractHashtags(text),
    }));
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(page + 1, false);
    }
  };

  const applySuggestion = (type, suggestion) => {
    if (type === "caption") {
      setNewPost((prev) => ({ ...prev, caption: suggestion }));
    }
  };

  const openPostDetails = (post) => {
    setSelectedPost(post);
    setDetailsModalOpen(true);
    fetchComments(post._id);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex items-center gap-3 text-stone-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="font-light">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-stone-100 relative">
      <MinimalDoodles />
      <Navigation />

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <Alert className="mb-6 bg-red-900/50 border-red-700 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-light mb-3 text-stone-200 tracking-wider">
                POSTS
              </h1>
              <div className="w-24 h-px bg-stone-500 mx-auto mb-4"></div>
              <p className="text-stone-400 text-sm font-light tracking-wide uppercase">
                Share Your Moments
              </p>
            </div>

            {session && (
              <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-stone-800 hover:bg-stone-900 text-stone-100 font-light py-3 px-6 transition-all duration-300 text-sm tracking-wider uppercase rounded-none">
                    <Plus size={16} className="mr-2" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border border-stone-700 text-stone-100 max-w-2xl max-h-[90vh] overflow-y-auto rounded-none">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-light tracking-wider text-stone-200">
                      Create Post
                    </DialogTitle>
                  </DialogHeader>

                  {createError && (
                    <Alert className="bg-red-900/50 border-red-700 text-red-100">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{createError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleCreatePost} className="space-y-6">
                    <div>
                      <Textarea
                        placeholder="What's on your mind? Use #hashtags..."
                        value={newPost.caption}
                        onChange={(e) => handleCaptionChange(e.target.value)}
                        className="min-h-32 bg-transparent border border-stone-700 text-stone-100 placeholder-stone-500 font-light focus:border-stone-500 resize-none rounded-none"
                      />
                      {newPost.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {newPost.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-stone-700 px-2 py-1 text-stone-200 font-light rounded-none"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Location"
                        value={newPost.location}
                        onChange={(e) =>
                          setNewPost((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="bg-transparent border border-stone-700 text-stone-100 placeholder-stone-500 font-light focus:border-stone-500 rounded-none"
                      />
                      <select
                        value={newPost.type}
                        onChange={(e) =>
                          setNewPost((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="bg-transparent border border-stone-700 px-3 py-2 text-stone-100 font-light focus:border-stone-500 focus:outline-none rounded-none"
                      >
                        <option
                          value="post"
                          className="bg-black text-stone-100"
                        >
                          Post
                        </option>
                        <option
                          value="reel"
                          className="bg-black text-stone-100"
                        >
                          Reel
                        </option>
                        <option
                          value="story"
                          className="bg-black text-stone-100"
                        >
                          Story
                        </option>
                      </select>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 px-4 py-2 cursor-pointer transition-colors rounded-none">
                          <Upload size={16} />
                          <span className="text-sm font-light">
                            Upload Media
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            className="hidden"
                          />
                        </label>

                        {mediaFiles.length > 0 && (
                          <Button
                            type="button"
                            onClick={generateAISuggestions}
                            disabled={loadingSuggestions}
                            className="bg-stone-700 hover:bg-stone-600 text-stone-100 font-light px-4 py-2 rounded-none"
                          >
                            {loadingSuggestions ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={16}
                                />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles size={16} className="mr-2" />
                                AI Suggestions
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {mediaFiles.length > 0 && (
                        <div className="text-sm text-stone-400 font-light">
                          {mediaFiles.length} file(s) selected
                        </div>
                      )}

                      {/* AI Suggestions */}
                      {aiSuggestions && (
                        <div className="bg-stone-900 border border-stone-700 p-4 rounded-none space-y-3">
                          <h4 className="font-light text-stone-200 flex items-center gap-2">
                            <Sparkles size={16} />
                            AI Suggestions
                          </h4>

                          {aiSuggestions.captions && (
                            <div>
                              <p className="text-sm font-light text-stone-300 mb-2">
                                Captions:
                              </p>
                              <div className="space-y-2">
                                {Object.entries(aiSuggestions.captions).map(
                                  ([type, captions]) => (
                                    <div key={type}>
                                      <p className="text-xs text-stone-500 uppercase font-light tracking-wide">
                                        {type}:
                                      </p>
                                      {captions.map((caption, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() =>
                                            applySuggestion("caption", caption)
                                          }
                                          className="block w-full text-left text-sm bg-stone-800 hover:bg-stone-700 p-2 rounded-none transition-colors font-light"
                                        >
                                          {caption}
                                        </button>
                                      ))}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {aiSuggestions.hashtags && (
                            <div>
                              <p className="text-sm font-light text-stone-300 mb-2">
                                Suggested Hashtags:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {aiSuggestions.hashtags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-stone-700 px-2 py-1 text-stone-200 rounded-none cursor-pointer hover:bg-stone-600 font-light"
                                    onClick={() => {
                                      const currentTags = newPost.hashtags;
                                      if (!currentTags.includes(tag)) {
                                        setNewPost((prev) => ({
                                          ...prev,
                                          hashtags: [...currentTags, tag],
                                        }));
                                      }
                                    }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateModalOpen(false)}
                        className="border-stone-700 text-stone-300 hover:text-stone-100 hover:border-stone-500 font-light px-6 py-3 rounded-none"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          creating ||
                          (!newPost.caption.trim() && mediaFiles.length === 0)
                        }
                        className="bg-stone-800 hover:bg-stone-900 text-stone-100 font-light px-6 py-3 disabled:opacity-50 rounded-none"
                      >
                        {creating ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Creating...
                          </>
                        ) : (
                          "Publish"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Masonry Posts Feed */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-24">
            <p className="text-stone-400 text-lg font-light">No posts yet</p>
            <p className="text-stone-600 mt-2 text-sm">
              Be the first to share something
            </p>
          </div>
        ) : (
          <>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
            >
              <Masonry gutter="24px">
                {posts.map((post) => (
                  <Card
                    key={post._id}
                    className="bg-stone-100 border border-stone-200 overflow-hidden hover:border-stone-300 transition-all duration-500 hover:shadow-lg hover:shadow-stone-900/20 cursor-pointer"
                    onClick={() => openPostDetails(post)}
                  >
                    <CardContent className="p-0">
                      {/* Media Display - Full Width at Top */}
                      {post.media && post.media.length > 0 && (
                        <div className="w-full">
                          {post.media.map((media, index) => (
                            <div
                              key={index}
                              className="w-full bg-stone-200 overflow-hidden"
                            >
                              {media.type === "image" ? (
                                <img
                                  src={media.url}
                                  alt="Post media"
                                  className="w-full h-auto object-cover"
                                />
                              ) : media.type === "video" ? (
                                <video
                                  src={media.url}
                                  className="w-full h-auto"
                                  poster={media.thumbnail}
                                />
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Header */}
                      <div className="p-4 flex items-center justify-between border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-300 rounded-full flex items-center justify-center">
                            {post.author?.profileImage ? (
                              <img
                                src={post.author.profileImage}
                                alt={post.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-stone-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-light text-stone-900 text-sm">
                              {post.author?.name ||
                                `${post.author?.firstName || ""} ${
                                  post.author?.lastName || ""
                                }`.trim() ||
                                "Unknown User"}
                            </h3>
                            <div className="flex items-center gap-1 text-stone-600 text-xs">
                              <Clock size={10} />
                              <span>{formatTimeAgo(post.createdAt)}</span>
                              {post.type !== "post" && (
                                <>
                                  <span>•</span>
                                  <span className="uppercase text-xs bg-stone-800 px-1.5 py-0.5 rounded-full text-stone-100 font-light">
                                    {post.type}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-stone-600 hover:text-stone-900 hover:bg-stone-200 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal size={14} />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="p-4 text-stone-900">
                        {post.caption && (
                          <p className="font-light leading-relaxed mb-3 text-sm line-clamp-4">
                            {post.caption}
                          </p>
                        )}

                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.hashtags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-stone-700 text-xs font-light hover:text-stone-900"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.hashtags.length > 3 && (
                              <span className="text-stone-500 text-xs font-light">
                                +{post.hashtags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {post.location && (
                          <div className="flex items-center gap-1 text-stone-600 text-xs mb-3">
                            <MapPin size={10} />
                            <span>{post.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="px-4 pb-4 border-t border-stone-200 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(post._id);
                              }}
                              className="flex items-center gap-1 text-stone-600 hover:text-red-500 transition-colors"
                            >
                              <Heart
                                size={14}
                                className={
                                  likedPosts.has(post._id) ||
                                  post.userInteraction?.isLiked
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }
                              />
                              <span className="text-xs font-light">
                                {post.likesCount || 0}
                              </span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openPostDetails(post);
                              }}
                              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                            >
                              <MessageCircle size={14} />
                              <span className="text-xs font-light">
                                {post.commentsCount || 0}
                              </span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                            >
                              <Share2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-stone-500">
                            <Eye size={12} />
                            <span className="text-xs font-light">
                              {post.viewsCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </Masonry>
            </ResponsiveMasonry>

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-12">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  className="border-stone-700 text-stone-300 hover:text-stone-100 hover:border-stone-500 font-light px-6 py-3 rounded-none"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="bg-black border border-stone-700 text-stone-100 max-w-4xl max-h-[80vh] overflow-y-auto rounded-none">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-light tracking-wider text-stone-200">
                  Post Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Post content */}
                <div className="border-b border-stone-700 pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-stone-600 rounded-full flex items-center justify-center">
                      {selectedPost.author?.profileImage ? (
                        <img
                          src={selectedPost.author.profileImage}
                          alt={selectedPost.author.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-stone-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-light text-stone-100">
                        {selectedPost.author?.name ||
                          `${selectedPost.author?.firstName || ""} ${
                            selectedPost.author?.lastName || ""
                          }`.trim() ||
                          "Unknown User"}
                      </h3>
                      <p className="text-stone-400 text-sm font-light">
                        {formatTimeAgo(selectedPost.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedPost.caption && (
                    <p className="text-stone-100 font-light leading-relaxed mb-4">
                      {selectedPost.caption}
                    </p>
                  )}

                  {selectedPost.hashtags &&
                    selectedPost.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPost.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-stone-400 text-sm font-light"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Media Display */}
                  {selectedPost.media && selectedPost.media.length > 0 && (
                    <div className="grid gap-2 mb-4">
                      {selectedPost.media.map((media, index) => (
                        <div
                          key={index}
                          className="bg-stone-700 rounded overflow-hidden"
                        >
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              alt="Post media"
                              className="w-full h-auto object-cover"
                            />
                          ) : media.type === "video" ? (
                            <video
                              src={media.url}
                              controls
                              className="w-full h-auto"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-light text-stone-100 flex items-center gap-2">
                    <MessageCircle size={18} />
                    Comments ({comments.length})
                  </h4>

                  {/* Comment Form */}
                  {session && (
                    <form onSubmit={handleCommentSubmit} className="flex gap-3">
                      <div className="w-8 h-8 bg-stone-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-stone-400" />
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="bg-transparent border-stone-600 text-stone-100 placeholder-stone-400 font-light focus:border-stone-500 rounded-none"
                        />
                        <Button
                          type="submit"
                          disabled={postingComment || !newComment.trim()}
                          size="sm"
                          className="bg-stone-800 hover:bg-stone-700 text-stone-100 px-3 rounded-none"
                        >
                          {postingComment ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {loadingComments ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        <span className="text-stone-400 font-light">
                          Loading comments...
                        </span>
                      </div>
                    ) : comments.length === 0 ? (
                      <p className="text-stone-500 text-sm text-center py-8 font-light">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <div className="w-8 h-8 bg-stone-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {comment.author?.profileImage ? (
                              <img
                                src={comment.author.profileImage}
                                alt={comment.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-stone-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-stone-800 px-3 py-2 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-light text-stone-100 text-sm">
                                  {comment.author?.name ||
                                    `${comment.author?.firstName || ""} ${
                                      comment.author?.lastName || ""
                                    }`.trim() ||
                                    "Unknown User"}
                                </h5>
                                <span className="text-stone-400 text-xs font-light">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                                {comment.isEdited && (
                                  <span className="text-stone-500 text-xs font-light">
                                    (edited)
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-200 text-sm font-light">
                                {comment.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                              <button className="hover:text-stone-200 font-light">
                                Like ({comment.likesCount || 0})
                              </button>
                              <button className="hover:text-stone-200 font-light">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="relative z-10 border-t border-stone-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-stone-500 text-xs font-light tracking-wider uppercase">
            Express • Connect • Share
          </p>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
