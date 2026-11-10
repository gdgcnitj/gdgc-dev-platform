import { defineInductionCycle } from "@/lib/inductions/schema";

// Replace the remaining sample prompts with the department leads' final questions.
// Bump version whenever questions, common fields, or their validation change.
const question = (id: string, label: string) => ({
  id,
  label,
  type: "textarea" as const,
  sample: true,
});

export const inductions2026 = defineInductionCycle({
  id: "inductions-2026",
  eventId: "inductions-2026",
  version: 2,
  departments: [
    {
      id: "web",
      preview: "From the browser to the backend. Build things people can use.",
      expectations: {
        groups: [
          {
            title: "Web fundamentals",
            items: [
              "Full-stack, frontend, and backend fundamentals",
              "REST APIs, HTTP methods and status codes",
              "Routing and middleware",
            ],
          },
          {
            title: "Building applications",
            items: [
              "Database integration and CRUD operations",
              "Authentication and authorization",
              "WebSockets and real-time communication",
              "API testing",
            ],
          },
          {
            title: "Shipping together",
            items: [
              "Deployment basics, environment variables, error handling, and debugging",
              "Git and GitHub, version control, branching and merging",
              "Pull requests and resolving conflicts",
            ],
          },
        ],
      },
      questions: [
        question(
          "web-interest",
          "What is one website you would like to build, and who would use it?",
        ),
      ],
    },
    {
      id: "ai",
      preview:
        "Explore data, understand models, and turn an idea into an experiment.",
      expectations: {
        groups: [
          {
            title: "Python and mathematics",
            items: [
              "Lists, dictionaries, functions, and problem solving",
              "NumPy, Pandas, and Scikit-learn",
              "Linear algebra and basic calculus",
            ],
          },
          {
            title: "Probability and statistics",
            items: [
              "Expectation values, distributions, and hypothesis testing",
              "Correlation versus causation",
            ],
          },
          {
            title: "Working with data",
            items: [
              "Missing values, outliers, data types, and categorical encoding",
              "Charts, plots, and choosing the right visualization",
              "Exploratory data analysis, interpreting data, and feature engineering",
            ],
          },
          {
            title: "Models and evaluation",
            items: [
              "Linear and logistic regression, decision trees, random forests, and ensemble learning",
              "SVM and K-means clustering",
              "Perceptrons, forward and backpropagation, activation functions, and gradient descent",
              "Bias–variance trade-off and train, test, and validation splits",
            ],
          },
        ],
      },
      questions: [
        {
          id: "ai-interest",
          type: "textarea",
          label: "What do you do in AI? What is your interest or field in AI?",
          hint: "You can write General, ML, or AI if you are still exploring.",
        },
        {
          id: "ai-motivation",
          type: "textarea",
          label:
            "Why is joining GDGC AI important to you? Why do you want to join us?",
        },
      ],
    },
    {
      id: "ui",
      preview: "Make technology easier to understand, use, and enjoy.",
      expectations: {
        groups: [
          {
            title: "People and process",
            items: [
              "Introduction to UI/UX and user-centered design",
              "User needs, personas, design thinking, and user research methods",
            ],
          },
          {
            title: "Structure and visuals",
            items: [
              "Information architecture, wireframes, and low-fidelity prototypes",
              "Visual hierarchy, layout, color theory, and typography",
              "Iconography and imagery",
            ],
          },
          {
            title: "Interaction and evaluation",
            items: [
              "Accessibility, inclusive design, and interaction basics",
              "Usability testing, feedback loops, and iterative improvements",
              "Responsive design, micro-interactions, and motion principles",
            ],
          },
          {
            title: "Tools and communication",
            items: [
              "Figma fundamentals, component systems, and consistent design systems",
              "Collaboration with FigJam or Miro",
              "Portfolio presentation and case study writing",
            ],
          },
        ],
      },
      questions: [
        question(
          "ui-interest",
          "Pick an app you use. What is one screen you would improve, and why?",
        ),
      ],
    },
    {
      id: "cp",
      preview:
        "Find the pattern, think through the trade-offs, and solve the problem.",
      expectations: {
        intro:
          "CP Induction 2026–27 · Preparation syllabus for first- and second-year students.",
        groups: [
          {
            title: "First-year students",
            items: [
              "Focus on programming fundamentals, logical reasoning, and basic DSA.",
            ],
            sections: [
              {
                title: "Round 1 · Programming basics",
                items: [
                  "Variables, data types, operators, loops, and conditions",
                  "Functions and basic recursive functions",
                  "Arrays and strings",
                  "Basic number problems: prime, palindrome, factorial, and similar problems",
                ],
              },
              {
                title: "Round 1 · Data structures and algorithms",
                items: [
                  "Searching: linear search and binary search",
                  "Sorting: bubble sort, selection sort, and insertion sort",
                  "Array problems: reversal, second largest, missing number, and similar problems",
                  "Basic greedy problems",
                ],
              },
              {
                title: "Round 1 · MCQs and pseudocode",
                items: [
                  "Output prediction and dry runs",
                  "Loop tracing and debugging",
                  "Programming fundamentals and DSA basics",
                  "Basic time-complexity analysis",
                ],
              },
              {
                title: "Round 2 · Technical interview",
                items: [
                  "Programming fundamentals and basic DSA",
                  "Approach to solving a coding problem",
                  "Code and logic explanation",
                  "Communication, consistency, and eagerness to learn",
                ],
              },
            ],
          },
          {
            title: "Second-year students",
            items: [
              "Expect stronger DSA proficiency, algorithmic problem-solving, and knowledge of advanced topics, including dynamic programming.",
            ],
            sections: [
              {
                title: "Round 1 · Core DSA",
                items: [
                  "Arrays, strings, hashing, and prefix sums",
                  "Two pointers and sliding window",
                  "Binary search and sorting",
                  "Linked lists, stacks, and queues",
                  "Trees, binary search trees (BST), and heaps",
                  "Graphs: BFS, DFS, and shortest path",
                  "Greedy algorithms",
                  "Bit manipulation",
                  "Dynamic programming",
                ],
              },
              {
                title: "Round 1 · MCQs and pseudocode",
                items: [
                  "Time and space complexity",
                  "Code tracing and debugging",
                  "Data structures and algorithms",
                  "DP recurrence and graph traversal logic",
                ],
              },
              {
                title: "Round 2 · Technical interview",
                items: [
                  "DSA concepts and complexity analysis",
                  "Improving brute-force solutions",
                  "Problem-solving and code implementation",
                  "Explaining approaches and edge cases",
                  "Communication, collaboration, and commitment",
                ],
              },
            ],
          },
          {
            title: "Selection criteria",
            items: [
              "Candidates are evaluated on technical knowledge, problem-solving ability, code quality, communication skills, and eagerness to learn.",
            ],
          },
        ],
      },
      questions: [
        question(
          "cp-interest",
          "How do you approach a programming problem you have not seen before?",
        ),
      ],
    },
    {
      id: "mobile",
      preview: "Bring an idea to a phone. Explore iOS, Flutter, or Android.",
      expectations: {
        groups: [
          {
            title: "Shared basics",
            items: [
              "Object-oriented programming: classes, objects, and inheritance",
              "Simple problem solving: reversing a string, summing a list, and factorial logic",
              "MVVM and MVC architecture",
            ],
          },
        ],
        tracksIntro:
          "Explore one of these three tracks alongside the shared basics.",
        tracks: [
          {
            title: "Swift · iOS",
            items: [
              "Swift syntax, variables, optionals, and functions",
              "Struct versus class, @State, and @Binding",
              "SwiftUI: VStack, HStack, ZStack, Text, Button, and Image",
              "Basic state management, such as a counter app",
              "Navigation and NavigationStack basics",
            ],
          },
          {
            title: "Flutter · Dart",
            items: [
              "Dart variables, functions, lists, maps, and null safety",
              "Stateless and Stateful Widgets",
              "Column, Row, Container, Text, Image, and Scaffold",
              "setState(), widget rebuilds, and the widget tree",
              "MaterialApp → Scaffold → Body",
            ],
          },
          {
            title: "Kotlin · Android",
            items: [
              "Kotlin syntax, val versus var, functions, and null safety (?, !!)",
              "Android Studio, activities, MainActivity, and XML layouts",
              "findViewById and setOnClickListener",
              "Intents and navigating between activities",
              "TextView, Button, and EditText",
            ],
          },
        ],
      },
      questions: [
        question(
          "mobile-interest",
          "What is one mobile app you would like to build, and why?",
        ),
      ],
    },
    {
      id: "wit",
      preview:
        "Help more women find their community and participate in technology.",
      questions: [
        question(
          "wit-interest",
          "What is one activity you would suggest to help more women participate in technology?",
        ),
      ],
    },
    {
      id: "devsecops",
      preview: "Understand what keeps software running, connected, and secure.",
      expectations: {
        groups: [
          {
            title: "Linux",
            items: [
              "Commands, the filesystem, permissions, and package management",
              "Shell scripting, process management, environment variables, and system logs",
            ],
          },
          {
            title: "Networking",
            items: [
              "OSI and TCP/IP models, IP addressing, DNS, and DHCP",
              "HTTP, ports, protocols, firewalls, and NAT",
              "Network tools, VPNs, and proxies",
            ],
          },
          {
            title: "Collaboration",
            items: [
              "Version control basics and Git setup",
              "Branching, merging, merge conflicts, and .gitignore",
              "GitHub/GitLab collaboration, pull requests, and code reviews",
            ],
          },
        ],
      },
      questions: [
        question(
          "devsecops-interest",
          "What would you like to learn about deploying or securing an application?",
        ),
      ],
    },
    {
      id: "creatives",
      preview:
        "Tell the chapter’s stories through design, words, and visual content.",
      questions: [
        {
          id: "creative-preferences",
          type: "ranking",
          label:
            "Rank your interest in the following fields from highest to lowest preference.",
          hint: "Highest preference first. Drag to reorder, or use the up and down buttons.",
          options: [
            {
              id: "video-editing",
              label: "Video editing",
            },
            {
              id: "poster-designing",
              label: "Poster designing",
            },
            {
              id: "reel-making",
              label: "Acting / Directing (Reel making)",
            },
            {
              id: "event-management",
              label: "Event management",
            },
            {
              id: "art-decoration",
              label: "Art and decoration",
            },
          ],
        },
        {
          id: "creative-tools",
          type: "text",
          label:
            "What skills or tools do you use for your top-preference fields?",
        },
        {
          id: "creative-work",
          type: "textarea",
          label:
            "Share your past work or projects. If it was a group project, mention your exact contribution.",
          hint: "For photos or videos, paste a public Google Drive link with access set to “Anyone with the link”. For event management, describe what you handled.",
          maxLength: 4000,
        },
        {
          id: "creative-social-presence",
          type: "choice",
          label:
            "Do you run or maintain a public social media page where you post creative content (posts, reels, etc.)?",
          options: [
            {
              id: "yes",
              label: "Yes",
            },
            {
              id: "no",
              label: "No",
            },
          ],
        },
        {
          id: "creative-social-content",
          type: "textarea",
          label:
            "Share the link and briefly describe what type of content you post.",
          when: {
            questionId: "creative-social-presence",
            equals: "yes",
          },
        },
      ],
    },
  ],
});
