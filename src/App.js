import React, { useState, useEffect } from "react";
import "./App.css";
import BASE_URL from "./apiConfig";
import { fetchData, fetchCount, addTodo, updateTodo } from "./apiService";

function App() {
  const defaultText = "";
  const [inputValue, setInputValue] = useState(defaultText);
  const [data, setData] = useState([]);
  const [addCount, setAddCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    const fetchDataStartTime = new Date().getTime(); // Record start time for fetchData
    fetchData()
      .then((data) => {
        setData(data);
        const fetchDataEndTime = new Date().getTime(); // Record end time for fetchData
        const fetchDataExecutionTime = fetchDataEndTime - fetchDataStartTime; // Calculate execution time for fetchData
        console.log("fetchData execution time:", fetchDataExecutionTime + "ms");
      })
      .catch((error) => alert(error.message));

    const fetchCountStartTime = new Date().getTime(); // Record start time for fetchCount
    fetchCount()
      .then((countData) => {
        setAddCount(countData.addCount);
        setUpdateCount(countData.updateCount);
        const fetchCountEndTime = new Date().getTime(); // Record end time for fetchCount
        const fetchCountExecutionTime = fetchCountEndTime - fetchCountStartTime; // Calculate execution time for fetchCount
        console.log(
          "fetchCount execution time:",
          fetchCountExecutionTime + "ms"
        );
      })
      .catch((error) => alert(error.message));
  }, []);

  const enableEditing = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, editing: true } : item
      )
    );
  };

  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, title: value } : item
      )
    );
  };

  const handleUpdateClick = (id) => {
    const updatedItem = data.find((item) => item._id === id);
    const updateStartTime = new Date().getTime(); // Record start time for updateTodo
    updateTodo(id, updatedItem.title)
      .then((data) => {
        console.log("Success:", data);
        const updateEndTime = new Date().getTime(); // Record end time for updateTodo
        const updateExecutionTime = updateEndTime - updateStartTime; // Calculate execution time for updateTodo
        console.log("update execution time:", updateExecutionTime + "ms");
        setData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, editing: false } : item
          )
        );
        fetchCount(); // Fetch updated counts
        window.alert("Data updated successfully!"); // Display alert after successful update
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };

  const handleAddClick = () => {
    const addStartTime = new Date().getTime(); // Record start time for addTodo
    // Ensure there's some input before sending
    if (!inputValue.trim()) {
      alert("Please enter a title for your todo.");
      return;
    }

    addTodo(inputValue.trim())
      .then((data) => {
        console.log("Success:", data);
        setInputValue("");
        const addEndTime = new Date().getTime(); // Record end time for addTodo
        const addExecutionTime = addEndTime - addStartTime; // Calculate execution time for addTodo
        console.log("add execution time:", addExecutionTime + "ms");
        fetchData() // Fetch updated data
          .then((newData) => setData(newData)) // Update data state with the newly fetched data
          .catch((error) => alert(error.message)); // Handle any errors
        fetchCount(); // Fetch updated counts
        alert("Data added successfully!"); // Display alert when data is added
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };

  return (
    <div className="parent">
      <table className="table">
        <thead>
          <tr>
            <th>Table</th>
            <th>Action</th> {/* Add a column for the action button */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {/* Render an input field if editing is enabled, otherwise render plain text */}
              <td>
                {item.editing ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange(e, item._id)}
                  />
                ) : (
                  item.title
                )}
              </td>
              <td>
                {/* Toggle editing mode on clicking "Update" button */}
                {item.editing ? (
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateClick(item._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => enableEditing(item._id)}
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="both container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your todo"
        />
        <button className="add-btn" onClick={handleAddClick}>
          Add
        </button>
      </div>
      <div className="horizontal container"></div>

      <div className="vertical container">
        <p className="add-count">Add Count: {addCount}</p>
        <p className="update-count">Update Count: {updateCount}</p>
      </div>
    </div>
  );
}

export default App;
