"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  encouragements,
  initialConnections,
  initialConversations,
  initialPosts,
  initialSettings,
  initialTasks,
} from "@/lib/demo-data";
import { toggleFocusTask } from "@/lib/task-utils";
import type {
  CarePost,
  CareSettings,
  CareTask,
  Connection,
  Conversation,
  Encouragement,
} from "@/lib/types";

type CareState = {
  tasks: CareTask[];
  posts: CarePost[];
  connections: Connection[];
  conversations: Conversation[];
  settings: CareSettings;
  encouragement: Encouragement;
};

type CareContextValue = CareState & {
  previewMode: true;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  toggleTaskFocus: (id: string) => void;
  addPost: (body: string, tags: string[]) => void;
  addComment: (postId: string, body: string) => void;
  toggleReaction: (postId: string) => void;
  requestConnection: (id: string) => void;
  sendMessage: (conversationId: string, body: string) => void;
  updateSettings: (settings: Partial<CareSettings>) => void;
  rotateEncouragement: () => void;
  resetPreview: () => void;
};

const STORAGE_KEY = "caretogether-preview-state-v2";

function getInitialState(): CareState {
  return {
    tasks: initialTasks,
    posts: initialPosts,
    connections: initialConnections,
    conversations: initialConversations,
    settings: initialSettings,
    encouragement: encouragements[0],
  };
}

const CareContext = createContext<CareContextValue | null>(null);

export function CareProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CareState;
        const initial = getInitialState();
        const legacyIds: Record<string, string> = {
          harborlight: "maria84",
          warmmaple: "kevinj",
          quietharbor: "nora22",
          morningfern: "samlee",
          softcedar: "davidk",
          bluewindow: "jenm",
          goldenpine: "ravi88",
          steadyoak: "tinaq",
          riverstone: "omar77",
          willowpath: "lucyk",
          kindredsky: "mattp",
          ambertrail: "janet62",
          calmcurrent: "alexp",
          mossgarden: "kimberly9",
          brightcove: "chrisw",
          silverleaf: "meganl",
          openmeadow: "danielc",
          gentlewave: "sophia5",
          northstar: "jordanr",
          sunlit: "taylorm",
        };
        const migrateId = (id: string) => legacyIds[id] ?? id;
        const migratedPosts = parsed.posts.map((post) => ({
          ...post,
          author: migrateId(post.author),
          topic:
            post.topic === "Dementia care"
              ? "Dementia & memory loss"
              : post.topic,
          comments: post.comments.map((comment) => ({
            ...comment,
            author: migrateId(comment.author),
          })),
        }));
        setState({
          ...initial,
          ...parsed,
          tasks: parsed.tasks.map((task) => ({
            ...task,
            title: task.title.replace("sunlit", "taylorm"),
          })),
          posts: [
            ...migratedPosts,
            ...initial.posts.filter(
              (post) =>
                !migratedPosts.some((savedPost) => savedPost.id === post.id),
            ),
          ],
          connections: initial.connections.map((connection) => ({
            ...connection,
            status:
              parsed.connections.find((savedConnection) =>
                savedConnection.id === connection.id
              )?.status ?? connection.status,
          })),
          conversations: parsed.conversations.map((conversation) => ({
            ...conversation,
            person: migrateId(conversation.person),
          })),
          settings: {
            ...initial.settings,
            ...parsed.settings,
            topics: parsed.settings.topics.filter(
              (topic) => topic !== "Dementia care",
            ),
          },
        });
      } catch (error) {
        console.error("Could not load the CareTogether preview state", error);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo<CareContextValue>(
    () => ({
      ...state,
      previewMode: true,
      addTask(title) {
        const task: CareTask = {
          id: crypto.randomUUID(),
          title,
          category: "care",
          completed: false,
          inFocus: false,
          createdAt: new Date().toISOString(),
        };
        setState((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
        }));
      },
      toggleTask(id) {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === id
              ? task.completed
                ? { ...task, completed: false }
                : { ...task, completed: true, inFocus: false }
              : task,
          ),
        }));
      },
      toggleTaskFocus(id) {
        setState((current) => ({
          ...current,
          tasks: toggleFocusTask(current.tasks, id),
        }));
      },
      addPost(body, tags) {
        setState((current) => ({
          ...current,
          posts: [
            {
              id: crypto.randomUUID(),
              author: current.settings.displayName,
              topic: tags[0] ?? "General",
              tags,
              body,
              createdAt: "Just now",
              reactions: 0,
              reacted: false,
              comments: [],
            },
            ...current.posts,
          ],
        }));
      },
      addComment(postId, body) {
        setState((current) => ({
          ...current,
          posts: current.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: crypto.randomUUID(),
                      author: current.settings.displayName,
                      body,
                      createdAt: "Just now",
                    },
                  ],
                }
              : post,
          ),
        }));
      },
      toggleReaction(postId) {
        setState((current) => ({
          ...current,
          posts: current.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  reacted: !post.reacted,
                  reactions: post.reactions + (post.reacted ? -1 : 1),
                }
              : post,
          ),
        }));
      },
      requestConnection(id) {
        setState((current) => ({
          ...current,
          connections: current.connections.map((connection) =>
            connection.id === id
              ? { ...connection, status: "pending" }
              : connection,
          ),
        }));
      },
      sendMessage(conversationId, body) {
        setState((current) => ({
          ...current,
          conversations: current.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unread: 0,
                  messages: [
                    ...conversation.messages,
                    {
                      id: crypto.randomUUID(),
                      sender: "me",
                      body,
                      createdAt: new Intl.DateTimeFormat("en", {
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date()),
                    },
                  ],
                }
              : conversation,
          ),
        }));
      },
      updateSettings(settings) {
        setState((current) => ({
          ...current,
          settings: { ...current.settings, ...settings },
        }));
      },
      rotateEncouragement() {
        setState((current) => {
          const currentIndex = encouragements.findIndex(
            (item) => item.id === current.encouragement.id,
          );
          const nextIndex = (currentIndex + 1) % encouragements.length;
          return {
            ...current,
            encouragement: encouragements[nextIndex],
          };
        });
      },
      resetPreview() {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(getInitialState());
      },
    }),
    [state],
  );

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
  const context = useContext(CareContext);

  if (!context) {
    throw new Error("useCare must be used within CareProvider");
  }

  return context;
}
