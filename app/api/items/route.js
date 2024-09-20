import mongoose from "mongoose";
import Item from "./models/Item"; // Adjust path as necessary

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

// GET method handler
export async function GET(request) {
  await connectDB();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const item = await Item.findOne({ id: parseInt(id) });
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
    } else {
      const data = await Item.find({});
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
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

// POST method handler
export async function POST(request) {
  await connectDB();

  try {
    const newItem = await request.json();
    newItem.id = (await Item.countDocuments()) + 1; // Generate a new ID
    const item = new Item(newItem);
    await item.save();

    return new Response(
      JSON.stringify({ message: "Item added successfully", newItem: item }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("POST error:", error);
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

// PUT method handler
export async function PUT(request) {
  await connectDB();

  try {
    const updatedItem = await request.json();
    const item = await Item.findOneAndUpdate(
      { id: parseInt(updatedItem.id) },
      updatedItem,
      { new: true }
    );

    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Item updated successfully",
        updatedItem: item,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PUT error:", error);
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

// DELETE method handler
export async function DELETE(request) {
  await connectDB();

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get("id"));
    const item = await Item.findOneAndDelete({ id });

    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DELETE error:", error);
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
