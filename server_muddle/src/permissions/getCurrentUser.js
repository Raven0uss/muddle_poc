import jwt from "jsonwebtoken";

const getCurrentUser = async (request) => {
  try {
    if (!request.headers.token) {
      return null;
    }
    const user = await jwt.decode(
      request.headers.token,
      process.env.JWT_SECRET_KEY
    );
    return { ...user };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default getCurrentUser;
