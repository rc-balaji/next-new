import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./data.json");

// Helper function to read JSON file
const readData = async () => {
  const jsonData = await fs.readFile(filePath);
  return JSON.parse(jsonData);
};

// Helper function to write to JSON file
const writeData = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// GET method handler
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const data = await readData();

    if (id) {
      const item = data.find((item) => item.id === parseInt(id));
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
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
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
  try {
    const newItem = await request.json(); // Use request.json() to parse the request body
    const data = await readData();
    newItem.id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    data.push(newItem);
    await writeData(data);

    return new Response(
      JSON.stringify({ message: "Item added successfully", newItem }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
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
  try {
    const updatedItem = await request.json(); // Use request.json() to parse the request body
    const data = await readData();
    const index = data.findIndex(
      (item) => item.id === parseInt(updatedItem.id)
    );

    if (index === -1) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    data[index] = updatedItem;
    await writeData(data);

    return new Response(
      JSON.stringify({ message: "Item updated successfully", updatedItem }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
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
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get("id"));
    const data = await readData();
    const newData = data.filter((item) => item.id !== id);

    if (data.length === newData.length) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeData(newData);

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
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
