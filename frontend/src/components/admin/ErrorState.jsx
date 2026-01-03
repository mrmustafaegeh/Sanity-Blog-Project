export default function ErrorState({ error }) {
  return (
    <div className="text-red-600">
      Error: {error?.data?.message || "Something went wrong"}
    </div>
  );
}
