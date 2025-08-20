/**
 * @typedef {Object} Job
 * @property {string} title
 * @property {string} description
 * @property {string} location
 * @property {string[]} requiredSkills
 */

/**
 * @typedef {Object} Resume
 * @property {string} id
 * @property {string} [companyName] - optional
 * @property {string} [jobTitle] - optional
 * @property {string} imagePath
 * @property {string} resumePath
 * @property {Feedback} feedback
 */

/**
 * @typedef {Object} Feedback
 * @property {number} overallScore
 * @property {{score: number, tips: {type: "good" | "improve", tip: string}[]}} ATS
 * @property {{score: number, tips: {type: "good" | "improve", tip: string, explanation: string}[]}} toneAndStyle
 * @property {{score: number, tips: {type: "good" | "improve", tip: string, explanation: string}[]}} content
 * @property {{score: number, tips: {type: "good" | "improve", tip: string, explanation: string}[]}} structure
 * @property {{score: number, tips: {type: "good" | "improve", tip: string, explanation: string}[]}} skills
 */
