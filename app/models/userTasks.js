import mongoose from "mongoose";

const UserTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Low",
  },
  status: {
    type: String,
    enum: ["Pending", "Unable to Complete", "Completed"],
    default: "Pending",
  },
}, {
  timestamps: true, 
});

const UserTask = mongoose.models.Task || mongoose.model("Task", UserTaskSchema);
export default UserTask;
