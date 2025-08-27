exports.createPost = (req, res) => {
  console.log("createPost called", req.body, req.file, req.user);
  res.status(201).json({ message: "Post created" });
};

exports.listPosts = (req, res) => {
  console.log("listPosts called", req.user);
  res.json([{ id: 1, title: "Post 1" }]);
};

exports.getPost = (req, res) => {
  console.log("getPost called", req.params.id);
  res.json({ id: req.params.id, title: "Sample Post" });
};

exports.updatePost = (req, res) => {
  console.log("updatePost called", req.params.id, req.body, req.file);
  res.json({ message: `Post ${req.params.id} updated` });
};

exports.deletePost = (req, res) => {
  console.log("deletePost called", req.params.id);
  res.json({ message: `Post ${req.params.id} deleted` });
};

exports.addComment = (req, res) => {
  console.log("addComment called", req.params.id, req.body.text);
  res.status(201).json({ message: `Comment added to post ${req.params.id}` });
};

exports.updateComment = (req, res) => {
  console.log(
    "updateComment called",
    req.params.postId,
    req.params.commentId,
    req.body.text
  );
  res.json({ message: `Comment ${req.params.commentId} updated` });
};

exports.deleteComment = (req, res) => {
  console.log("deleteComment called", req.params.postId, req.params.commentId);
  res.json({ message: `Comment ${req.params.commentId} deleted` });
};
