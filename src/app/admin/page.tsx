"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Lock,
  LogOut,
  BarChart3,
  MessageCircle,
  Mail,
  Star,
  Eye,
  Heart,
  Check,
  X,
  Trash2,
  ExternalLink,
  Pencil,
  GripVertical,
  Newspaper,
  UserMinus,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "testimonials" | "contacts" | "comments" | "newsletter";
type TestimonialFilter = "all" | "PENDING" | "APPROVED" | "REJECTED";

interface Stats {
  totalViews: number;
  totalReactions: number;
  totalComments: number;
  pendingTestimonials: number;
  newContacts: number;
  topPages: { slug: string; count: number }[];
  recentComments: {
    id: string;
    postSlug: string;
    authorName: string;
    content: string;
    createdAt: string;
  }[];
}

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorEmail?: string;
  authorUrl?: string;
  content: string;
  relationship?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  displayOrder?: number;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  replies: Comment[];
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  source?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  
  // Testimonial filter
  const [testimonialFilter, setTestimonialFilter] = useState<TestimonialFilter>("all");
  
  // Edit modal
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, activeTab]);

  const checkAuth = async () => {
    const res = await fetch("/api/admin/auth");
    const data = await res.json();
    setAuthenticated(data.authenticated);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
    } else if (res.status === 429) {
      const data = await res.json();
      setError(`너무 많은 시도입니다. ${data.retryAfter}초 후 다시 시도하세요.`);
    } else {
      setError("잘못된 비밀번호입니다");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const fetchData = async () => {
    if (activeTab === "dashboard") {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } else if (activeTab === "testimonials") {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        // Sort approved ones by displayOrder
        const sorted = data.sort((a: Testimonial, b: Testimonial) => {
          // First sort by status (PENDING first, then APPROVED, then REJECTED)
          const statusOrder = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          // Within same status, sort by displayOrder (nulls last) then createdAt
          if (a.status === "APPROVED") {
            const orderA = a.displayOrder ?? Infinity;
            const orderB = b.displayOrder ?? Infinity;
            if (orderA !== orderB) return orderA - orderB;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setTestimonials(sorted);
      }
    } else if (activeTab === "contacts") {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) setContacts(await res.json());
    } else if (activeTab === "comments") {
      const res = await fetch("/api/admin/comments");
      if (res.ok) setComments(await res.json());
    } else if (activeTab === "newsletter") {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) setSubscribers(await res.json());
    }
  };

  const updateTestimonialStatus = async (id: string, status: string) => {
    await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const saveTestimonial = async (data: Partial<Testimonial> & { id: string }) => {
    await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingTestimonial(null);
    fetchData();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const approvedItems = testimonials.filter((t) => t.status === "APPROVED");
      const oldIndex = approvedItems.findIndex((t) => t.id === active.id);
      const newIndex = approvedItems.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(approvedItems, oldIndex, newIndex);
        
        // Update local state immediately for responsiveness
        const newTestimonials = testimonials.map((t) => {
          if (t.status !== "APPROVED") return t;
          const idx = newOrder.findIndex((n) => n.id === t.id);
          return { ...t, displayOrder: idx };
        });
        setTestimonials(newTestimonials);

        // Save to server
        const items = newOrder.map((item, index) => ({
          id: item.id,
          displayOrder: index,
        }));

        await fetch("/api/admin/testimonials/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      }
    }
  };

  const updateContact = async (id: string, status: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const deleteContact = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/admin/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const toggleComment = async (id: string, isApproved: boolean) => {
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved }),
    });
    fetchData();
  };

  const deleteComment = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const updateSubscriberStatus = async (id: string, status: string) => {
    await fetch("/api/admin/newsletter", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/admin/newsletter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter testimonials
  const filteredTestimonials = testimonialFilter === "all" 
    ? testimonials 
    : testimonials.filter((t) => t.status === testimonialFilter);
  
  const approvedTestimonials = testimonials.filter((t) => t.status === "APPROVED");

  // Loading
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Login Form
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm p-8 bg-white/5 rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Admin Login
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 mb-4 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg 
                       text-white font-medium transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  const activeSubscribers = subscribers.filter((s) => s.status === "ACTIVE").length;
  
  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "대시보드", icon: <BarChart3 className="w-5 h-5" /> },
    {
      id: "testimonials",
      label: "추천사",
      icon: <Star className="w-5 h-5" />,
      badge: stats?.pendingTestimonials,
    },
    {
      id: "contacts",
      label: "문의",
      icon: <Mail className="w-5 h-5" />,
      badge: stats?.newContacts,
    },
    { id: "comments", label: "댓글", icon: <MessageCircle className="w-5 h-5" /> },
    { 
      id: "newsletter", 
      label: "뉴스레터", 
      icon: <Newspaper className="w-5 h-5" />,
      badge: activeSubscribers > 0 ? activeSubscribers : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-green-500 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge ? (
                <span className="px-2 py-0.5 text-xs bg-red-500 rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Eye />} label="총 조회수" value={stats.totalViews} />
              <StatCard icon={<Heart />} label="총 좋아요" value={stats.totalReactions} />
              <StatCard icon={<MessageCircle />} label="총 댓글" value={stats.totalComments} />
              <StatCard
                icon={<Star />}
                label="대기 중 추천사"
                value={stats.pendingTestimonials}
                highlight={stats.pendingTestimonials > 0}
              />
            </div>

            {/* Top Pages */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">인기 페이지</h2>
              <div className="space-y-3">
                {stats.topPages.map((page, i) => (
                  <div key={page.slug} className="flex items-center gap-4">
                    <span className="text-gray-500 w-6">{i + 1}</span>
                    <span className="flex-1 text-white truncate">{page.slug}</span>
                    <span className="text-gray-400">{page.count} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">최근 댓글</h2>
              <div className="space-y-4">
                {stats.recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{comment.authorName}</span>
                      <span className="text-sm text-gray-500">
                        on {comment.postSlug}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {activeTab === "testimonials" && (
          <div className="space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {(["all", "PENDING", "APPROVED", "REJECTED"] as TestimonialFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTestimonialFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                    testimonialFilter === filter
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  {filter === "all" ? "전체" : filter}
                  <span className="ml-1 text-xs opacity-60">
                    ({filter === "all" 
                      ? testimonials.length 
                      : testimonials.filter(t => t.status === filter).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Drag hint for approved */}
            {testimonialFilter === "APPROVED" && approvedTestimonials.length > 1 && (
              <div className="text-sm text-gray-500 mb-2">
                💡 드래그하여 순서를 변경할 수 있습니다
              </div>
            )}

            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">추천사가 없습니다</div>
            ) : testimonialFilter === "APPROVED" ? (
              // Sortable list for approved testimonials
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={approvedTestimonials.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {approvedTestimonials.map((t) => (
                      <SortableTestimonialCard
                        key={t.id}
                        testimonial={t}
                        onEdit={() => setEditingTestimonial(t)}
                        onStatusChange={updateTestimonialStatus}
                        onDelete={deleteTestimonial}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              // Regular list for other filters
              <div className="space-y-4">
                {filteredTestimonials.map((t) => (
                  <TestimonialCard
                    key={t.id}
                    testimonial={t}
                    onEdit={() => setEditingTestimonial(t)}
                    onStatusChange={updateTestimonialStatus}
                    onDelete={deleteTestimonial}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">문의가 없습니다</div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "p-6 rounded-xl border",
                    c.status === "NEW"
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-sm text-gray-400">{c.email}</div>
                      {c.company && <div className="text-sm text-gray-500">{c.company}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{formatDate(c.createdAt)}</span>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded",
                          c.status === "NEW" && "bg-blue-500/20 text-blue-400",
                          c.status === "READ" && "bg-gray-500/20 text-gray-400",
                          c.status === "REPLIED" && "bg-green-500/20 text-green-400",
                          c.status === "ARCHIVED" && "bg-white/10 text-gray-500"
                        )}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                  {c.subject && <div className="font-medium text-white mb-2">{c.subject}</div>}
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{c.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 
                                 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> 이메일 보내기
                    </a>
                    {c.status === "NEW" && (
                      <button
                        onClick={() => updateContact(c.id, "READ")}
                        className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"
                      >
                        읽음 처리
                      </button>
                    )}
                    {c.status !== "REPLIED" && (
                      <button
                        onClick={() => updateContact(c.id, "REPLIED")}
                        className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"
                      >
                        답변 완료
                      </button>
                    )}
                    {c.status !== "ARCHIVED" && (
                      <button
                        onClick={() => updateContact(c.id, "ARCHIVED")}
                        className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"
                      >
                        보관
                      </button>
                    )}
                    <button
                      onClick={() => deleteContact(c.id)}
                      className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Comments */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">댓글이 없습니다</div>
            ) : (
              comments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  onToggle={toggleComment}
                  onDelete={deleteComment}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        )}

        {/* Newsletter */}
        {activeTab === "newsletter" && (
          <div className="space-y-4">
            {/* Stats summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="text-2xl font-bold text-green-400">
                  {subscribers.filter(s => s.status === "ACTIVE").length}
                </div>
                <div className="text-sm text-gray-400">활성 구독자</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold text-gray-300">
                  {subscribers.filter(s => s.status === "UNSUBSCRIBED").length}
                </div>
                <div className="text-sm text-gray-400">구독 취소</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold text-gray-300">
                  {subscribers.length}
                </div>
                <div className="text-sm text-gray-400">전체</div>
              </div>
            </div>

            {subscribers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">구독자가 없습니다</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/10">
                      <th className="pb-3 text-sm font-medium text-gray-400">이메일</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">상태</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">출처</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">구독일</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 text-white">{sub.email}</td>
                        <td className="py-4">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded",
                              sub.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{sub.source || "-"}</td>
                        <td className="py-4 text-gray-400">{formatDate(sub.subscribedAt)}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {sub.status === "ACTIVE" ? (
                              <button
                                onClick={() => updateSubscriberStatus(sub.id, "UNSUBSCRIBED")}
                                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                title="구독 취소"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => updateSubscriberStatus(sub.id, "ACTIVE")}
                                className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                                title="구독 복원"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteSubscriber(sub.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <TestimonialEditModal
          testimonial={editingTestimonial}
          onSave={saveTestimonial}
          onClose={() => setEditingTestimonial(null)}
        />
      )}
    </div>
  );
}

// Sortable testimonial card (for drag & drop)
function SortableTestimonialCard({
  testimonial,
  onEdit,
  onStatusChange,
  onDelete,
  formatDate,
}: {
  testimonial: Testimonial;
  onEdit: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TestimonialCard
        testimonial={testimonial}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        formatDate={formatDate}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

// Testimonial card component
function TestimonialCard({
  testimonial: t,
  onEdit,
  onStatusChange,
  onDelete,
  formatDate,
  dragHandleProps,
  isDragging,
}: {
  testimonial: Testimonial;
  onEdit: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border",
        t.status === "PENDING"
          ? "bg-yellow-500/10 border-yellow-500/30"
          : t.status === "APPROVED"
          ? "bg-green-500/10 border-green-500/30"
          : "bg-red-500/10 border-red-500/30",
        isDragging && "shadow-xl"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          {/* Drag handle (only for approved) */}
          {dragHandleProps && (
            <button
              {...dragHandleProps}
              className="mt-1 p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="font-medium text-white">{t.authorName}</div>
            {t.authorTitle && (
              <div className="text-sm text-gray-400">
                {t.authorTitle}
                {t.authorCompany && ` @ ${t.authorCompany}`}
              </div>
            )}
            {t.authorEmail && (
              <div className="text-sm text-gray-500">{t.authorEmail}</div>
            )}
            {t.authorUrl && (
              <a 
                href={t.authorUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline"
              >
                {t.authorUrl}
              </a>
            )}
            {t.relationship && (
              <div className="text-sm text-gray-500 italic mt-1">
                관계: {t.relationship}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "px-2 py-1 text-xs rounded",
              t.status === "PENDING" && "bg-yellow-500/20 text-yellow-400",
              t.status === "APPROVED" && "bg-green-500/20 text-green-400",
              t.status === "REJECTED" && "bg-red-500/20 text-red-400"
            )}
          >
            {t.status}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(t.createdAt)}
          </span>
          {t.displayOrder !== undefined && t.displayOrder !== null && (
            <span className="text-xs text-gray-500">
              #{t.displayOrder + 1}
            </span>
          )}
        </div>
      </div>
      <p className={cn(
        "text-gray-300 mb-4 whitespace-pre-wrap",
        dragHandleProps && "ml-8" // Indent content when drag handle present
      )}>{t.content}</p>
      <div className={cn(
        "flex items-center gap-2 flex-wrap",
        dragHandleProps && "ml-8"
      )}>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 
                     rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          <Pencil className="w-4 h-4" /> 수정
        </button>
        {t.status !== "APPROVED" && (
          <button
            onClick={() => onStatusChange(t.id, "APPROVED")}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 
                       rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <Check className="w-4 h-4" /> 승인
          </button>
        )}
        {t.status !== "REJECTED" && (
          <button
            onClick={() => onStatusChange(t.id, "REJECTED")}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 
                       rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <X className="w-4 h-4" /> 거절
          </button>
        )}
        <button
          onClick={() => onDelete(t.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-400 
                     rounded-lg hover:bg-white/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TestimonialEditModal({
  testimonial,
  onSave,
  onClose,
}: {
  testimonial: Testimonial;
  onSave: (data: Partial<Testimonial> & { id: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    authorName: testimonial.authorName,
    authorTitle: testimonial.authorTitle || "",
    authorCompany: testimonial.authorCompany || "",
    authorEmail: testimonial.authorEmail || "",
    authorUrl: testimonial.authorUrl || "",
    content: testimonial.content,
    relationship: testimonial.relationship || "",
    status: testimonial.status,
    displayOrder: testimonial.displayOrder ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: testimonial.id,
      ...form,
      displayOrder: form.displayOrder === "" ? undefined : Number(form.displayOrder),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-white mb-6">추천사 수정</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">이름 *</label>
              <input
                type="text"
                required
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
              <input
                type="email"
                value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">직함</label>
              <input
                type="text"
                value={form.authorTitle}
                onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">회사</label>
              <input
                type="text"
                value={form.authorCompany}
                onChange={(e) => setForm({ ...form, authorCompany: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">링크 (URL)</label>
            <input
              type="url"
              value={form.authorUrl}
              onChange={(e) => setForm({ ...form, authorUrl: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">관계</label>
            <input
              type="text"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="전 직장 동료, 프로젝트 협업 등"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">추천사 내용 *</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                         text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">상태</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Testimonial["status"] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">표시 순서</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="숫자 (낮을수록 먼저)"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border",
        highlight ? "bg-yellow-500/10 border-yellow-500/30" : "bg-white/5 border-white/10"
      )}
    >
      <div className="flex items-center gap-3 mb-2 text-gray-400">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function CommentCard({
  comment,
  onToggle,
  onDelete,
  formatDate,
  isReply = false,
}: {
  comment: Comment;
  onToggle: (id: string, isApproved: boolean) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  isReply?: boolean;
}) {
  return (
    <div className={cn(isReply && "ml-8")}>
      <div
        className={cn(
          "p-4 rounded-xl border",
          comment.isApproved ? "bg-white/5 border-white/10" : "bg-red-500/10 border-red-500/30"
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <span className="font-medium text-white">{comment.authorName}</span>
            {comment.authorEmail && (
              <span className="text-sm text-gray-500 ml-2">{comment.authorEmail}</span>
            )}
            <span className="text-sm text-gray-500 ml-2">on {comment.postSlug}</span>
          </div>
          <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-gray-300 mb-4">{comment.content}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(comment.id, !comment.isApproved)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
              comment.isApproved
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
            )}
          >
            {comment.isApproved ? (
              <>
                <X className="w-4 h-4" /> 숨기기
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> 공개
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-400 
                       rounded-lg hover:bg-white/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onToggle={onToggle}
              onDelete={onDelete}
              formatDate={formatDate}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
