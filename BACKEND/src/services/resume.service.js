const { GoogleGenAI } = require('@google/genai')
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateResume({ resume, jobDescription, skillGaps }) {

    // Step 1 — AI se tailored resume content banao
    const prompt = `You are an expert ATS-friendly resume writer.
    
    Original Resume: ${resume}
    Job Description: ${jobDescription}
    Skill Gaps to Address: ${skillGaps.map(g => g.skill).join(', ')}
    
    STRICT INSTRUCTIONS:
    - Extract candidate's real information from the original resume
    - Tailor the resume to match the job description keywords
    - Add relevant keywords from job description naturally
    - Keep all original experience and projects but reword them to match job requirements
    - Make it ATS friendly — no graphics, no tables, pure text
    - Professional summary must be tailored to the job description
    
    Return ONLY a valid JSON object in this EXACT format, no extra text:
    {
        "name": "candidate full name",
        "email": "email address",
        "phone": "phone number",
        "location": "city, state",
        "summary": "2-3 line professional summary tailored to job description",
        "skills": [
            "Languages: C++, JavaScript",
            "Frontend: React.js, HTML, CSS",
            "Backend: Node.js, Express.js",
            "Tools: Git, GitHub, Postman"
        ],
        "projects": [
            {
                "name": "project name",
                "tech": "tech stack",
                "points": [
                    "point 1 with impact and numbers if possible",
                    "point 2",
                    "point 3"
                ]
            }
        ],
        "education": [
            {
                "degree": "degree name",
                "institution": "institution name",
                "year": "start year - end year",
                "gpa": "gpa if available"
            }
        ],
        "certifications": ["cert 1", "cert 2"],
        "achievements": ["achievement 1", "achievement 2"]
    }`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    })

    const resumeData = JSON.parse(response.text)

    // Step 2 — PDF banao
    const pdfBuffer = await createResumePDF(resumeData)
    return pdfBuffer
}

async function createResumePDF(data) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Times New Roman', serif;
            font-size: 10pt;
            padding: 0.5in 0.6in;
            color: #000;
        }
        h1 { 
            font-size: 20pt;
            text-align: center;
            margin-bottom: 4px;
        }
        .contact {
            text-align: center;
            font-size: 9pt;
            margin-bottom: 8px;
        }
        .section-title {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            margin: 10px 0 4px 0;
            padding-bottom: 2px;
        }
        .project-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .project-tech {
            font-style: italic;
            font-weight: normal;
        }
        ul {
            padding-left: 16px;
            margin: 2px 0 6px 0;
        }
        li {
            margin-bottom: 2px;
            font-size: 9.5pt;
            line-height: 1.4;
        }
        .edu-header {
            display: flex;
            justify-content: space-between;
        }
        .skills-list {
            padding-left: 16px;
        }
        .skills-list li {
            margin-bottom: 2px;
        }
    </style>
    </head>
    <body>

        <!-- Header -->
        <h1>${data.name}</h1>
        <p class="contact">
            ${data.phone} &nbsp;|&nbsp; ${data.email} &nbsp;|&nbsp; ${data.location}
        </p>

        <!-- Summary -->
        <p class="section-title">Professional Summary</p>
        <p style="font-size:9.5pt; line-height:1.5">${data.summary}</p>

        <!-- Projects -->
        <p class="section-title">Projects</p>
        ${data.projects.map(proj => `
            <div style="margin-bottom:6px">
                <div class="project-header">
                    <span>${proj.name}</span>
                    <span class="project-tech">Full Stack | ${proj.tech}</span>
                </div>
                <ul>
                    ${proj.points.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
        `).join('')}

        <!-- Education -->
        <p class="section-title">Education</p>
        ${data.education.map(edu => `
            <div class="edu-header" style="margin-bottom:4px">
                <b>${edu.degree}</b>
                <i>${edu.year}</i>
            </div>
            <p style="font-size:9.5pt">${edu.institution} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
        `).join('')}

        <!-- Technical Skills -->
        <p class="section-title">Technical Skills</p>
        <ul class="skills-list">
            ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>

        <!-- Achievements -->
        ${data.achievements && data.achievements.length > 0 ? `
            <p class="section-title">Key Achievements</p>
            <ul>
                ${data.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        ` : ''}

        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
            <p class="section-title">Certifications</p>
            <ul>
                ${data.certifications.map(c => `<li>${c}</li>`).join('')}
            </ul>
        ` : ''}

    </body>
    </html>`

    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({ 
        format: 'A4',
        margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
    })
    
    await browser.close()
    return pdfBuffer
}

module.exports = { generateResume }