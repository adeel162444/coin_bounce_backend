const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {
  errorMessage,

  storeAcessToken,
  storeRefreshToken,
} = require("../methods/helpingMethods");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const UserDTO = require("../dto/userdto");
//user authentication
exports.validateUserInput = [
  check("name").notEmpty().withMessage("Name is required"),
  check("userName").notEmpty().withMessage("User Name is required"),
  check("email").notEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Invalid Email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  check("password")
    .matches(/[$&+,:;=?@#|'<>.^*()%!-]/)
    .withMessage("Password should contain atleast one special character"),
  check("confirm_Password")
    .notEmpty()
    .withMessage("confirm password field is required "),
];
exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  } else {
    try {
      const { email, userName, password, confirm_Password } = req.body;
      const emailInUse = await userModel.findOne({ email });
      const userNameInUse = await userModel.findOne({ userName });

      if (emailInUse || userNameInUse) {
        errorMessage(res, 409, "user already exsists");
      } else if (password != confirm_Password) {
        errorMessage(res, 400, "Password and confirm Password should be same");
      } else {
        const user = new userModel(req.body);
        await user.save();

        const dtoUser = new UserDTO(user);
        const accessToken = storeAcessToken(res, user);

        res.status(201).json({
          success: true,
          message: "user registered successfully",
          user: dtoUser,
        });
      }
    } catch (error) {
      errorMessage(res, error);
    }
  }
};
// login auth
exports.validateLoginInput = [
  check("email").notEmpty().withMessage("Please enter email to login"),
  check("password").notEmpty().withMessage("Please enter password to login"),
];
exports.userLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        errorMessage(res, 401, "Invalid email or password");
      } else {
        const passMatched = await bcrypt.compare(password, user.password);
        if (!passMatched) {
          errorMessage(res, 400, "Invalid email or password");
        } else {
          const dtoUser = new UserDTO(user);
          const accessToken = storeAcessToken(res, user);

          res.status(200).json({
            success: true,
            message: "user logged in successfully",
            user: dtoUser,
          });
        }
      }
    } catch (error) {
      errorMessage(res, 500, `${error}`);
    }
  }
};
//get all users
exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
//get a single user
exports.getSingleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const userDto = new UserDTO(user);
    res.status(200).json({
      success: true,
      user: userDto,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};

// refresh token
// exports.refreshToken = async (req, res) => {
//   try {
//     jwt.verify(refresh_token, process.env.REFRESH_KEY, (err, user) => {
//       if (err) {
//         errorMessage(res, 403, `${err}`);
//       }
//       if (user) {
//         storeAcessToken(res, user);
//         res.status(200).json({
//           success: true,
//           message: "token successfully refreshed",
//         });
//       }
//     });
//   } catch (error) {
//     errorMessage(res, 500, `${error}`);
//   }
// };
// user logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
// verify Token
exports.verifyToken = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    errorMessage(res, 401, "No token found Login Again");
  } else {
    jwt.verify(access_token, process.env.ACCESS_KEY, (err, decoded) => {
      if (err) {
        errorMessage(res, 403, "token got expired");
      } else {
        req.user = decoded;
      }
      next();
    });
  }
};
// logged In user details
exports.loggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const userDto = new UserDTO(user);
    res.status(200).json({
      success: true,
      user: userDto,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
