"use client";

import {
  useState,
} from "react";

import {
  getAuthenticatedUser,
} from "@/actions/auth";

export default function AuthServerFunctionTest() {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleCheckAuth() {
    setLoading(true);
    setError("");

    try {
      const currentUser =
        await getAuthenticatedUser();

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
      });
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Failed to check authentication.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 max-w-xl">
      <button
        type="button"
        onClick={handleCheckAuth}
        disabled={loading}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Checking..."
          : "Check Server Authentication"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {user && (
        <div className="mt-4 rounded-lg border p-4">
          <p>
            <strong>Authenticated</strong>
          </p>

          <p className="mt-2">
            UID: {user.uid}
          </p>

          <p>
            Email: {user.email}
          </p>
        </div>
      )}

      {!loading && !error && !user && (
        <p className="mt-4">
          Click the button to check authentication.
        </p>
      )}
    </section>
  );
}