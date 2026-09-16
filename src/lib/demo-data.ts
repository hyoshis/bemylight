import type {
  CarePost,
  CareSettings,
  CareTask,
  Connection,
  Conversation,
  Encouragement,
} from "@/lib/types";

export const careTopics = [
  "Aging parents",
  "Dementia care",
  "Long-distance caregiving",
  "New to caregiving",
  "Balancing work and care",
  "Caregiver wellbeing",
] as const;

export const initialTasks: CareTask[] = [
  {
    id: "task-1",
    title: "Confirm Thursday's appointment",
    category: "appointment",
    completed: true,
    inFocus: true,
    dueLabel: "Today",
    createdAt: "2026-09-15T08:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Refill the weekly pill organizer",
    category: "care",
    completed: false,
    inFocus: true,
    dueLabel: "Tonight",
    createdAt: "2026-09-15T08:05:00.000Z",
  },
  {
    id: "task-3",
    title: "Take a ten-minute walk",
    category: "self-care",
    completed: false,
    inFocus: true,
    createdAt: "2026-09-15T08:10:00.000Z",
  },
  {
    id: "task-4",
    title: "Review the insurance letter",
    category: "paperwork",
    completed: false,
    inFocus: false,
    dueLabel: "This week",
    createdAt: "2026-09-14T08:00:00.000Z",
  },
  {
    id: "task-5",
    title: "Ask Maya about Saturday groceries",
    category: "household",
    completed: false,
    inFocus: false,
    createdAt: "2026-09-13T08:00:00.000Z",
  },
];

export const initialPosts: CarePost[] = [
  {
    id: "post-1",
    author: "Morning Fern",
    topic: "New to caregiving",
    body:
      "My dad came home from the hospital yesterday and I felt frozen looking at all the instructions. I picked just one thing: organizing tomorrow's medication. That helped. What was your first small step?",
    createdAt: "34 min ago",
    reactions: 18,
    reacted: false,
    comments: [
      {
        id: "comment-1",
        author: "Harbor Light",
        body:
          "Writing every question in one notebook helped me stop carrying them all in my head.",
        createdAt: "18 min ago",
      },
    ],
  },
  {
    id: "post-2",
    author: "Soft Cedar",
    topic: "Balancing work and care",
    body:
      "A reminder for anyone answering emails from a waiting room: doing less than usual does not mean you are failing. Your capacity changed, not your worth.",
    createdAt: "2 hr ago",
    reactions: 41,
    reacted: true,
    comments: [],
  },
  {
    id: "post-3",
    author: "Blue Window",
    topic: "Dementia care",
    body:
      "Has anyone found a gentle way to handle repeated questions without making their parent feel corrected? Music has helped us reset some tense moments.",
    createdAt: "Yesterday",
    reactions: 12,
    reacted: false,
    comments: [
      {
        id: "comment-2",
        author: "Golden Pine",
        body:
          "I answer the feeling underneath the question first. It has made our conversations softer.",
        createdAt: "Yesterday",
      },
    ],
  },
];

export const initialConnections: Connection[] = [
  {
    id: "connection-1",
    name: "Harbor Light",
    summary:
      "Caring for a parent nearby while balancing a full-time job.",
    sharedTopics: ["Aging parents", "Balancing work and care"],
    status: "suggested",
  },
  {
    id: "connection-2",
    name: "Warm Maple",
    summary:
      "New to long-distance caregiving and learning to share responsibility.",
    sharedTopics: ["Long-distance caregiving", "New to caregiving"],
    status: "suggested",
  },
  {
    id: "connection-3",
    name: "Quiet Harbor",
    summary: "Finding small routines that make dementia care less isolating.",
    sharedTopics: ["Dementia care", "Caregiver wellbeing"],
    status: "connected",
  },
];

export const initialConversations: Conversation[] = [
  {
    id: "conversation-1",
    person: "Quiet Harbor",
    subtitle: "Connected through Dementia care",
    unread: 1,
    messages: [
      {
        id: "message-1",
        sender: "them",
        body:
          "Hi. I saw your comment about difficult evenings. Ours can be hard too. No pressure to reply quickly.",
        createdAt: "7:42 PM",
      },
      {
        id: "message-2",
        sender: "me",
        body:
          "Thank you for saying that. It helps just knowing someone else understands.",
        createdAt: "7:51 PM",
      },
      {
        id: "message-3",
        sender: "them",
        body:
          "Absolutely. One thing that has helped us is preparing the room before sunset. I can share more if that would be useful.",
        createdAt: "8:03 PM",
      },
    ],
  },
];

export const initialSettings: CareSettings = {
  displayName: "Quiet Lantern",
  encouragementPreference: "secular",
  emailReminders: true,
  dailyReminderTime: "08:30",
  topics: ["Aging parents", "New to caregiving", "Caregiver wellbeing"],
};

export const encouragements: Encouragement[] = [
  {
    id: "encouragement-1",
    type: "secular",
    text: "You are allowed to take this one gentle step at a time.",
    prompt: "What is one thing you can make easier for yourself today?",
  },
  {
    id: "encouragement-2",
    type: "secular",
    text:
      "Rest is not a reward for finishing everything. It is part of how you keep going.",
    prompt: "Choose one small pause and protect it.",
  },
  {
    id: "encouragement-3",
    type: "secular",
    text:
      "You can love someone deeply and still find caregiving difficult.",
    prompt: "Name one feeling without trying to fix it.",
  },
  {
    id: "encouragement-4",
    type: "spiritual",
    text:
      "May you feel held by something larger than this difficult moment.",
    prompt: "Take one slow breath and notice what gives you steadiness.",
  },
  {
    id: "encouragement-5",
    type: "spiritual",
    text:
      "There is grace in the care you offer, and grace in receiving care yourself.",
    prompt: "What support could you let in today?",
  },
];
