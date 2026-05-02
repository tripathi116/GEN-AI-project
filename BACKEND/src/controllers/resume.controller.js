const interviewReportModel = require('../models/interviewReport.model')
const { generateResume } = require('../services/resume.service')

async function generateTailoredResume(req, res) {
    try {
        const { interviewId } = req.params
        
        // Database se interview report fetch karo
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        // Agar report nahi mili
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        // Resume PDF generate karo
        const pdfBuffer = await generateResume({
            resume: interviewReport.resume,
            jobDescription: interviewReport.jobDescription,
            skillGaps: interviewReport.skillGaps
        })

        // PDF response me bhejo
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=tailored-resume.pdf')
        res.send(pdfBuffer)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { generateTailoredResume }