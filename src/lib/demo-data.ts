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
  "Long-distance caregiving",
  "New to caregiving",
  "Partner or spouse care",
  "Balancing work and care",
  "Caregiver wellbeing",
] as const;

export const communityTopicGroups = [
  {
    id: "care-situation",
    label: "Care situation",
    topics: [
      "Aging parents",
      "New to caregiving",
      "Long-distance caregiving",
      "Partner or spouse care",
    ],
  },
  {
    id: "health-conditions",
    label: "Health conditions",
    topics: [
      "Dementia & memory loss",
      "Cancer care",
      "Stroke recovery",
      "Parkinson's",
      "Heart conditions",
      "Diabetes",
      "Mobility & disability",
    ],
  },
  {
    id: "daily-care",
    label: "Daily care",
    topics: [
      "Medication & appointments",
      "Mobility & disability",
      "Meals & nutrition",
      "Home safety",
    ],
  },
  {
    id: "work-family",
    label: "Work & family",
    topics: [
      "Balancing work and care",
      "Family coordination",
      "Financial & legal",
    ],
  },
  {
    id: "wellbeing",
    label: "My wellbeing",
    topics: ["Stress & burnout", "Grief & change", "Rest & self-care"],
  },
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
    title: "Ask taylorm about Saturday groceries",
    category: "household",
    completed: false,
    inFocus: false,
    createdAt: "2026-09-13T08:00:00.000Z",
  },
];

export const initialPosts: CarePost[] = [
  {
    id: "post-1",
    author: "samlee",
    topic: "New to caregiving",
    body:
      "My dad came home from the hospital yesterday and I felt frozen looking at all the instructions. I picked just one thing: organizing tomorrow's medication. That helped. What was your first small step?",
    createdAt: "34 min ago",
    reactions: 18,
    reacted: false,
    comments: [
      {
        id: "comment-1",
        author: "maria84",
        body:
          "Writing every question in one notebook helped me stop carrying them all in my head.",
        createdAt: "18 min ago",
      },
    ],
  },
  {
    id: "post-2",
    author: "davidk",
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
    author: "jenm",
    topic: "Dementia & memory loss",
    body:
      "Has anyone found a gentle way to handle repeated questions without making their parent feel corrected? Music has helped us reset some tense moments.",
    createdAt: "Yesterday",
    reactions: 12,
    reacted: false,
    comments: [
      {
        id: "comment-2",
        author: "ravi88",
        body:
          "I answer the feeling underneath the question first. It has made our conversations softer.",
        createdAt: "Yesterday",
      },
    ],
  },
  {
    id: "post-4",
    author: "maria84",
    topic: "Aging parents",
    body:
      "My siblings and I started a short Sunday planning call for appointments, groceries, and rides. Keeping it to fifteen minutes has made it easier for everyone to participate.",
    createdAt: "2 days ago",
    reactions: 27,
    reacted: false,
    comments: [
      {
        id: "comment-3",
        author: "tinaq",
        body:
          "We do something similar and rotate who sends the summary afterward.",
        createdAt: "2 days ago",
      },
    ],
  },
  {
    id: "post-5",
    author: "jordanr",
    topic: "Aging parents",
    body:
      "We are slowly preparing for a move. Letting my dad choose the first few meaningful things to bring made the conversation feel less like everything was being taken away.",
    createdAt: "4 days ago",
    reactions: 35,
    reacted: false,
    comments: [],
  },
  {
    id: "post-6",
    author: "lucyk",
    topic: "Aging parents",
    body:
      "A printed card beside the phone with family photos and names has made video calls much easier for my grandmother.",
    createdAt: "1 week ago",
    reactions: 19,
    reacted: false,
    comments: [
      {
        id: "comment-4",
        author: "taylorm",
        body: "I love how simple and respectful this is. I am going to try it.",
        createdAt: "6 days ago",
      },
    ],
  },
];

export const initialConnections: Connection[] = [
  {
    id: "connection-1",
    name: "maria84",
    summary: "Caring for a parent nearby while balancing a full-time job.",
    introduction:
      "I am learning how to coordinate appointments with my siblings without letting caregiving take over every conversation.",
    interests: ["Meal planning", "Neighborhood walks", "Audiobooks"],
    sharedTopics: ["Aging parents", "Balancing work and care"],
    recentPosts: [
      {
        id: "maria84-post-1",
        topic: "New to caregiving",
        body:
          "Writing every question in one notebook helped me stop carrying them all in my head.",
        createdAt: "18 min ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-2",
    name: "kevinj",
    summary: "New to long-distance caregiving and learning to share responsibility.",
    introduction:
      "I live a few hours away from my mom and am figuring out what support can look like when I cannot be there every day.",
    interests: ["Cooking", "Podcasts", "Weekend drives"],
    sharedTopics: ["Long-distance caregiving", "New to caregiving"],
    recentPosts: [
      {
        id: "kevinj-post-1",
        topic: "Long-distance caregiving",
        body:
          "A shared calendar made our family check-ins feel less like emergencies and more like a plan.",
        createdAt: "1 hr ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-3",
    name: "nora22",
    summary: "Finding small routines that make dementia care less isolating.",
    introduction:
      "Evenings are the hardest part of our day, so I am always interested in calm routines that make transitions gentler.",
    interests: ["Old movies", "Gardening", "Calm music"],
    sharedTopics: ["Dementia & memory loss", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "nora22-post-1",
        topic: "Dementia & memory loss",
        body:
          "Preparing the room before sunset has helped our evenings feel a little less tense.",
        createdAt: "Yesterday",
      },
      {
        id: "nora22-post-2",
        topic: "Caregiver wellbeing",
        body:
          "Today I sat outside for ten minutes before starting dinner. That pause mattered.",
        createdAt: "3 days ago",
      },
    ],
    status: "connected",
  },
  {
    id: "connection-4",
    name: "samlee",
    summary: "Adjusting after a parent returned home from the hospital.",
    introduction:
      "I am new to caregiving and trying to make each day manageable by choosing one practical next step.",
    interests: ["Tea", "Houseplants", "Simple routines"],
    sharedTopics: ["New to caregiving", "Aging parents"],
    recentPosts: [
      {
        id: "samlee-post-1",
        topic: "New to caregiving",
        body:
          "I picked just one thing after discharge: organizing tomorrow's medication. That helped.",
        createdAt: "34 min ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-5",
    name: "davidk",
    summary: "Balancing work messages, appointments, and changing capacity.",
    introduction:
      "I care for my aunt and am practicing being honest about what I can realistically do on difficult days.",
    interests: ["Baking", "Mystery novels", "Stretching"],
    sharedTopics: ["Balancing work and care", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "davidk-post-1",
        topic: "Balancing work and care",
        body:
          "Doing less than usual does not mean you are failing. Your capacity changed, not your worth.",
        createdAt: "2 hr ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-6",
    name: "jenm",
    summary: "Looking for gentle approaches to repeated questions.",
    introduction:
      "Music and familiar objects help my dad reset when a moment becomes confusing. I like sharing ideas that preserve dignity.",
    interests: ["Jazz", "Photography", "Family recipes"],
    sharedTopics: ["Dementia & memory loss", "Aging parents"],
    recentPosts: [
      {
        id: "jenm-post-1",
        topic: "Dementia & memory loss",
        body:
          "Has anyone found a gentle way to handle repeated questions? Music has helped us reset tense moments.",
        createdAt: "Yesterday",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-7",
    name: "ravi88",
    summary: "Supporting a parent by responding to feelings before facts.",
    introduction:
      "I have been caring for my mother for three years and have learned that emotional reassurance often matters most.",
    interests: ["Birdwatching", "Puzzles", "Morning coffee"],
    sharedTopics: ["Dementia & memory loss", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "ravi88-post-1",
        topic: "Dementia & memory loss",
        body:
          "I answer the feeling underneath the question first. It has made our conversations softer.",
        createdAt: "Yesterday",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-8",
    name: "tinaq",
    summary: "Coordinating care for both parents with a small family team.",
    introduction:
      "I enjoy turning complicated care plans into simple checklists everyone in the family can understand.",
    interests: ["Woodworking", "Baseball", "Checklists"],
    sharedTopics: ["Aging parents", "Balancing work and care"],
    recentPosts: [
      {
        id: "tinaq-post-1",
        topic: "Aging parents",
        body:
          "Our Sunday fifteen-minute family call works better than a long group text that never ends.",
        createdAt: "2 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-9",
    name: "omar77",
    summary: "Learning to ask friends for specific, practical help.",
    introduction:
      "I used to answer every offer with 'we are fine.' Now I keep a short list of errands someone else can actually do.",
    interests: ["Walking trails", "Soup recipes", "Local history"],
    sharedTopics: ["Caregiver wellbeing", "New to caregiving"],
    recentPosts: [
      {
        id: "omar77-post-1",
        topic: "Caregiver wellbeing",
        body:
          "People were more able to help when I asked for one grocery run instead of saying I needed support.",
        createdAt: "3 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-10",
    name: "lucyk",
    summary: "Helping a grandparent stay connected while living independently.",
    introduction:
      "My role is mostly companionship, transportation, and helping technology feel less frustrating.",
    interests: ["Knitting", "Public gardens", "Video calls"],
    sharedTopics: ["Aging parents", "Long-distance caregiving"],
    recentPosts: [
      {
        id: "lucyk-post-1",
        topic: "Aging parents",
        body:
          "We put printed photo labels next to the video-call buttons and it made calling family much easier.",
        createdAt: "4 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-11",
    name: "mattp",
    summary: "Sharing caregiving with siblings across different time zones.",
    introduction:
      "I handle paperwork while my brother manages appointments. Clear ownership has reduced a lot of resentment.",
    interests: ["Travel journals", "Yoga", "Spreadsheets"],
    sharedTopics: ["Long-distance caregiving", "Balancing work and care"],
    recentPosts: [
      {
        id: "mattp-post-1",
        topic: "Long-distance caregiving",
        body:
          "Dividing responsibilities by strength worked better for us than trying to split every task equally.",
        createdAt: "5 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-12",
    name: "janet62",
    summary: "Building a sustainable routine after caregiver burnout.",
    introduction:
      "I am rebuilding my energy slowly and trying to notice what can wait instead of treating everything as urgent.",
    interests: ["Watercolor", "Slow mornings", "Nature"],
    sharedTopics: ["Caregiver wellbeing", "Balancing work and care"],
    recentPosts: [
      {
        id: "janet62-post-1",
        topic: "Caregiver wellbeing",
        body:
          "My new rule is that one task can move to tomorrow without needing an apology.",
        createdAt: "1 week ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-13",
    name: "alexp",
    summary: "Navigating appointments and insurance for a partner.",
    introduction:
      "I keep notes on every phone call and enjoy helping others find clearer ways through confusing systems.",
    interests: ["Swimming", "Documentaries", "Organization"],
    sharedTopics: ["Balancing work and care", "New to caregiving"],
    recentPosts: [
      {
        id: "alexp-post-1",
        topic: "New to caregiving",
        body:
          "I started writing the date, name, and next step after every insurance call. It saves so much time later.",
        createdAt: "1 week ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-14",
    name: "kimberly9",
    summary: "Creating familiar sensory routines for dementia care.",
    introduction:
      "Scents, songs, and a predictable afternoon rhythm have helped us create more comfortable moments together.",
    interests: ["Gardening", "Folk music", "Bread making"],
    sharedTopics: ["Dementia & memory loss", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "kimberly9-post-1",
        topic: "Dementia & memory loss",
        body:
          "The smell of bread baking brought back a story I had not heard in years.",
        createdAt: "8 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-15",
    name: "chrisw",
    summary: "Supporting a parent while raising two school-age children.",
    introduction:
      "Our household is busy and imperfect. I am interested in routines that include everyone without overwhelming anyone.",
    interests: ["Family games", "Quick dinners", "Beach walks"],
    sharedTopics: ["Balancing work and care", "Aging parents"],
    recentPosts: [
      {
        id: "chrisw-post-1",
        topic: "Balancing work and care",
        body:
          "The kids now help pack a small activity bag before visits, which gives everyone a role.",
        createdAt: "9 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-16",
    name: "meganl",
    summary: "Recently stepping into a caregiving role for an older neighbor.",
    introduction:
      "I am not family, but I am the nearby person she trusts. I am learning how to help while respecting boundaries.",
    interests: ["Community events", "Cycling", "Libraries"],
    sharedTopics: ["New to caregiving", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "meganl-post-1",
        topic: "New to caregiving",
        body:
          "Asking what kind of help feels welcome has been more useful than guessing.",
        createdAt: "10 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-17",
    name: "danielc",
    summary: "Managing care from another state with local support.",
    introduction:
      "I rely on a small network of neighbors and professionals, and I am always refining how we communicate.",
    interests: ["Hiking", "Maps", "Memoirs"],
    sharedTopics: ["Long-distance caregiving", "Aging parents"],
    recentPosts: [
      {
        id: "danielc-post-1",
        topic: "Long-distance caregiving",
        body:
          "A one-page contact sheet helped everyone know who to call without searching through old messages.",
        createdAt: "11 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-18",
    name: "sophia5",
    summary: "Finding ways to rest while remaining available for care.",
    introduction:
      "I am practicing short, repeatable breaks instead of waiting for a completely free day that never arrives.",
    interests: ["Breathing exercises", "Ocean sounds", "Poetry"],
    sharedTopics: ["Caregiver wellbeing", "Balancing work and care"],
    recentPosts: [
      {
        id: "sophia5-post-1",
        topic: "Caregiver wellbeing",
        body:
          "Five quiet minutes in the car before going inside can be a real transition, not wasted time.",
        createdAt: "12 days ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-19",
    name: "jordanr",
    summary: "Helping a parent prepare for a move into assisted living.",
    introduction:
      "We are sorting belongings and making decisions slowly. I value honest conversations that still leave room for choice.",
    interests: ["Genealogy", "Classical music", "Photo albums"],
    sharedTopics: ["Aging parents", "New to caregiving"],
    recentPosts: [
      {
        id: "jordanr-post-1",
        topic: "Aging parents",
        body:
          "Choosing a few meaningful objects first made downsizing feel less like losing everything.",
        createdAt: "2 weeks ago",
      },
    ],
    status: "suggested",
  },
  {
    id: "connection-20",
    name: "taylorm",
    summary: "Sharing household support with a close family friend.",
    introduction:
      "I help with groceries, rides, and weekly check-ins. Small dependable commitments work best for me.",
    interests: ["Farmers markets", "Cooking", "Comedy"],
    sharedTopics: ["Aging parents", "Caregiver wellbeing"],
    recentPosts: [
      {
        id: "taylorm-post-1",
        topic: "Caregiver wellbeing",
        body:
          "Reliability can be more helpful than doing something big once. I chose one errand I can own every week.",
        createdAt: "2 weeks ago",
      },
    ],
    status: "suggested",
  },
];

export const initialConversations: Conversation[] = [
  {
    id: "conversation-1",
    person: "nora22",
    subtitle: "Connected through Dementia & memory loss",
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
  displayName: "hiyoglow",
  emailReminders: true,
  dailyReminderTime: "08:30",
  connectionLocation: "everywhere",
  connectionZipCode: "",
  topics: ["Aging parents", "New to caregiving", "Caregiver wellbeing"],
};

export const encouragements: Encouragement[] = [
  {
    id: "encouragement-1",
    text: "You are allowed to take this one gentle step at a time.",
    prompt: "What is one thing you can make easier for yourself today?",
  },
  {
    id: "encouragement-2",
    text:
      "Rest is not a reward for finishing everything. It is part of how you keep going.",
    prompt: "Choose one small pause and protect it.",
  },
  {
    id: "encouragement-3",
    text:
      "You can love someone deeply and still find caregiving difficult.",
    prompt: "Name one feeling without trying to fix it.",
  },
  {
    id: "encouragement-4",
    text:
      "May you feel held by something larger than this difficult moment.",
    prompt: "Take one slow breath and notice what gives you steadiness.",
  },
  {
    id: "encouragement-5",
    text:
      "There is grace in the care you offer, and grace in receiving care yourself.",
    prompt: "What support could you let in today?",
  },
  {
    id: "encouragement-6",
    text:
      "You do not have to finish everything for today to have been meaningful.",
    prompt: "Choose one thing that can wait until tomorrow.",
  },
  {
    id: "encouragement-7",
    text:
      "The care you give counts, even when no one sees how much effort it takes.",
    prompt: "Notice one quiet thing you handled today.",
  },
  {
    id: "encouragement-8",
    text:
      "A difficult moment does not define the whole day.",
    prompt: "What small part of today felt a little lighter?",
  },
  {
    id: "encouragement-9",
    text:
      "You can be grateful for someone and still feel tired from caring for them.",
    prompt: "Let two different feelings be true at the same time.",
  },
  {
    id: "encouragement-10",
    text:
      "Taking care of yourself helps make care more sustainable.",
    prompt: "Give yourself ten minutes without a task attached.",
  },
  {
    id: "encouragement-11",
    text:
      "You are allowed to ask for clarity, time, and help.",
    prompt: "Write down one question you do not need to solve alone.",
  },
  {
    id: "encouragement-12",
    text:
      "Small routines can carry you when motivation feels far away.",
    prompt: "Choose one familiar action that helps you feel steady.",
  },
  {
    id: "encouragement-13",
    text:
      "Care does not need to be perfect to be loving.",
    prompt: "Release one expectation that is making today heavier.",
  },
  {
    id: "encouragement-14",
    text:
      "Your needs still matter inside someone else's difficult season.",
    prompt: "Name one need you can acknowledge without judging it.",
  },
  {
    id: "encouragement-15",
    text:
      "You have permission to move through this day at a human pace.",
    prompt: "Slow down one part of your routine today.",
  },
  {
    id: "encouragement-16",
    text:
      "Some days, showing up with what you have is more than enough.",
    prompt: "What is the smallest version of today's hardest task?",
  },
  {
    id: "encouragement-17",
    text:
      "You can pause before deciding what needs your attention next.",
    prompt: "Take one breath before moving to the next thing.",
  },
  {
    id: "encouragement-18",
    text:
      "Your effort matters even when the outcome is outside your control.",
    prompt: "Separate what you can influence from what you cannot.",
  },
  {
    id: "encouragement-19",
    text:
      "There can still be moments of warmth inside a demanding day.",
    prompt: "Notice one ordinary moment you would like to remember.",
  },
  {
    id: "encouragement-20",
    text:
      "You deserve the same patience you offer to the people you care for.",
    prompt: "Speak to yourself as you would to someone you love.",
  },
];
