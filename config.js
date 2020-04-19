module.exports = {
  type: "Vanilla", // Modify this if you forked the repo
  version: "0.0.1",
  brand: "CloudOS",
  // Configuration f
  leaf: {
    db: "sqlite:///fs.db",
    namespace: "filesystem",
    ref_namespace: "references",
    split: "/",
    prefix: "/"
  }
}
