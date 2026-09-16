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
  TaskCategory,
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
  addTask: (title: string, category: TaskCategory) => void;
  toggleTask: (id: string) => void;
  toggleTaskFocus: (id: string) => void;
  addPost: (body: string, topic: string) => void;
  addComment: (postId: string, body: string) => void;
  toggleReaction: (postId: string) => void;
  requestConnection: (id: string) => void;
  sendMessage: (conversationId: string, body: string) => void;
  updateSettings: (settings: Partial<CareSettings>) => void;
  rotateEncouragement: () => void;
  resetPreview: () => void;
};

const STORAGE_KEY = "caretogether-preview-state";

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
        setState(JSON.parse(saved) as CareState);
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
      addTask(title, category) {
        const task: CareTask = {
          id: crypto.randomUUID(),
          title,
          category,
          completed: false,
          inFocus:
            state.tasks.filter((item) => item.inFocus).length < 3,
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
              ? { ...task, completed: !task.completed }
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
      addPost(body, topic) {
        setState((current) => ({
          ...current,
          posts: [
            {
              id: crypto.randomUUID(),
              author: current.settings.displayName,
              topic,
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
          const eligible = encouragements.filter(
            (item) =>
              item.type === current.settings.encouragementPreference &&
              item.id !== current.encouragement.id,
          );
          return {
            ...current,
            encouragement: eligible[0] ?? current.encouragement,
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
