import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "document", "link"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
    },
    cloudinaryId: {
      type: String, // For Cloudinary file deletion
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const journeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a journey title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    targetDays: {
      type: Number,
      default: 30,
      min: [1, "Target days must be at least 1"],
      max: [365, "Target days cannot exceed 365"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    resources: {
      type: [resourceSchema],
      validate: {
        validator: function (resources) {
          return resources.length <= 20;
        },
        message: "Cannot have more than 20 resources per journey",
      },
    },
    // Notification tracking
    notificationSent: {
      type: Boolean,
      default: false,
    },
    reminderSent24h: {
      type: Boolean,
      default: false,
    },
    reminderSent1h: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: function () {
        return this.startDate > new Date() ? "pending" : "active";
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
journeySchema.index({ user: 1, isActive: 1 });
journeySchema.index({ user: 1, createdAt: -1 });
journeySchema.index({ startDate: 1, status: 1, notificationSent: 1 });

// Virtual for progress percentage
journeySchema.virtual("progressPercentage").get(function () {
  if (this.targetDays === 0) return 0;
  return Math.min(Math.round((this.totalDays / this.targetDays) * 100), 100);
});

// Method to add resource
journeySchema.methods.addResource = function (resourceData) {
  if (this.resources.length >= 20) {
    throw new Error("Maximum 20 resources allowed per journey");
  }
  this.resources.push(resourceData);
  return this.save();
};

// Method to remove resource
journeySchema.methods.removeResource = function (resourceId) {
  this.resources = this.resources.filter(
    (r) => r._id.toString() !== resourceId,
  );
  return this.save();
};

// Method to mark as completed
journeySchema.methods.markCompleted = function (completionNotes) {
  this.isActive = false;
  this.completedAt = new Date();
  if (completionNotes) {
    this.notes = completionNotes;
  }
  return this.save();
};

// Ensure virtuals are included in JSON
journeySchema.set("toJSON", { virtuals: true });
journeySchema.set("toObject", { virtuals: true });

const Journey = mongoose.model("Journey", journeySchema);

export default Journey;
