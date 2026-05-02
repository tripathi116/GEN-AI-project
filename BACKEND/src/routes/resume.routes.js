const express = require('express')
const resumeRouter = express.Router()
const authMiddleware = require('../middlewares/auth.middlewares')
const { generateTailoredResume } = require('../controllers/resume.controller')

resumeRouter.post('/:interviewId', authMiddleware.authUser, generateTailoredResume)

module.exports = resumeRouter