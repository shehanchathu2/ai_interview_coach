
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                router.push("/");
                router.refresh();
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (error) throw error;

                if (data.session) {
                    router.push("/");
                    router.refresh();
                } else {
                    setMessage(
                        "Registration successful! Please check your email to verify your account."
                    );
                }
            }
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

                <h1 className="text-3xl font-bold text-white text-center">
                    AI Interview Coach
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    {isLogin
                        ? "Welcome back! Sign in to continue."
                        : "Create your candidate account."}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password (minimum 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                    />

                    {message && (
                        <p className="text-sm text-amber-400">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Sign In"
                                : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage("");
                        }}
                        className="ml-2 text-blue-400 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </main>
    );
}
