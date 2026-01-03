import { useParams } from "react-router-dom";
import { useGetPostAnalyticsQuery } from "@/api/adminAPI";

export default function PostAnalytics() {
  const { id } = useParams();
  const { data } = useGetPostAnalyticsQuery(id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Post Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Views" value={data?.views} />
        <Stat label="Likes" value={data?.likes} />
        <Stat label="Comments" value={data?.comments} />
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white border rounded p-6 text-center">
    <p className="text-gray-500">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
