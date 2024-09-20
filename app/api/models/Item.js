import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String, // Adjust according to your data structure
  description: String,
});

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;
