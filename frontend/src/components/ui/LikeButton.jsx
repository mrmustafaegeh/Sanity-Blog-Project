import { Heart } from "lucide-react";
import { useToggleLikeMutation } from "@/api/postsAPI";
import { useState } from "react";

export default function LikeButton({ postId, initialCount }) {
  const [count, setCount] = useState(initialCount);
  const [toggleLike] = useToggleLikeMutation();

  const handleLike = async () => {
    setCount((c) => c + 1); // optimistic
    try {
      const res = await toggleLike(postId).unwrap();
      setCount(res.likesCount);
    } catch {
      setCount((c) => c - 1);
    }
  };

  return (
    <button onClick={handleLike} className="flex gap-2 items-center">
      <Heart />
      {count}
    </button>
  );
}
