exports.single = (fieldName) => (req, res, next) => {
  req.file = { filename: "fake-image.jpg" };
  console.log(`upload.single('${fieldName}') middleware passed`);
  next();
};
