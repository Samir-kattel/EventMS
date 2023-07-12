// define auth middleware
 const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, "secretkey");
    User.findOne({ _id: decoded._id, "sessions.token": token }, (err, user) => {
      if (err || !user) return res.status(401).send("Access denied");

      req.user = user;
      next();
    });
  } catch (e) {
    res.status(400).send("Invalid token");
  }
};

module.exports = authMiddleware;