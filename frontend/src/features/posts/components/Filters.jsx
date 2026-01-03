export default function Filters({ params, setParams }) {
  return (
    <select
      value={params.get("category") || ""}
      onChange={(e) =>
        setParams({
          category: e.target.value || null,
          page: 1,
        })
      }
    >
      <option value="">All</option>
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  );
}
