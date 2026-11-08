"use client";

import { useState } from "react";

import {
    analyzeCandidate,
    generateQuestions,
    evaluateAnswer
} from "@/lib/puter-ai";


export default function Home() {

    const [file, setFile] = useState<File | null>(null);

    const [jobDescription, setJobDescription] = useState("");

    const [cvText, setCvText] = useState("");

    const [analysis, setAnalysis] = useState("");

    const [questions, setQuestions] = useState("");

    const [question, setQuestion] = useState("");

    const [answer, setAnswer] = useState("");

    const [evaluation, setEvaluation] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // Extract CV and analyze candidate
    async function handleAnalyze() {

        if (!file || !jobDescription.trim()) {
            setError("Please upload a CV and enter a job description.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setAnalysis("");
            setQuestions("");

            // Step 1: Extract CV text using Python backend
            const formData = new FormData();

            formData.append("file", file);

            const extractionResponse = await fetch(
                "http://localhost:8000/api/extract-cv",
                {
                    method: "POST",
                    body: formData
                }
            );

            const extractionData = await extractionResponse.json();

            if (!extractionResponse.ok) {
                throw new Error(
                    extractionData.detail || "CV extraction failed."
                );
            }

            const extractedText = extractionData.cv_text;

            setCvText(extractedText);

            // Step 2: Analyze CV using Puter.js
            const result = await analyzeCandidate(
                extractedText,
                jobDescription
            );

            setAnalysis(result);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );

        } finally {

            setLoading(false);

        }
    }


    // Generate interview questions
    async function handleGenerateQuestions() {

        if (!cvText || !jobDescription.trim()) {
            setError("Analyze your CV first.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const result = await generateQuestions(
                cvText,
                jobDescription
            );

            setQuestions(result);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Question generation failed."
            );

        } finally {

            setLoading(false);

        }
    }


    // Evaluate candidate answer
    async function handleEvaluateAnswer() {

        if (!question.trim() || !answer.trim()) {
            setError("Enter an interview question and your answer.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const result = await evaluateAnswer(
                question,
                answer,
                "Junior Software Engineer"
            );

            setEvaluation(result);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Answer evaluation failed."
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <main className="min-h-screen bg-slate-950 text-white p-6">

            <div className="max-w-4xl mx-auto space-y-8">

                <header className="space-y-2">

                    <h1 className="text-3xl font-bold">
                        AI Interview Coach
                    </h1>

                    <p className="text-slate-400">
                        Prepare for your next software engineering interview.
                    </p>

                </header>


                {/* CV Upload */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

                    <h2 className="text-xl font-semibold">
                        1. Upload Your CV
                    </h2>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                            setFile(e.target.files?.[0] || null)
                        }
                        className="block w-full text-sm text-slate-300"
                    />

                    <h2 className="text-xl font-semibold pt-4">
                        2. Job Description
                    </h2>

                    <textarea
                        value={jobDescription}
                        onChange={(e) =>
                            setJobDescription(e.target.value)
                        }
                        placeholder="Paste the job description here..."
                        className="w-full min-h-40 bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none"
                    />

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium"
                    >
                        {loading ? "Please wait..." : "Analyze My CV"}
                    </button>

                </section>


                {/* Error */}

                {error && (

                    <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-lg">
                        {error}
                    </div>

                )}


                {/* CV Analysis */}

                {analysis && (

                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

                        <h2 className="text-xl font-semibold">
                            3. Candidate Analysis
                        </h2>

                        <div className="whitespace-pre-wrap text-slate-300 leading-7">
                            {analysis}
                        </div>

                        <button
                            onClick={handleGenerateQuestions}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-lg"
                        >
                            Generate Interview Questions
                        </button>

                    </section>

                )}


                {/* Interview Questions */}

                {questions && (

                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

                        <h2 className="text-xl font-semibold">
                            4. Personalized Interview Questions
                        </h2>

                        <div className="whitespace-pre-wrap text-slate-300 leading-7">
                            {questions}
                        </div>

                    </section>

                )}


                {/* Answer Evaluation */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

                    <h2 className="text-xl font-semibold">
                        5. Evaluate My Interview Answer
                    </h2>

                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter the interview question..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3"
                    />

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full min-h-32 bg-slate-800 border border-slate-700 rounded-lg p-3"
                    />

                    <button
                        onClick={handleEvaluateAnswer}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg"
                    >
                        Evaluate My Answer
                    </button>

                    {evaluation && (

                        <div className="bg-slate-800 rounded-lg p-4">

                            <h3 className="font-semibold mb-3">
                                AI Evaluation
                            </h3>

                            <div className="whitespace-pre-wrap text-slate-300 leading-7">
                                {evaluation}
                            </div>

                        </div>

                    )}

                </section>

            </div>

        </main>

    );

}