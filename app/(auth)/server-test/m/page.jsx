"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/client";

import { useState } from "react";

export default function AuthTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setMessage(`Signed up: ${result.user.uid}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSignIn() {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setMessage(`Signed in: ${result.user.uid}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSignOut() {
    await signOut(auth);

    setMessage("Signed out.");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Firebase Auth Test</h1>

      <div className="mt-6 flex max-w-md flex-col gap-4">
        <input
          className="rounded border p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          className="rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          className="rounded bg-black p-3 text-white"
          onClick={handleSignUp}
        >
          Create Account
        </button>

        <button className="rounded border p-3" onClick={handleSignIn}>
          Sign In
        </button>

        <button className="rounded border p-3" onClick={handleSignOut}>
          Sign Out
        </button>

        <p>{message}</p>
      </div>
    </main>
  );
}
