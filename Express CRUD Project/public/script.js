const API_URL = "/api/users";

async function fetchUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    userList.innerHTML = "";

    if (!users || users.length === 0) {
      userList.innerHTML = "<li>No users found</li>";
      return;
    }

    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <small>${user._id}</small>
    `;

      userList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    userList.innerHTML = "<li>Error loading users</li>";
  }
}

async function storeUsers() {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
    });

    const data = await res.json();
    alert(data.message);
    fetchUsers();
  } catch (error) {
    alert("Error storing users");
  }
}

async function updateUser() {
  const id = document.getElementById("updateId").value.trim();
  const name = document.getElementById("updateName").value.trim();

  if (!id || !name) {
    alert("Please enter ID and new name");
    return;
  }

  try {
    await fetch(`${API_URL}/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    alert("User updated");
    fetchUsers();
  } catch (error) {
    alert("Update failed");
  }
}

async function deleteUser() {
  const id = document.getElementById("deleteId").value.trim();

  if (!id) {
    alert("Please enter ID");
    return;
  }

  try {
    await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });

    alert("User deleted");
    fetchUsers();
  } catch (error) {
    alert("Delete failed");
  }
}
