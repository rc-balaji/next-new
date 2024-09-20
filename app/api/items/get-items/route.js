import mongoose from "mongoose";
import Item from "../../models/Item";

const uri =
  "mongodb+srv://rcbalaji:07070707@cluster0.bbw2v33.mongodb.net/next-todo?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export async function GET(request) {
  await connectDB();
  console.log("Called ");

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log("ID " + id);

    const item = await Item.findById(id);

    console.log(item);
    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
