const mongoose = require("mongoose");
const bcrypt= require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 name: {
  type: String,
  required: true
 },
 userName: {
  type: String,
  required: true,
  unique: true
 },
 email: {
  type: String,
  required: true,
  unique: true
 },
 password: {
  type: String,
  required: true
 },
 picture_url: {
  type: String,
  default: "https://res.cloudinary.com/codehackerone/image/upload/v1620454218/default_dp_ubrfcg.jpg",
  required: true
 },
 phoneNumber: {
  type: Number,
  unique: true
 },
 favorites: [{
  type: String
 }]
}, {
 timestamps: true
});

userSchema.pre("save", async function (next) {
 if (!this.isModified || !this.isNew) {
   next();
 } else this.isModified("password");
 if (this.password)
   this.password = await bcrypt.hash(String(this.password), 12);
 next();
});

let User = mongoose.model("User", userSchema);

module.exports = User;