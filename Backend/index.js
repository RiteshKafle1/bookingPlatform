import express from "express";
import "dotenv/config";
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from "./Routes/user.routes";
import cookieParser from 'cookie-parser';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use('api/v1/user',userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running at", PORT);
});
