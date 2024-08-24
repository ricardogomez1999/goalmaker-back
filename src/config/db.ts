import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    //This environment variable is on your .env file
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);

    const url = `${connection.host}:${connection.port}`;

    console.log(colors.magenta.bold(`MongoDB connected on: ${url}`));
  } catch (error) {
    console.log(
      colors.red.bold("There has been an error connecting to MongoDB")
    );
    process.exit(1);
  }
};
