import jwt from 'jsonwebtoken'

export const jwt_verify = async (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.jwt;
console.log(token)
  // If no token is found, return an error response
  if (!token) {
    return res
      .status(403)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);

    // Attach the decoded token to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};