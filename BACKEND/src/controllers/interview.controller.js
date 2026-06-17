const pdfParse = require("pdf-parse")
const {generateInterviewReport} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description controller to generate an interview report for a candidate based on the provided resume, self-description, and job description.
 */
async function generateInterviewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })


    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        title: jobDescription.split('\n')[0],
        ...interviewReportByAi
    })

    res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}


/** 
 * @description controller to get interview report by interviewID.
 */
async function getInterviewReportByIDController(req, res) {

    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId,user: req.user.id})

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
} 


/**
 * @description controller to get all interview reports for the logged in user.
 */
async function getAllInterviewReportConntroller(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    });
}


/**
 * @description controller to delete interview report by interviewID.
 */
async function deleteInterviewReportController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found or unauthorized"
        });
    }

    res.status(200).json({
        message: "Interview report deleted successfully"
    });
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIDController,
    getAllInterviewReportConntroller,
    deleteInterviewReportController
}