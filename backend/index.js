const express = require("express");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const net = require('net');  

dotenv.config();
const app = express();




const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  };
connectToMongo();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user",userRoute);

const port = 8000;
const server = net.createServer();
server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Cổng ${port} đã được sử dụng, hãy kiểm tra ứng dụng khác đang chạy.`);
    } else {
        console.log('Lỗi không xác định:', err);
    }
});

server.once('listening', () => {
    server.close();
    // Nếu cổng chưa được sử dụng, tiến hành chạy server
    app.listen(port, () => {
        console.log(`Server đang chạy trên cổng ${port}`);
    });
});

server.listen(port);
//Json webtoken dung de xac thuc nguoi dung
 

