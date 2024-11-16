// app/comments/page.tsx
"use client";

import { Edit2, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface EditingComment {
  id: number | null;
  mode: "edit" | "delete" | null;
}

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

  const [editingComment, setEditingComment] = useState<EditingComment>({
    id: null,
    mode: null,
  });
  const [editContent, setEditContent] = useState("");
  const [password, setPassword] = useState("");

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
      // alert("comment complete!");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "comment error");
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
          This is the wrong approach. Content information is required.
        </p>
      </div>
    );
  }

  const CommentForm = () => (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mb-8  rounded-lg shadow p-4 "
    >
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="userid"
            className="block text-sm font-medium mb-1 text-[#bdbdbd]"
          >
            ID
          </label>
          <input
            type="text"
            id="userid"
            name="userid"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="id"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-[#bdbdbd]"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Password"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="comment_content"
          className="block text-sm font-medium mb-1 text-[#bdbdbd]"
        >
          Comment Content
        </label>
        <textarea
          id="comment_content"
          name="comment_content"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
          placeholder="Comment Content"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-white text-black py-2 px-4 rounded-md opacity-100 hover:opacity-80 transition-opacity"
      >
        Submit
      </button>
    </form>
  );

  const CommentList = () => {
    const editFormRef = useRef<HTMLFormElement>(null);
    const deleteFormRef = useRef<HTMLFormElement>(null);

    const handleEdit = async (id: number, event: React.FormEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      try {
        const response = await fetch("/api/public_put", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            password: formData.get("password"),
            comment_content: formData.get("comment_content"),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "editing error");
        }

        setEditingComment({ id: null, mode: null });
        fetchComments();
        alert("Edit success");
      } catch (error) {
        alert(error instanceof Error ? error.message : "editing error");
      }
    };

    const handleDelete = async (id: number, event: React.FormEvent) => {
      event.preventDefault();
      if (!confirm("Are you sure? Delete?")) return;

      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      try {
        const response = await fetch("/api/public_delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            password: formData.get("password"),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Delete fail");
        }

        setEditingComment({ id: null, mode: null });
        fetchComments();
        alert("Delete!");
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "삭제 중 오류가 발생했습니다."
        );
      }
    };

    return (
      <div className="space-y-4 p-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#191919] rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-[#bdbdbd]">
                {comment.userid}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() =>
                    setEditingComment({ id: comment.id, mode: "edit" })
                  }
                  className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                  aria-label="수정"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() =>
                    setEditingComment({ id: comment.id, mode: "delete" })
                  }
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {editingComment.id === comment.id &&
            editingComment.mode === "edit" ? (
              <form
                onSubmit={(e) => handleEdit(comment.id, e)}
                className="mt-2"
              >
                <textarea
                  name="comment_content"
                  defaultValue={comment.comment_content}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="mt-2 flex gap-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password Check"
                    className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1 bg-white text-black rounded-md opacity-100 hover:opacity-80 transition-opacity"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingComment({ id: null, mode: null })}
                    className="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : editingComment.id === comment.id &&
              editingComment.mode === "delete" ? (
              <form
                onSubmit={(e) => handleDelete(comment.id, e)}
                className="mt-2 flex gap-2"
              >
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호 확인"
                  className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setEditingComment({ id: null, mode: null })}
                  className="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  CANCEL
                </button>
              </form>
            ) : (
              <p className="text-white whitespace-pre-wrap">
                {comment.comment_content}
              </p>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500">
            {/* 아직 댓글이 없습니다. */}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4">
      <CommentForm />
      <CommentList />
    </div>
  );
}
