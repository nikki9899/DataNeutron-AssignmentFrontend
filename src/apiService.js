const BASE_URL = "https://dataneutron-assignmentbackend-2.onrender.com/";

export const fetchData = () => {
  return fetch(BASE_URL + "all")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to fetch data.");
    })
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Error fetching data. Please try again.");
    });
};

export const fetchCount = () => {
  return fetch(BASE_URL + "count")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to fetch count data.");
    })
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Error fetching count data. Please try again.");
    });
};

export const addTodo = (title) => {
  return fetch(BASE_URL + "add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newData: { title } }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
        
      }
      throw new Error("Failed to add new data.");
    })
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Error adding new todo. Please try again.");
    });
};

export const updateTodo = (id, title) => {
  return fetch(BASE_URL + `update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updatedData: { title } }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to update data.");
    })
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Error updating todo. Please try again.");
    });
};
