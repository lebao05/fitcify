require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connection = require("./configs/database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const artistRoute = require("./routes/artistRoute")
const userRoute = require("./routes/userRoute");
const musicRoute = require("./routes/musicRoute");
const playlistRoute = require("./routes/playplistRoute");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], // your frontend and swagger
    credentials: true, // allow cookies, sessions, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
require("./configs/passport");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
      requestInterceptor: (req) => {
        req.credentials = "include";
        return req;
      },
    },
  })
);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/artist", artistRoute);
app.use("/api/user", userRoute);
app.use("/api/music", musicRoute);
app.use("/api/playlists", playlistRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(notFound);
app.use(errorHandler);
(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`✅ Backend Node .js App listening on port ${port}`);
    });
  } catch (error) {
    console.log("❌ Error connect to DB: ", error);
  }
})();
