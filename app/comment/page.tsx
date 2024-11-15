// app/comments/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface Comment {
  id: number;
  userid: string;
  comment_content: string;
  created_at: string;
}

interface ContentInfo {
  name: string | null;
  episode: string | null;
}

export default function Comments() {
  // refs
  const formRef = useRef<HTMLFormElement>(null);

  // 상태 관리
  const [content, setContent] = useState<ContentInfo>({
    name: null,
    episode: null,
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL 파라미터 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setContent({
      name: urlParams.get("content_name"),
      episode: urlParams.get("content_episode"),
    });
    setIsLoading(false);
  }, []);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    if (!content.name || !content.episode) return;

    try {
      const response = await fetch(
        `/api/public_get?content_name=${encodeURIComponent(content.name)}&content_episode=${content.episode}`
      );
      if (!response.ok) throw new Error("댓글 로딩 실패");

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("댓글 로딩 실패:", error);
    }
  };

  // content 정보가 업데이트되면 댓글 가져오기
  useEffect(() => {
    if (content.name && content.episode) {
      fetchComments();
    }
  }, [content.name, content.episode]);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FormData를 사용하여 폼 데이터 수집
    const formData = new FormData(e.target as HTMLFormElement);
    const submitData = {
      userid: formData.get("userid"),
      password: formData.get("password"),
      comment_content: formData.get("comment_content"),
      comment_status: true,
      content_name: content.name,
      content_episode: Number(content.episode),
    };

    try {
      const response = await fetch("/api/public_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "댓글 작성 실패");
      }

      // 폼 초기화
      formRef.current?.reset();

      // 댓글 목록 새로고침
      fetchComments();
      alert("댓글이 등록되었습니다!");
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "댓글 작성 중 오류가 발생했습니다."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!content.name || !content.episode) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-red-500">
          잘못된 접근입니다. 컨텐츠 정보가 필요합니다.
        </p>
      </div>
    );
  }

  const CommentForm = () => (
    <form
      ref={formRef}
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
            name="userid"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="comment_content"
          className="block text-sm font-medium mb-1"
        >
          댓글 내용
        </label>
        <textarea
          id="comment_content"
          name="comment_content"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );

  const CommentList = () => (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{comment.userid}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {comment.comment_content}
          </p>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-center text-gray-500">아직 댓글이 없습니다.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CommentForm />
      <CommentList />
    </div>
  );
}
