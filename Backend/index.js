import express from "express";
import "dotenv/config";
import helmet from 'helmet';
import cors from 'cors';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(cors());



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running at", PORT);
});
