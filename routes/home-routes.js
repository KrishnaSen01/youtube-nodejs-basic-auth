const express = require("express");
const authMiddleware = require("../middleware/auth-middleware")
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => { // 'authMiddleware' is passed will act as handler
  const {username, userId, roles} = req.userInfo; // IMP => syntax of object destructuring in JavaScript.
  //Object destructuring is a syntax that lets you extract multiple properties from an object and assign them to variables in a single line.

  console.log("welcome route run");//my
  console.log({roles, userId, username});
  /*o/p like
  {
  roles: 'user',
  userId: '686193efc8aa93ea594452eb',
  username: 'Krishna Sen3'
}
  */
  console.log(username); //Krishna Sen3
  
  res.json({
    message: "Welcome to the home page",
    user: {
      _id: userId,
      name: username,
      roles: roles
    }
  });
});

module.exports = router;