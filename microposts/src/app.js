import { http } from "./http";
import { ui } from "./ui";

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getPosts);

// listen for add post
document.querySelector(".post-submit").addEventListener("click", submitPost);

// listen for delete post
document.querySelector("#posts").addEventListener("click", deletePost);

// listen for edit state
document.querySelector("#posts").addEventListener("click", enableEdit);

// listen for cancel
document.querySelector(".card-form").addEventListener("click", cancelEdit);

// get posts
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then(data => ui.showPosts(data))
    .catch(console.log);
}

// submit post
function submitPost() {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const id = document.querySelector("#id").value;

  const data = {
    title,
    body
  };

  // validate input
  if (title === "" || body === "") {
    ui.showAlert("Please fill in all fields!", "alert alert-danger");
  } else {
    // check for id
    if (id === "") {
      // create post
      http
        .post("http://localhost:3000/posts", data)
        .then(data => {
          ui.showAlert("Post added", "alert alert-success");
          ui.clearFields();
          getPosts();
        })
        .catch(console.log);
    } else {
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
          ui.showAlert("Post updated", "alert alert-success");
          ui.changeFormState();
          getPosts();
        })
        .catch(console.log);
    }
  }
}

// delete post
function deletePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.dataset.id;
    if (confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert("Post removed", "alert alert-success");
          getPosts();
        })
        .catch(console.log);
    }
  }
}

// enable edit state
function enableEdit(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("edit")) {
    const id = e.target.parentElement.dataset.id;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;

    const data = {
      id,
      title,
      body
    };

    // fill form
    ui.fillForm(data);
  }
}

// cancel edit state
function cancelEdit(e) {
  e.preventDefault();
  if (e.target.classList.contains("post-cancel")) {
    ui.changeFormState("add");
  }
}
