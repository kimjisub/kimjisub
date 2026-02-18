"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Reply, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  postSlug: string;
  className?: string;
}

export function CommentSection({ postSlug, className }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${postSlug}`);
      const data = await res.json();
      if (res.ok) {
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          parentId: parentId || null,
          authorName: name.trim(),
          authorEmail: email.trim() || null,
          content: content.trim(),
        }),
      });

      if (res.ok) {
        setContent("");
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CommentForm = ({ parentId, onCancel }: { parentId?: string; onCancel?: () => void }) => (
    <form onSubmit={(e) => handleSubmit(e, parentId)} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="이름 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <input
          type="email"
          placeholder="이메일 (선택)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
      </div>
      <textarea
        placeholder="댓글을 작성하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                   text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !name.trim() || !content.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 
                     disabled:opacity-50 disabled:cursor-not-allowed rounded-lg 
                     text-white font-medium transition-colors"
        >
          <Send className="w-4 h-4" />
          {submitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("space-y-3", isReply && "ml-8 pl-4 border-l border-white/10")}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white">{comment.authorName}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="mt-1 text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-green-400 transition-colors"
            >
              <Reply className="w-4 h-4" />
              답글
            </button>
          )}
        </div>
      </div>
      
      {replyingTo === comment.id && (
        <div className="ml-13 mt-4">
          <CommentForm parentId={comment.id} onCancel={() => setReplyingTo(null)} />
        </div>
      )}
      
      {comment.replies?.length > 0 && (
        <div className="space-y-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className={cn("space-y-8", className)}>
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold text-white">
          댓글 {!loading && `(${comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})`}
        </h2>
      </div>

      {/* Comment Form */}
      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
        <CommentForm />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">댓글을 불러오는 중...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  );
}
