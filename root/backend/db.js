import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  posts: { type: Array },
  pfp: { type: String },
  followers: { type: Array },
  following: { type: Array },
  password: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: Object },
  edited: { type: Boolean },
});

const UserModel = mongoose.model("Users", UserSchema);
const PostsModel = mongoose.model("Posts", PostSchema);

export { UserModel, PostsModel };
