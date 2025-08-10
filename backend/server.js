require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connection = require("./configs/database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Routes
const playlistRoute = require("./routes/playplistRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const paymentRoute = require("./routes/paymentRoute");
const artistRoute = require("./routes/artistRoute");
const userRoute = require("./routes/userRoute");
const musicRoute = require("./routes/musicRoute");

// Middleware

app.use(cookieParser());

// CORS setup - adjust origins for production!
app.use(
  cors({
    origin: ["  http://localhost:5173", "http://localhost:5000"], // update with your frontend URL in production
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Passport config (make sure this file exports the passport strategies properly)
require("./configs/passport");

// Express session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret", // fallback secret for dev
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true only in production (HTTPS)
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Logging
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI (API docs)
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

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/artist", artistRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/user", userRoute);
app.use("/api/music", musicRoute);
app.use("/api/playlists", playlistRoute);

// Health check or basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to DB and start server
(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`✅ Backend Node.js App listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to DB:", error);
    process.exit(1); // Exit process if DB connection fails
  }
})();
