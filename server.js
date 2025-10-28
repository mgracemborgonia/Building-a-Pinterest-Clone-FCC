require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const db = process.env.MONGO_DB;
const imageRoute = require("./routes/routes");
const setUpPassport = require("./routes/auth");
// mongoose
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB is connected.");
  })
  .catch((error) => {
    console.error(error);
  });
// cors
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
// session secret
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// passport
app.use(passport.initialize());
app.use(passport.session());
setUpPassport();
// log in to github
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/home.html?error=login_failed",
  }),
  (req, res) => {
    console.log("You are now logged in.");
    res.redirect("/dashboard.html");
  }
);
// log out github
app.get("/logout", (req, res) => {
  req.logout(() => {
    console.log("You are now logged out.");
    res.redirect("/home.html");
  });
});
// routes
app.use(imageRoute);
// load html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/home.html"))
);
app.use((req, res) => res.status(404).send("Page not found."));
// port 8080
app.listen(port, () => {
  console.log(`Server ${port} is listening.`);
  if (process.env.NODE_ENV === "test") {
    console.log(`Run is testing...`);
  }
});
