export type TaskCategory =
  | "care"
  | "appointment"
  | "paperwork"
  | "household"
  | "self-care";

export type CareTask = {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  inFocus: boolean;
  dueLabel?: string;
  createdAt: string;
};

export type CareComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type CarePost = {
  id: string;
  author: string;
  topic: string;
  tags?: string[];
  body: string;
  createdAt: string;
  reactions: number;
  reacted: boolean;
  comments: CareComment[];
};

export type Connection = {
  id: string;
  name: string;
  summary: string;
  introduction: string;
  interests: string[];
  sharedTopics: string[];
  recentPosts: {
    id: string;
    topic: string;
    body: string;
    createdAt: string;
  }[];
  status: "suggested" | "pending" | "connected";
};

export type CareMessage = {
  id: string;
  sender: "me" | "them";
  body: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  person: string;
  subtitle: string;
  unread: number;
  messages: CareMessage[];
};

export type CareSettings = {
  displayName: string;
  emailReminders: boolean;
  dailyReminderTime: string;
  connectionLocation: "everywhere" | "zipcode";
  connectionZipCode: string;
  topics: string[];
};

export type Encouragement = {
  id: string;
  text: string;
  attribution?: string;
  prompt: string;
};
