import jwt from "jsonwebtoken";
import { get, isNil } from "lodash";

const getCurrentUser = async (request) => {
  try {
    if (isNil(get(request, "headers.token"))) {
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
