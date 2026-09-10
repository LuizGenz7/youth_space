import AuthServerFunctionTest from "@/components/AuthServerFunctionTest";

export default function ServerTestPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Firebase Server Function Test
      </h1>

      <p className="mt-2">
        Testing Client → Server Function →
        FirebaseServerApp.
      </p>

      <AuthServerFunctionTest />
    </main>
  );
}