import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export { MONGO_URL, JWT_SECRET };
