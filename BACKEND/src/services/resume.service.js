const { GoogleGenAI } = require('@google/genai')
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateResume({ resume, jobDescription, skillGaps }) {

    
    const prompt = `You are an expert ATS-friendly resume writer.

Original Resume: ${resume}
Job Description: ${jobDescription}
Skill Gaps to Address: ${skillGaps.map(g => g.skill).join(', ')}

STEP 1 — ANALYZE: Read the original resume carefully and identify which sections are present:
- Does it have Experience? (previous jobs, internships, work history)
- Does it have Projects? (personal/academic projects)
- Does it have Certifications?
- Does it have Achievements?

STEP 2 — TAILOR: Only reword the content that exists. Never add fake content.

STEP 3 — STRICT RULES:
- Experience means work history/jobs — put ONLY in "experience" field
- Projects means personal/academic projects — put ONLY in "projects" field  
- NEVER move experience to projects or vice versa
- If a section does NOT exist in resume, return null for that field
- If a section EXISTS, return the tailored content

Return ONLY valid JSON:
{
    "name": "exact name from resume",
    "email": "exact email from resume", 
    "phone": "exact phone from resume",
    "location": "exact location from resume",
    "summary": "2-3 line tailored summary based on resume content only",
    "skills": ["Languages: ...", "Frontend: ...", "Backend: ...", "Tools: ..."],
    "experience": null or [
        {
            "title": "job title",
            "company": "company name",
            "duration": "duration",
            "points": ["tailored point 1", "tailored point 2"]
        }
    ],
    "projects": null or [
        {
            "name": "project name",
            "tech": "tech stack",
            "points": ["tailored point 1", "tailored point 2"]
        }
    ],
    "education": null or [
        {
            "degree": "degree name",
            "institution": "institution name",
            "year": "year",
            "gpa": "gpa or empty string"
        }
    ],
    "certifications": null or ["cert 1", "cert 2"],
    "achievements": null or ["achievement 1", "achievement 2"]
}`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    })

    const resumeData = JSON.parse(response.text)

    
    const pdfBuffer = await createResumePDF(resumeData)
    return pdfBuffer
}

async function createResumePDF(data) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',  
            '--disable-gpu']
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
        h1 { font-size: 20pt; text-align: center; margin-bottom: 4px; }
        .contact { text-align: center; font-size: 9pt; margin-bottom: 8px; }
        .section-title {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            margin: 10px 0 4px 0;
            padding-bottom: 2px;
        }
        .row-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .italic { font-style: italic; font-weight: normal; }
        ul { padding-left: 16px; margin: 2px 0 6px 0; }
        li { margin-bottom: 2px; font-size: 9.5pt; line-height: 1.4; }
        .skills-list { padding-left: 16px; }
        .skills-list li { margin-bottom: 2px; }
    </style>
    </head>
    <body>

        <!-- Header — Always present -->
        <h1>${data.name}</h1>
        <p class="contact">
            ${data.phone} &nbsp;|&nbsp; ${data.email} &nbsp;|&nbsp; ${data.location}
        </p>

        <!-- Summary — Always present -->
        <p class="section-title">Professional Summary</p>
        <p style="font-size:9.5pt; line-height:1.5">${data.summary}</p>

        <!-- Skills — Always present -->
        <p class="section-title">Technical Skills</p>
        <ul class="skills-list">
            ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>

        <!-- Experience — Only if present -->
        ${data.experience && data.experience.length > 0 ? `
            <p class="section-title">Experience</p>
            ${data.experience.map(exp => `
                <div style="margin-bottom:6px">
                    <div class="row-header">
                        <span>${exp.title} — ${exp.company}</span>
                        <span class="italic">${exp.duration}</span>
                    </div>
                    <ul>
                        ${exp.points.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        ` : ''}

        <!-- Projects — Only if present -->
        ${data.projects && data.projects.length > 0 ? `
            <p class="section-title">Projects</p>
            ${data.projects.map(proj => `
                <div style="margin-bottom:6px">
                    <div class="row-header">
                        <span>${proj.name}</span>
                        <span class="italic">Full Stack | ${proj.tech}</span>
                    </div>
                    <ul>
                        ${proj.points.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        ` : ''}

        <!-- Education — Only if present -->
        ${data.education && data.education.length > 0 ? `
            <p class="section-title">Education</p>
            ${data.education.map(edu => `
                <div class="row-header" style="margin-bottom:4px">
                    <b>${edu.degree}</b>
                    <i>${edu.year}</i>
                </div>
                <p style="font-size:9.5pt">${edu.institution} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
            `).join('')}
        ` : ''}

        <!-- Achievements — Only if present -->
        ${data.achievements && data.achievements.length > 0 ? `
            <p class="section-title">Key Achievements</p>
            <ul>
                ${data.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        ` : ''}

        <!-- Certifications — Only if present -->
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