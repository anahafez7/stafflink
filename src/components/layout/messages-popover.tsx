import { useState } from "react";
import { MessageSquare, Send, CheckCheck, Circle, Search, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type MessageThread = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

const initialThreads: MessageThread[] = [
  {
    id: "1",
    name: "Omar Saleh",
    role: "Operations Manager",
    avatar: "",
    initials: "OS",
    lastMessage: "Please review the shift roster for next week's Cairo team.",
    time: "5m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Yara Mansour",
    role: "HR Manager",
    avatar: "",
    initials: "YM",
    lastMessage: "July onboarding documents for 3 candidates are verified.",
    time: "25m ago",
    unread: 1,
    online: true,
  },
  {
    id: "3",
    name: "Mai Gaber",
    role: "Payroll Officer",
    avatar: "",
    initials: "MG",
    lastMessage: "The August payroll preview draft is ready for approval.",
    time: "2h ago",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Lina Habib",
    role: "Software Engineer",
    avatar: "",
    initials: "LH",
    lastMessage: "Submitted my leave request for the Alexandria conference.",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
];

export function MessagesPopover() {
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");

  const totalUnread = threads.reduce((acc, t) => acc + t.unread, 0);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, lastMessage: replyText, time: "Just now", unread: 0 }
          : t
      )
    );
    toast.success(`Message sent to ${activeThread?.name}`);
    setReplyText("");
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Messages"
          className="relative hidden sm:inline-flex min-h-10 min-w-10 rounded-xl hover:bg-muted/80 transition-colors"
        >
          <MessageSquare className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
          {totalUnread > 0 && (
            <span className="absolute right-2 top-2 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-brand"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 rounded-2xl p-0 shadow-2xl border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Team Messages</h3>
            {totalUnread > 0 && (
              <Badge variant="secondary" className="bg-brand/10 text-brand text-[11px] font-medium border-0 px-2">
                {totalUnread} unread
              </Badge>
            )}
          </div>
          {activeThreadId ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveThreadId(null)}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              Back to all
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => {
                setThreads((prev) => prev.map((t) => ({ ...t, unread: 0 })));
                toast.info("All messages marked as read");
              }}
              title="Mark all read"
            >
              <CheckCheck className="size-4" />
            </Button>
          )}
        </div>

        {activeThreadId && activeThread ? (
          /* Active Chat View */
          <div className="flex flex-col h-[340px] bg-background">
            <div className="flex items-center gap-3 p-3 border-b border-border bg-muted/20">
              <div className="relative">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-brand/15 text-brand text-xs font-semibold">
                    {activeThread.initials}
                  </AvatarFallback>
                </Avatar>
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{activeThread.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{activeThread.role}</p>
              </div>
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              <div className="flex flex-col items-start gap-1 max-w-[85%]">
                <span className="text-[10px] text-muted-foreground px-1">{activeThread.name} · {activeThread.time}</span>
                <div className="rounded-2xl rounded-tl-sm bg-secondary p-3 text-xs leading-relaxed text-foreground shadow-sm">
                  {activeThread.lastMessage}
                </div>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-border bg-card flex gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${activeThread.name}...`}
                className="h-9 rounded-xl text-xs bg-secondary/50 focus-visible:ring-brand"
                autoFocus
              />
              <Button type="submit" size="icon" className="size-9 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shrink-0">
                <Send className="size-3.5" />
              </Button>
            </form>
          </div>
        ) : (
          /* Threads List View */
          <div className="flex flex-col h-[340px]">
            <div className="p-2.5 border-b border-border bg-card/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats or team..."
                  className="h-8 pl-8 rounded-lg text-xs bg-secondary/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border/60">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setThreads((prev) =>
                      prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t))
                    );
                  }}
                  className="w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-brand/10 text-brand text-xs font-semibold">
                        {thread.initials}
                      </AvatarFallback>
                    </Avatar>
                    {thread.online && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-xs text-foreground truncate">{thread.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{thread.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-snug">
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="grid size-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground shrink-0">
                      {thread.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
