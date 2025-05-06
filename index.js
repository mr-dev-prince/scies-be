import express from "express";
import "dotenv/config.js";
import cors from "cors";

// db
import { connectDB } from "./db/connectDB.js";

// routes
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import electionRouter from "./routes/election.route.js";
import nominationRouter from "./routes/nomination.route.js";
import memberRouter from "./routes/member.route.js";
import contactRouter from "./routes/contact.route.js";
import voteRouter from "./routes/vote.route.js";
import emailRouter from "./routes/email.route.js";
import uploadImage from "./controllers/upload.controller.js";

// middlewares
import upload from "./middlewares/multer.js";

const app = express();

// db
connectDB();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/election", electionRouter);
app.use("/api/nomination", nominationRouter);
app.use("/api/vote", voteRouter);
app.use("/api/member", memberRouter);
app.use("/api/contact", contactRouter);
app.use("/api/upload", upload.single("file"), uploadImage);
app.use("/api/email", emailRouter);

//base route
app.get("/", (_, res) => res.send("SCIES Backend"));

app.listen(process.env.PORT, () =>
  console.log(`Server up & running at ${process.env.PORT}`)
);
