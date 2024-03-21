import React, { useState, useEffect } from "react";
import "./App.css";
import BASE_URL from "./apiConfig";

function App() {
  const defaultText = "";
  const [inputValue, setInputValue] = useState(defaultText);
  const [data, setData] = useState([]);
  const [addCount, setAddCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    fetchData();
    fetchCount();
  }, []);

  const fetchData = () => {
    fetch(BASE_URL + "all") // Use BASE_URL instead of hard-coded URL
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch data.");
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error fetching data. Please try again.");
      });
  };

  const fetchCount = () => {
    fetch(BASE_URL + "count") // Use BASE_URL instead of hard-coded URL
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch count data.");
      })
      .then((countData) => {
        setAddCount(countData.addCount);
        setUpdateCount(countData.updateCount);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error fetching count data. Please try again.");
      });
  };

  const enableEditing = (id) => {
    setData(prevData => prevData.map(item => item._id === id ? { ...item, editing: true } : item));
  };
  
  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setData(prevData => prevData.map(item => item._id === id ? { ...item, title: value } : item));
  };
  
  const handleUpdateClick = (id) => {
    const updatedItem = data.find(item => item._id === id);
    
    // Send the updated data to the backend using PUT
    fetch(BASE_URL + `update/${id}`, { // Use BASE_URL instead of hard-coded URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedData: { title: updatedItem.title } }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to update data.');
      })
      .then(data => {
        console.log('Success:', data);
        // After successfully updating, disable editing mode
        setData(prevData => prevData.map(item => item._id === id ? { ...item, editing: false } : item));
        fetchCount(); // Fetch updated counts
        window.alert('Data updated successfully!'); // Display alert after successful update
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating todo. Please try again.');
      });
  };

  const handleAddClick = () => {
    // Ensure there's some input before sending
    if (!inputValue.trim()) {
      alert("Please enter a title for your todo.");
      return;
    }

    // Construct the data in the format your backend expects
    const dataToSend = { newData: { title: inputValue.trim() } };

    // Send the data to the backend using POST
    fetch(BASE_URL + "add", { // Use BASE_URL instead of hard-coded URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.ok) {
          setInputValue("")
          return response.json();
          
        }
        // Handle HTTP errors
        throw new Error("Failed to add new data.");
      })
      .then((data) => {
        console.log("Success:", data);
        fetchData(); // Fetch updated data
        fetchCount(); // Fetch updated counts
        alert("Data added successfully!"); // Display alert when data is added
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error adding new todo. Please try again.");
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
              <td>{item.editing ? <input type="text" value={item.title} onChange={(e) => handleInputChange(e, item._id)} /> : item.title}</td>
              <td>
                {/* Toggle editing mode on clicking "Update" button */}
                {item.editing ? (
                  <button className="update-btn" onClick={() => handleUpdateClick(item._id)}>Save</button>
                ) : (
                  <button className="edit-btn" onClick={() => enableEditing(item._id)}>Update</button>
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
        <button className="add-btn" onClick={handleAddClick}>Add</button>
      </div>
      <div className="horizontal container">
        
        </div>
  
      <div className="vertical container">
      <p className="add-count">Add Count: {addCount}</p>
        <p className="update-count">Update Count: {updateCount}</p>
      </div>
    </div>
  );
}

export default App;
