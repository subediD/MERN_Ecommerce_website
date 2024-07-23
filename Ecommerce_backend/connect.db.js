import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://subedidipesh15:Haramee155@cluster0.lhwzm2j.mongodb.net/my-ecommerce?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
  }
};

export default connectDB;
