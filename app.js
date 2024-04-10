import express from"express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import {dbConnection} from "./database/dbConnection.js"
import {errorMiddleware} from "./middlewares/error.js"

// const FRONTEND_URL = "https://legendary-narwhal-5a2ed4.netlify.app"
const app = express()
dotenv.config({path: "./config/config.env"})

app.use(cors())
// app.use(
//     cors({
//       origin: [FRONTEND_URL],
//       method: ["GET", "POST", "DELETE", "PUT"],
//       credentials: true,
//     })
//   );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  ); 

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbConnection();

app.use(errorMiddleware);

export default app  
