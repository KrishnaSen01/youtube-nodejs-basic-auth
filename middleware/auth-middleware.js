const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("auth middleware is called");//
  const authHeader = req.headers["authorization"];
  console.log("authHeader=", authHeader);//

  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);//
  // console.log(!token); //false

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
    });
  }

  console.log("after token res");//

  // decode this token
  try {
    //orginal(org)
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);
    /* decodedTokenInfo is like below object
    {
      userId: '686193b5c8aa93ea594452e2',
      username: 'Krishna Sen2',
      roles: 'admin',
      iat: 1752392213,
      exp: 1752394013
    }
    */
    req.userInfo = decodedTokenInfo;
    next();

    // //gemini (no need to write this inside the try catch block)
    // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedTokenInfo) => {
    //   if (err) return res.sendStatus(403); // Invalid token, forbidden

    //   // THIS IS THE LINE IN QUESTION!
    //   req.userInfo = decodedTokenInfo; // Attach decoded user info to the request object
    //   console.log("res.userInfo=",req.userInfo);
      
    //   next(); // Pass the request to the next middleware/route handler
    // });

  } catch (error) {
    console.log("error occured");
    return res.status(500).json({
      success: false,
      message: "Access denied. Error occured",
      Error: error,
    });
  }
};

module.exports = authMiddleware;
