"use client";

import { useEffect, useState } from "react";
import styles from "./HomePage.module.css"; // Assuming CSS module approach
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editItem, setEditItem] = useState(null);
  const nav = useRouter();

  // Fetch all items
  const fetchItems = async () => {
    const response = await fetch("/api/items"); // Assuming your API route is /api/items
    const data = await response.json();

    console.log(data);

    setItems(data);
  };

  // Create a new item
  const handleCreate = async () => {
    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      setNewItem({ name: "", description: "" });
      fetchItems();
    }
  };

  // Edit an item
  const handleEdit = async () => {
    const response = await fetch("/api/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editItem),
    });
    if (response.ok) {
      setEditItem(null);
      fetchItems();
    }
  };

  // Delete an item
  const handleDelete = async (id) => {
    const response = await fetch(`/api/items?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchItems();
    }
  };

  // Handle edit click
  const handleEditClick = (item) => {
    setEditItem(item);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CRUD Operations with Local JSON</h1>

      {/* Create New Item */}
      <div className={styles.formContainer}>
        <h2>Create New Item</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
        />
        <button className={styles.createButton} onClick={handleCreate}>
          Create Item
        </button>
      </div>

      {/* Edit Item */}
      {editItem && (
        <div className={styles.formContainer}>
          <h2>Edit Item</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Description"
            value={editItem.description}
            onChange={(e) =>
              setEditItem({ ...editItem, description: e.target.value })
            }
          />
          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleEdit}>
              Save Changes
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setEditItem(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Item List */}
      <h2>Items</h2>
      <ul className={styles.itemList}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <strong>{item.name}:</strong> {item.description}
            <div className={styles.itemActions}>
              <button
                className={styles.editButton}
                onClick={() => handleEditClick(item)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
              <button onClick={() => nav.push(`/${item._id}`)}>
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
