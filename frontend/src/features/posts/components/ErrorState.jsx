// src/features/posts/components/ErrorState.jsx
export default function ErrorState({ error }) {
  return (
    <div className="error-state">
      <h2>Something went wrong</h2>
      <pre>{error?.data?.message || "Unknown error"}</pre>
    </div>
  );
}
