import React from 'react'
import "../styles/home.scss"
const Home = () => {
  return (
    <main className = 'home'>
        <div className="interview-input-group">
            <div className = 'left'>
                <label htmlFor="jobDescription">Job Description</label>
                <textarea name = "jobDescription" id = "jobDescription" placeholder="Enter job description here..."></textarea>
            </div>
            <div className = 'right'>
                <p>Resume <small className='highlight'>(Use Resume and self description together for better result)</small></p>
                <div className = 'input-group'>
                    <label className="file-label" htmlFor="resume">Upload Resume</label>
                    <input hidden type="file" id="resume" name="resume" accept=".pdf" />
                </div>
                    <div className = 'input-group'> 
                    <label htmlFor="selfDescription">Self Description</label>
                    <input id="selfDescription" name="selfDescription" placeholder="Describe yourself in a few sentences..." />
                </div>
                <button className = 'button primary-button'>Generate Interview Report</button>
            </div>
        </div>
    </main>
  )
}

export default Home