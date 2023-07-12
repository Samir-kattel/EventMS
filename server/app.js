const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const { v4: uuidv4 } = require("uuid");
const EventSchema = require("./EventSchema");
const ImageDetailsSchema = require("./imageDetails");

const authMiddleware = require("./middleware/auth");
// const sessionMiddleware = require("./middleware/session");

const jwt = require("jsonwebtoken");
// var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const url = `mongodb://127.0.0.1:27017/myproject`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

require("./userDetails");
require("./imageDetails");

let User;

try {
  // Try to get the existing model.
  User = mongoose.model("UserInfo");
} catch {
  // If the model doesn't exist, create a new one.
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });

  User = mongoose.model("UserInfo", userSchema);
}

const Images = mongoose.model("ImageDetails");

//register
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// // login
app.post("/login-user/user", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

// app.post("/login-user"),
//   (req, res) => {
//     console.log("hello admin")
//     const userType = req.header("admin");
//     const secretKey = req.header("samir@");

//     // checking the userType and secretKey, and handling the login process accordingly.

//     if (
//       userType === req.headers.userType &&
//       secretKey === req.headers.secretkey
//     ) {
//       // Successful login
//       res.json({ status: "ok", data: "token" });
//     } else {
//       // Invalid user type or secret key
//       res.json({ status: "error", message: "Invalid user type or secret key" });
//     }
//   };


//loggedin user data
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = await jwt.verify(token, JWT_SECRET);
    // rest of the route code
  } catch (error) {
    // handle errors
  }

  // try {
  //   const user = jwt.verify(token, JWT_SECRET, (err, res) => {
  //     if (err) {
  //       return "token expired";
  //     }
  //     return res;
  //   });
  //   console.log(user);
  //   if (user == "token expired") {
  //     return res.send({ status: "error", data: "token expired" });
  //   }

  //   const useremail = user.email;
  //   User.findOne({ email: useremail })
  //     .then((data) => {
  //       res.send({ status: "ok", data: data });
  //     })
  //     .catch((error) => {
  //       res.send({ status: "error", data: error });
  //     });
  // } catch (error) {}
});

// define session middleware
const sessionMiddleware = (req, res, next) => {
  const session = { token: uuidv4(), timestamp: Date.now() };
  req.session = session;
  next();
};

// get current user's sessions
app.get("/api/sessions", authMiddleware, (req, res) => {
  res.send(req.user.sessions);
});

// add a new session to the current user's sessions
app.post("/api/sessions", sessionMiddleware, authMiddleware, (req, res) => {
  req.user.sessions.push(req.session);
  req.user.save((err) => {
    if (err) return res.status(500).send("Internal server error");
    res.send("Session added successfully");
  });
});

// forget password started
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ error: "User Not found" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    app.listen(5000, () => {
      console.log("Server Started");
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alexander.conn@ethereal.email",
        pass: "Yf35nmXvc1guq7XyYU",
      },
    });

    var mailOptions = {
      from: "alexander.conn@etheral.email",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

// event modal /
app.post("/events", (req, res) => {
  const { title, date, time, location, description, attendees } = req.body;
  console.log(title,date,  time, location, description, attendees);

  const newEvent = new EventSchema({
    title,
    date,
    time,
    location,
    description,
    attendees,
  });

  newEvent.save((err, event) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating event");
    } else {
      res.send(event);
    }
  });
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});
// forget password done

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/upload-image", async (req, res) => {
  try {
    const { image } = req.body;
    console.log(image);
    const newImage = new Images({ image });
    const savedImage = await newImage.save();
    res.status(200).json({ success: true, data: savedImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to upload image" });
  }
});

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});


app.listen(5000, () => console.log("Server running on port 5000"));
