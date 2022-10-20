export default {
  jwt: {
    secret: process.env.JWT_KEY as string,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
