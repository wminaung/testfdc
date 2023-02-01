const url = "https://backend-ximy.vercel.app/data";
const fetchUserData = async () => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const showUserData = () => {
  fetchUserData()
    .then((data) => {
      const userData = document.getElementById("user");
      userData.innerHTML = "";
      data.forEach((user) => {
        userData.innerHTML += `
        <div class="card bg-light col-3 m-1 my-2 "  style="width: 16rem">
        <div class="card-body" >

        <div>  id : ${user.id};</div>
        <div> name : ${user.name};</div>
        <div> email : ${user.email};</div>
        <div> password : ${user.password};</div>
        <div> createAt : ${user.createdAt};</div>
        <div> updatedAt : ${user.updatedAt};</div>

<div>
        <button type="button" data-name=${user.name} data-email=${user.email} data-password=${user.password} data-id=${user.id} data-bs-toggle="modal" data-bs-target="#editModal"  class="btn btn-primary edit"> Edit </button>
        <button type="button" onclick="deleteUser('${user.id}')" class="btn btn-danger delete"> Delete </button>
        </div>
        </div>
      </div>`;
      });
    })
    .then(() => {
      ///////////////////////////////////////
      const editBtns = document.querySelectorAll(".edit");

      const editBtnEvent = async (id, name, email, password) => {
        const res = await fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            id,
            name,
            email,
            password,
          }),
        });

        const data = await res.json();
        if (data.status === "success") {
          const myModal = document.getElementById("editModal");
          const modal = bootstrap.Modal.getOrCreateInstance(myModal);
          modal.hide();
          showUserData();
        }
      };

      editBtns.forEach((editBtn) => {
        editBtn.addEventListener("click", () => {
          const nameEditInput = document.getElementById("edit-name");
          const emailEditInput = document.getElementById("edit-email");
          const passwordEditInput = document.getElementById("edit-password");
          console.log(editBtn.dataset);
          const { name, email, password, id } = editBtn.dataset;

          nameEditInput.value = name;
          emailEditInput.value = email;
          passwordEditInput.value = password;

          const updateUsersTag = document.querySelector("#updateUsers");

          updateUsersTag.addEventListener("click", () => {
            console.log("click update");
            editBtnEvent(
              id,
              nameEditInput.value,
              emailEditInput.value,
              passwordEditInput.value
            );
          });
        });
      });

      ///////////////////////////////////////
    });
};
showUserData();
const userFormData = document.querySelector("#userFormData");

const registerData = async (dataToServer) => {
  const serverResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dataToServer),
  });

  const data = await serverResponse.json();
  if (data.status === "success") {
    showUserData();
  }
};

userFormData.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  if (name === "" || email === "" || password === "") {
    alert("Hey put your all info");
    return;
  }
  const dataToServer = { name, email, password };
  registerData(dataToServer);
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
});

const deleteUser = async (deleteId) => {
  const serverResponse = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({ id: deleteId }),
  });

  const { status } = await serverResponse.json();
  if (status === "success") {
    showUserData();
  }
};

////////////// Write File //////////////////

const handleFileUpload = async () => {
  const fileInput = document.getElementById("file");

  console.log(fileInput.files[0]);
  const fileUploadUrl = "https://backend-ximy.vercel.app/fileUpload";
  const response = await fetch(fileUploadUrl, {
    method: "POST",

    body: fileInput.files[0],
  });

  const message = await response.json();
  console.log(message);
};
