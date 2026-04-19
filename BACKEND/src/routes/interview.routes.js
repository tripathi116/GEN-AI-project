const express = require('express');
const authMiddleware = require("../middlewares/auth.middlewares")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")



const interviewRouter = express.Router();


/**
 * @route POST /api/interview/
 * @description Generate an interview preparation report for a candidate based on the provided resume, self-description, and job description.
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)



module.exports = interviewRouter;