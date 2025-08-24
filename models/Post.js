// models/Post.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  width: Number,
  height: Number,
  mimeType: String,
  size: Number,
  duration: Number, // For videos
  thumbnail: String, // Video thumbnail URL
});

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const aiMetadataSchema = new mongoose.Schema({
  suggestedCaptions: [
    {
      text: String,
      confidence: Number,
      used: { type: Boolean, default: false },
    },
  ],
  suggestedHashtags: [String],
  contentAnalysis: {
    subjects: [String],
    colors: [String],
    mood: String,
    composition: String,
    quality: Number,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  model: {
    type: String,
    default: "gemini-1.5-flash",
  },
});

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caption: {
      type: String,
      maxLength: 2000,
    },
    media: {
      type: [mediaSchema],
      required: true,
      validate: {
        validator: function (media) {
          return media && media.length > 0;
        },
        message: "At least one media file is required",
      },
    },
    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
      maxLength: 100,
    },
    type: {
      type: String,
      enum: ["post", "reel", "story"],
      default: "post",
      index: true,
    },
    likes: {
      type: [likeSchema],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    votes: {
      type: [voteSchema],
      default: [],
    },
    votesCount: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    likesHidden: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
    aiMetadata: aiMetadataSchema,
    // Analytics
    engagement: {
      rate: { type: Number, default: 0 },
      lastCalculated: Date,
    },
    performance: {
      reach: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Don't expose sensitive AI metadata in public responses
        if (ret.aiMetadata && !doc.$locals?.includeAI) {
          delete ret.aiMetadata;
        }
        return ret;
      },
    },
  }
);

// Indexes for performance
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ isArchived: 1, type: 1, createdAt: -1 });

// Virtual for total engagement
postSchema.virtual("totalEngagement").get(function () {
  return this.likesCount + this.commentsCount + this.sharesCount;
});

// Instance methods
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

postSchema.methods.getVoteByUser = function (userId) {
  return this.votes.find((vote) => vote.user.toString() === userId.toString());
};

postSchema.methods.addLike = function (userId) {
  if (!this.isLikedBy(userId)) {
    this.likes.push({ user: userId });
    this.likesCount += 1;
  }
};

postSchema.methods.removeLike = function (userId) {
  const initialLength = this.likes.length;
  this.likes = this.likes.filter(
    (like) => like.user.toString() !== userId.toString()
  );
  if (this.likes.length < initialLength) {
    this.likesCount = Math.max(0, this.likesCount - 1);
  }
};

postSchema.methods.addVote = function (userId, voteType) {
  // Remove existing vote
  this.removeVote(userId);

  // Add new vote
  this.votes.push({ user: userId, type: voteType });

  if (voteType === "upvote") {
    this.votesCount.upvotes += 1;
  } else {
    this.votesCount.downvotes += 1;
  }
};

postSchema.methods.removeVote = function (userId) {
  const existingVote = this.getVoteByUser(userId);
  if (existingVote) {
    this.votes = this.votes.filter(
      (vote) => vote.user.toString() !== userId.toString()
    );
    if (existingVote.type === "upvote") {
      this.votesCount.upvotes = Math.max(0, this.votesCount.upvotes - 1);
    } else {
      this.votesCount.downvotes = Math.max(0, this.votesCount.downvotes - 1);
    }
  }
};

postSchema.methods.calculateEngagementRate = function () {
  if (this.viewsCount === 0) return 0;
  const totalEngagement =
    this.likesCount + this.commentsCount + this.sharesCount;
  this.engagement.rate = (totalEngagement / this.viewsCount) * 100;
  this.engagement.lastCalculated = new Date();
  return this.engagement.rate;
};

postSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < new Date();
};

// Static methods
postSchema.statics.findActive = function (conditions = {}) {
  return this.find({
    isArchived: false,
    ...conditions,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  });
};

postSchema.statics.findByHashtag = function (hashtag, limit = 20) {
  return this.findActive({ hashtags: hashtag.toLowerCase() })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "name profileImage firstName lastName");
};

postSchema.statics.getTrending = function (timeframe = 24, limit = 10) {
  const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);

  return this.findActive({ createdAt: { $gte: since } })
    .sort({
      likesCount: -1,
      commentsCount: -1,
      viewsCount: -1,
      createdAt: -1,
    })
    .limit(limit)
    .populate("author", "name profileImage firstName lastName");
};

// Pre-save middleware
postSchema.pre("save", function (next) {
  // Ensure counts are not negative
  this.likesCount = Math.max(0, this.likesCount);
  this.commentsCount = Math.max(0, this.commentsCount);
  this.viewsCount = Math.max(0, this.viewsCount);
  this.sharesCount = Math.max(0, this.sharesCount);
  this.votesCount.upvotes = Math.max(0, this.votesCount.upvotes);
  this.votesCount.downvotes = Math.max(0, this.votesCount.downvotes);

  // Calculate engagement rate if views changed
  if (
    this.isModified("viewsCount") ||
    this.isModified("likesCount") ||
    this.isModified("commentsCount") ||
    this.isModified("sharesCount")
  ) {
    this.calculateEngagementRate();
  }

  next();
});

// Post-save middleware for analytics
postSchema.post("save", function (doc, next) {
  // You can add analytics tracking here
  // Example: Track post creation, engagement changes, etc.
  next();
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
