// app/comments/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Comment {
  id: number;
  userid: string;
  comment_content: string;
  created_at: string;
}

export default function Comments() {
  const searchParams = useSearchParams();
  const content_name = searchParams.get("content_name");
  const content_episode = searchParams.get("content_episode");

  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    comment_content: "",
  });

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/public_get?content_name=${encodeURIComponent(content_name || "")}&content_episode=${content_episode || ""}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("댓글 로딩 실패:", error);
    }
  };

  // 페이지 로드시 댓글 가져오기
  useEffect(() => {
    if (content_name && content_episode) {
      fetchComments();
    }
  }, [content_name, content_episode]);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/public_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          comment_status: true,
          content_name: content_name,
          content_episode: Number(content_episode),
        }),
      });

      if (!response.ok) throw new Error("댓글 작성 실패");

      setFormData({ userid: "", password: "", comment_content: "" });
      fetchComments();
      alert("댓글이 등록되었습니다!");
    } catch (error) {
      console.error("Error:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // content_name과 content_episode가 없는 경우 메시지 표시
  if (!content_name || !content_episode) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-red-500">
          잘못된 접근입니다. 컨텐츠 정보가 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 댓글 작성 폼 */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white rounded-lg shadow p-4"
      >
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="userid" className="block text-sm font-medium mb-1">
              아이디
            </label>
            <input
              type="text"
              id="userid"
              value={formData.userid}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userid: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            댓글 내용
          </label>
          <textarea
            id="comment"
            value={formData.comment_content}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comment_content: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          댓글 작성
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{comment.userid}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.comment_content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
