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
  getEncouragementsForRole,
  getInitialTasksForRole,
  initialConnections,
  initialConversations,
  initialPosts,
  initialSettings,
  initialSharedTaskLists,
  initialTasks,
  isDemoTaskList,
} from "@/lib/demo-data";
import { toggleFocusTask } from "@/lib/task-utils";
import type {
  CarePost,
  CareSettings,
  CareTask,
  Connection,
  Conversation,
  Encouragement,
  SharedTaskList,
} from "@/lib/types";

type CareState = {
  tasks: CareTask[];
  posts: CarePost[];
  connections: Connection[];
  conversations: Conversation[];
  sharedTaskLists: SharedTaskList[];
  settings: CareSettings;
  encouragement: Encouragement;
};

type CareContextValue = CareState & {
  previewMode: true;
  addTask: (title: string, inFocus?: boolean) => void;
  addTasks: (tasks: { title: string; detail?: string }[]) => void;
  toggleTask: (id: string) => void;
  toggleTaskFocus: (id: string) => void;
  shareTaskList: (recipientId: string) => void;
  toggleSharedTask: (listId: string, taskId: string) => void;
  markSharedTaskListsSeen: () => void;
  addPost: (body: string, tags: string[]) => void;
  addComment: (postId: string, body: string) => void;
  toggleReaction: (postId: string) => void;
  requestConnection: (id: string) => void;
  markConversationRead: (conversationId: string) => void;
  sendMessage: (conversationId: string, body: string) => void;
  updateSettings: (settings: Partial<CareSettings>) => void;
  rotateEncouragement: () => void;
  resetPreview: () => void;
};

const STORAGE_KEY = "bemylight-preview-state-v3";
const LEGACY_STORAGE_KEY = "caretogether-preview-state-v3";

function getInitialState(): CareState {
  return {
    tasks: initialTasks,
    posts: initialPosts,
    connections: initialConnections,
    conversations: initialConversations,
    sharedTaskLists: initialSharedTaskLists,
    settings: initialSettings,
    encouragement: encouragements[0],
  };
}

const CareContext = createContext<CareContextValue | null>(null);

export function CareProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CareState;
        const initial = getInitialState();
        setState({
          ...initial,
          ...parsed,
          posts: [
            ...parsed.posts,
            ...initial.posts.filter(
              (post) =>
                !parsed.posts.some((savedPost) => savedPost.id === post.id),
            ),
          ],
          connections: initial.connections.map((connection) => ({
            ...connection,
            status:
              parsed.connections.find(
                (savedConnection) => savedConnection.id === connection.id,
              )?.status ?? connection.status,
          })),
          sharedTaskLists: [
            ...parsed.sharedTaskLists,
            ...initial.sharedTaskLists.filter(
              (list) =>
                !parsed.sharedTaskLists.some(
                  (savedList) => savedList.id === list.id,
                ),
            ),
          ],
          settings: {
            ...initial.settings,
            ...parsed.settings,
          },
        });
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (error) {
        console.error("Could not load the Be My Light preview state", error);
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
      addTask(title, inFocus = false) {
        const task: CareTask = {
          id: crypto.randomUUID(),
          title,
          category: "care",
          completed: false,
          inFocus,
          createdAt: new Date().toISOString(),
        };
        setState((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
        }));
      },
      addTasks(newTaskInputs) {
        const createdAt = new Date().toISOString();
        const newTasks: CareTask[] = newTaskInputs.map((input) => ({
          id: crypto.randomUUID(),
          title: input.title,
          detail: input.detail?.trim() ? input.detail.trim() : undefined,
          category: "care",
          completed: false,
          inFocus: false,
          createdAt,
        }));
        if (newTasks.length === 0) return;
        setState((current) => ({
          ...current,
          tasks: [...newTasks, ...current.tasks],
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
      shareTaskList(recipientId) {
        setState((current) => ({
          ...current,
          sharedTaskLists: [
            {
              id: crypto.randomUUID(),
              ownerId: current.settings.displayName || "you",
              recipientId,
              sharedAt: "Just now",
              audience:
                current.settings.communityRole === "affected"
                  ? "affected"
                  : "caregiver",
              seen: true,
              tasks: current.tasks
                .filter((task) => !task.completed)
                .map((task) => ({
                  id: task.id,
                  title: task.title,
                  detail: task.detail,
                  completed: task.completed,
                })),
            },
            ...current.sharedTaskLists,
          ],
        }));
      },
      toggleSharedTask(listId, taskId) {
        setState((current) => ({
          ...current,
          sharedTaskLists: current.sharedTaskLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tasks: list.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, completed: !task.completed }
                      : task,
                  ),
                }
              : list,
          ),
        }));
      },
      markSharedTaskListsSeen() {
        setState((current) => {
          if (current.sharedTaskLists.every((list) => list.seen)) {
            return current;
          }
          return {
            ...current,
            sharedTaskLists: current.sharedTaskLists.map((list) =>
              list.seen ? list : { ...list, seen: true },
            ),
          };
        });
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
              audience:
                current.settings.communityRole === "affected"
                  ? "affected"
                  : "caregiver",
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
      markConversationRead(conversationId) {
        setState((current) => ({
          ...current,
          conversations: current.conversations.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unread: 0 }
              : conversation,
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
        setState((current) => {
          const nextSettings = { ...current.settings, ...settings };
          const roleChanged =
            settings.communityRole !== undefined &&
            settings.communityRole !== current.settings.communityRole;
          const reseedTasks = roleChanged && isDemoTaskList(current.tasks);
          return {
            ...current,
            settings: nextSettings,
            tasks: reseedTasks
              ? getInitialTasksForRole(nextSettings.communityRole)
              : current.tasks,
            encouragement: roleChanged
              ? getEncouragementsForRole(nextSettings.communityRole)[0]
              : current.encouragement,
          };
        });
      },
      rotateEncouragement() {
        setState((current) => {
          const roleEncouragements = getEncouragementsForRole(
            current.settings.communityRole,
          );
          const currentIndex = roleEncouragements.findIndex(
            (item) => item.id === current.encouragement.id,
          );
          const nextIndex = (currentIndex + 1) % roleEncouragements.length;
          return {
            ...current,
            encouragement: roleEncouragements[nextIndex],
          };
        });
      },
      resetPreview() {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
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
