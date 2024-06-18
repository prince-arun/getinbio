/* eslint-disable camelcase */
const admin = require("../config/firebase");
const { User } = require("../models");

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // console.log("decodedToekn---->", decodedToken);
    return decodedToken;
  } catch (error) {
    throw new Error("Unauthorized");
  }
};

const findOrCreateUser = async (uid, name, email, picture, email_verified) => {
  let user = await User.findOne({ uid });

  if (!user) {
    user = new User({
      uid,
      name,
      email,
      profilePicture: picture,
      isEmailVerified: email_verified,
    });
    await user.save();
  }

  return user;
};

module.exports = {
  verifyIdToken,
  findOrCreateUser,
};

/* eslint-disable camelcase */
