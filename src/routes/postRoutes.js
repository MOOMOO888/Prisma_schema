const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer
const { requireAuth } = require("../middleware/auth");
const postCtrl = require("../controllers/postController");

// posts
router.post("/", requireAuth, upload.single("image"), postCtrl.createPost);
router.get("/", requireAuth, postCtrl.listPosts);
router.get("/:id", requireAuth, postCtrl.getPost);
router.put("/:id", requireAuth, upload.single("image"), postCtrl.updatePost);
router.delete("/:id", requireAuth, postCtrl.deletePost);

// comments (REST fallback and persistence)
router.post("/:id/comments", requireAuth, postCtrl.addComment);
router.put("/:postId/comments/:commentId", requireAuth, postCtrl.updateComment);
router.delete(
  "/:postId/comments/:commentId",
  requireAuth,
  postCtrl.deleteComment
);

module.exports = router;
