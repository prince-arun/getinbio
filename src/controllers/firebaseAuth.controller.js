/* eslint-disable camelcase */
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  verifyIdToken,
  findOrCreateUser,
} = require("../services/firebaseAuth.service");
const { tokenService } = require("../services");

const googleLogin = catchAsync(async (req, res) => {
  // console.log("req.headers----->", req.headers);
  const idToken = req.headers.authorization;

  // console.log("idToken--->", idToken);

  if (!idToken) {
    return res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
  }

  const decodedToken = await verifyIdToken(idToken);
  // console.log("decodedToken--->", decodedToken);

  const { uid, name, email, picture, email_verified } = decodedToken;

  const user = await findOrCreateUser(
    uid,
    name,
    email,
    picture,
    email_verified
  );
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

// const googleLogin = async (req, res) => {
//   const idToken = req.headers.authorization;

//   if (!idToken) {
//     return res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const { uid, name, email, picture } = decodedToken;

//     let user = await User.findOne({ uid });

//     if (!user) {
//       user = new User({ uid, name, email, profilePicture: picture });
//       await user.save();
//     }

//     res.status(httpStatus.OK).send(user);
//   } catch (error) {
//     console.error("Firebase Auth Error:", error);
//     res.status(httpStatus.UNAUTHORIZED).send("Unauthorized");
//   }
// };

module.exports = {
  googleLogin,
};

/* eslint-disable camelcase */
