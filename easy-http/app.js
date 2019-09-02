// EasyHTTP 2.0
const http = new EasyHTTP();

// Get Users
http
  .get("http://jsonplaceholder.typicode.com/users")
  .then(data => console.log(data))
  .catch(err => console.log(err));

// User data
const data = {
  name: "John",
  email: "john@test.com"
};

// Post user
http
  .post("http://jsonplaceholder.typicode.com/users", data)
  .then(data => console.log(data))
  .catch(err => console.log(err));

// Update user
http
  .put("http://jsonplaceholder.typicode.com/users/2", data)
  .then(data => console.log(data))
  .catch(err => console.log(err));

// Delete user
http
  .delete("http://jsonplaceholder.typicode.com/users/1")
  .then(data => console.log(data))
  .catch(err => console.log(err));

// EasyHTTP 1.0
// const http = new easyHTTP();
//
// // Get Posts
// http.get("http://jsonplaceholder.typicode.com/posts", function(err, posts) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(posts);
//   }
// });

// // Get Single Post
// http.get("http://jsonplaceholder.typicode.com/posts/1", function(err, posts) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(posts);
//   }
// });

// // Data
// const data = {
//   title: "Custom Post",
//   body: "This is a custom post"
// };

// // Post
// http.post("http://jsonplaceholder.typicode.com/posts", data, function(
//   err,
//   post
// ) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });

// // Update Post
// http.put("http://jsonplaceholder.typicode.com/posts/1", data, function(
//   err,
//   post
// ) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });

// // Delete Post
// http.delete("http://jsonplaceholder.typicode.com/posts/1", function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });
