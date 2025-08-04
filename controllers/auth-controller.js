const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//part 1
// register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, roles } = req.body; // role???

    //check if the user already exist in our database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      res.status(500).json({
        success: false,
        message:
          "User is already exist either with same username or same email. Please try different username or email",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user and save in your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      roles: roles || "user", // role ???
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user, Please try again!",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

//part 2
// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //find if current user exist in the database or not
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid Username", // "Invalid credentials"
      });
    }

    //if the password is correct or not
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      res.status(400).json({
        success: false,
        message: "Invalid Password", // "Invalid credentials"
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id, //this userId is used in image-controller.js file
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      AT: accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // extract old and new password
    const { oldPassword, newPassword } = req.body;

    // find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    // check old password is correct
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      res.status(400).json({
        success: false,
        message: "old password is not correct! Please try again.",
      });
    }

    // hash the new passowd here
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error occured in changePassword contoller in auth-controller",
    });
  }
};

module.exports = { registerUser, loginUser , changePassword};
