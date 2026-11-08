async function getPuter() {
    const { puter } = await import("@heyputer/puter.js");
    return puter;
}


// Extract text from Puter response
function getResponseText(response: any): string {

    const content = response?.message?.content;

    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .filter((item: any) => item.type === "text")
            .map((item: any) => item.text)
            .join("\n");
    }

    return String(content ?? "");
}


// 1. Analyze candidate CV
export async function analyzeCandidate(
    cvText: string,
    jobDescription: string
): Promise<string> {

    const puter = await getPuter();

    const prompt = `
You are an experienced technical recruiter.

Analyze the candidate's CV against the job description.

CANDIDATE CV:
${cvText}

JOB DESCRIPTION:
${jobDescription}

Provide the following:

1. Candidate Summary
2. Technical Skills
3. Relevant Experience
4. Matching Skills
5. Missing or Unclear Skills
6. Overall Suitability
7. Five Personalized Interview Questions

Do not invent experience or skills.
If information is missing, clearly mention it.
`;

    const response = await puter.ai.chat(prompt);

    return getResponseText(response);
}


// 2. Generate interview questions
export async function generateQuestions(
    cvText: string,
    jobDescription: string
): Promise<string> {

    const puter = await getPuter();

    const prompt = `
You are a senior software engineering interviewer.

Generate five personalized technical interview questions.

CANDIDATE CV:
${cvText}

JOB DESCRIPTION:
${jobDescription}

Requirements:
- Questions must match the candidate's experience.
- Include practical technical questions.
- Include one problem-solving question.
- Avoid generic questions.
- Number the questions clearly.
`;

    const response = await puter.ai.chat(prompt);

    return getResponseText(response);
}


// 3. Evaluate candidate answer
export async function evaluateAnswer(
    question: string,
    answer: string,
    jobPosition: string
): Promise<string> {

    const puter = await getPuter();

    const prompt = `
You are an experienced software engineering interviewer.

Evaluate this candidate's interview answer.

JOB POSITION:
${jobPosition}

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

Evaluate based on:

1. Technical correctness
2. Understanding of the concept
3. Clarity of explanation
4. Practical examples

Return:

Score: A number between 0 and 100

Feedback:
Strengths:
Areas to Improve:
Example of a Better Answer:

Be fair and constructive.
Do not give a high score just because the answer is long.
`;

    const response = await puter.ai.chat(prompt);

    return getResponseText(response);
}