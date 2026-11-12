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
  version: 7,
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
        {
          id: "web-experience",
          label:
            "How would you describe your current experience in web development?",
          type: "textarea",
        },
        {
          id: "web-areas",
          label: "Which areas of web development have you explored?",
          type: "multi",
          options: [
            { id: "frontend", label: "Frontend development" },
            { id: "backend", label: "Backend development" },
            { id: "full-stack", label: "Full-stack development" },
            { id: "ui-ux", label: "UI/UX design" },
            { id: "deployment", label: "Deployment and hosting" },
            { id: "other", label: "Other" },
          ],
        },
        {
          id: "web-stack",
          label: "What is the primary tech stack you work with?",
          type: "textarea",
          maxLength: 1000,
        },
        {
          id: "web-project",
          label:
            "What is the name of your project, and what problem does it solve?",
          hint: "About your best web project. If you haven’t built one yet, write NA.",
          type: "textarea",
        },
        {
          id: "web-project-tech",
          label: "Explain the technologies and tools used in this project.",
          hint: "Write NA if you haven’t built a project yet.",
          type: "textarea",
        },
        {
          id: "web-project-role",
          label:
            "What was your role, and which features did you implement yourself?",
          hint: "Write NA if you haven’t built a project yet.",
          type: "textarea",
        },
        {
          id: "web-project-links",
          label: "GitHub repository and live deployment",
          hint: "Add the repository and, if it’s deployed, the live link. Skip this if you haven’t built a project yet.",
          type: "links",
          required: false,
          maxLinks: 4,
        },
        {
          id: "web-why",
          label: "Why do you want to join the GDGC Web Development team?",
          type: "textarea",
        },
        {
          id: "web-interest",
          label: "What interests you most about web development?",
          type: "textarea",
        },
        {
          id: "web-learning",
          label:
            "What are you learning now, or planning to explore next, in web development?",
          type: "textarea",
        },
        {
          id: "web-contribute",
          label:
            "What kind of projects or contributions would you like to work on at GDGC?",
          type: "textarea",
        },
        {
          id: "web-resume",
          label: "Google Drive link to your latest resume (PDF)",
          hint: "Upload your resume to Google Drive and set sharing to “Anyone with the link can view”.",
          type: "links",
          required: false,
          maxLinks: 1,
          notes: false,
        },
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
        {
          id: "ui-inspiration",
          label: "What inspires your design style the most?",
          hint: "For example minimalism, storytelling, problem-solving, or motion.",
          type: "textarea",
        },
        {
          id: "ui-process",
          label:
            "Explain your design process briefly, from idea to final prototype.",
          type: "textarea",
        },
        {
          id: "ui-project",
          label:
            "Pick one of your favorite design projects and tell us about it.",
          hint: "What was the goal? What problem were you solving? How did you measure success?",
          type: "textarea",
        },
        {
          id: "ui-feedback",
          label: "How do you handle feedback on your designs?",
          type: "textarea",
        },
        {
          id: "ui-priority",
          label:
            "What’s more important to you, usability or visual appeal? Why?",
          type: "textarea",
        },
        {
          id: "ui-tools",
          label: "Which tools are you most comfortable using?",
          type: "multi",
          required: false,
          options: [
            { id: "figma", label: "Figma" },
            { id: "adobe-xd", label: "Adobe XD" },
            { id: "illustrator", label: "Illustrator" },
            { id: "photoshop", label: "Photoshop" },
            { id: "after-effects", label: "After Effects" },
            { id: "other", label: "Other" },
          ],
        },
        {
          id: "ui-work",
          label: "What kind of design work do you enjoy most?",
          type: "multi",
          options: [
            { id: "ui-design", label: "UI design" },
            { id: "ux-research", label: "UX research" },
            { id: "prototyping", label: "Prototyping and interaction" },
            { id: "branding", label: "Branding" },
            { id: "motion", label: "Motion and micro-interactions" },
            { id: "frontend", label: "Frontend collaboration" },
          ],
        },
        {
          id: "ui-showcase",
          label: "A recent UI/UX project you’re proud of",
          hint: "Add a link to a screenshot, Figma file, Behance page, or portfolio, and say what it shows. Skip this if you haven’t made one yet.",
          type: "links",
          required: false,
          maxLinks: 3,
        },
        {
          id: "ui-flaw",
          label:
            "Describe one usability flaw you often notice in modern apps and how you’d fix it.",
          type: "textarea",
        },
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
      preview:
        "Bring an idea to a phone. Explore Flutter, React Native, iOS, or Android.",
      note: [
        "Hi, I’m Rishi, and I’m leading App Development this year.",
        "This is a short form, and it isn’t a test. Nothing here decides anything on its own. We’re a really chill domain, and we’d love to build with you.",
        "Our team is small right now, but we want to grow it a lot this year. Whether you’ve shipped an app or never opened Android Studio, please apply.",
        "Filled the brownie points form after my orientation talk? That form only asked for your name and branch, so use the same name and branch here and we’ll match it.",
        "You can message me anywhere, anytime. I’m open to anything: https://rishia.in/links, or WhatsApp or call me on +91 99159 72220.",
      ],
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
          "Explore one of these four tracks alongside the shared basics.",
        tracks: [
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
            title: "React Native · JavaScript",
            items: [
              "JavaScript or TypeScript basics: variables, functions, arrays, objects, and async/await",
              "Components, props, and state with useState",
              "View, Text, Image, Pressable, and FlatList",
              "Styling with StyleSheet and Flexbox",
              "Stack navigation with React Navigation",
            ],
          },
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
        {
          id: "mobile-track",
          label: "Which track are you applying for?",
          type: "choice",
          options: [
            {
              id: "flutter",
              label: "Flutter",
              description: "Dart · one codebase for Android and iOS",
            },
            {
              id: "react-native",
              label: "React Native",
              description: "JavaScript · one codebase for Android and iOS",
            },
            {
              id: "swift",
              label: "Swift",
              description: "SwiftUI · native iOS, needs a Mac",
            },
            {
              id: "kotlin",
              label: "Kotlin",
              description: "Android Studio · native Android",
            },
            {
              id: "undecided",
              label: "Not sure yet",
              description: "We’ll help you pick",
            },
          ],
        },
        {
          id: "mobile-machine",
          label: "Which laptop will you build on?",
          hint: "Swift and Xcode run only on a Mac. Any laptop works for Flutter, React Native, and Kotlin.",
          type: "choice",
          options: [
            { id: "mac", label: "Mac" },
            { id: "windows", label: "Windows" },
            { id: "linux", label: "Linux" },
            { id: "none", label: "No laptop yet" },
          ],
        },
        {
          id: "mobile-ram",
          label: "How much RAM does it have?",
          hint: "Android emulators run best with 16 GB. With 8 GB you can test on your own phone instead. This helps us plan; it won’t rule you out.",
          type: "choice",
          when: {
            questionId: "mobile-machine",
            equals: ["mac", "windows", "linux"],
          },
          options: [
            { id: "8-or-less", label: "8 GB or less" },
            { id: "16", label: "16 GB" },
            { id: "more", label: "More than 16 GB" },
            { id: "unsure", label: "Not sure" },
          ],
        },
        {
          id: "mobile-level",
          label: "Where are you with app development right now?",
          type: "choice",
          options: [
            { id: "new", label: "New to it" },
            {
              id: "practice",
              label: "Followed tutorials or built practice apps",
            },
            { id: "built", label: "Built a complete app, alone or in a team" },
            {
              id: "published",
              label: "Published an app (Play Store, App Store, or TestFlight)",
            },
          ],
        },
        {
          id: "mobile-project",
          label: "Your best project: its name and what it does",
          type: "text",
          maxLength: 200,
          when: {
            questionId: "mobile-level",
            equals: ["practice", "built", "published"],
          },
        },
        {
          id: "mobile-project-role",
          label: "What did you build yourself?",
          hint: "Your part, what was hard, and what you would improve.",
          type: "textarea",
          when: {
            questionId: "mobile-level",
            equals: ["practice", "built", "published"],
          },
        },
        {
          id: "mobile-project-links",
          label: "Links to see it",
          hint: "A GitHub repo, store listing, demo video, or a Drive folder with screenshots and code. A README isn’t needed. Say what each link shows, and make sure anyone with the link can open it.",
          type: "links",
          maxLinks: 5,
          when: {
            questionId: "mobile-level",
            equals: ["practice", "built", "published"],
          },
        },
        {
          id: "mobile-other-project",
          label: "Another project",
          hint: "Its name, your part, and a link.",
          type: "textarea",
          required: false,
          maxLength: 1500,
          when: {
            questionId: "mobile-level",
            equals: ["practice", "built", "published"],
          },
        },
        {
          id: "mobile-idea",
          label: "Describe an app you’d like to build",
          hint: "The problem it solves, its main screens, and which track you’d use.",
          type: "textarea",
          when: { questionId: "mobile-level", equals: "new" },
        },
        {
          id: "mobile-explain",
          label:
            "Pick one topic from the expectations you already understand, and explain it as if you were teaching a friend.",
          hint: "A few sentences is plenty.",
          type: "textarea",
          maxLength: 1500,
        },
        {
          id: "mobile-favorite-app",
          label: "Which app on your phone feels the best to use, and why?",
          type: "textarea",
          required: false,
          maxLength: 1000,
        },
        {
          id: "mobile-brownie",
          label:
            "Did you fill the App Dev brownie points form after the orientation talk?",
          hint: "If yes, use the same name and branch as on that form so we can match it.",
          type: "choice",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
        },
      ],
    },
    {
      id: "wit",
      preview:
        "Help more women find their community and participate in technology.",
      applications: false,
      membership:
        "No separate application. If you’re eligible for Women in Tech, joining any GDGC domain also makes you part of WiT.",
    },
    {
      id: "devsecops",
      preview: "Understand what keeps software running, connected, and secure.",
      expectations: {
        intro:
          "Topics progress from foundational concepts to advanced orchestration and exploitation. Newer students should focus on building a strong conceptual foundation. Second-year students are expected to focus on practical implementation and understanding how systems work under the hood.",
        groups: [
          {
            title: "Shared basics",
            items: [
              "What exactly happens when two devices communicate across a network?",
            ],
            sections: [
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
                title: "Git and GitHub",
                items: [
                  "Commits, branching, merging, pull requests, and .gitignore",
                ],
              },
              {
                title: "Basic scripting",
                items: ["Automating tasks using Bash or Python"],
              },
            ],
          },
          {
            title: "DevOps — Infrastructure & Cloud",
            items: [
              "Build practical experience with infrastructure and cloud deployments.",
            ],
            sections: [
              {
                title: "Systems and remote access",
                items: [
                  "Background services via systemd and daemon management",
                  "SSH and key-based authentication",
                ],
              },
              {
                title: "Web servers and traffic",
                items: [
                  "Reverse proxies versus load balancers",
                  "Nginx or Apache basics and SSL/TLS certificates",
                ],
              },
              {
                title: "Containers and deployment",
                items: [
                  "Virtualization versus containerization",
                  "Docker fundamentals: images, writing a Dockerfile, port mapping, volumes, and Docker Compose",
                  "Deploying applications to a PaaS such as Vercel or Render, or to a Linux cloud VM",
                ],
              },
              {
                title: "Cloud IAM and policies",
                items: [
                  "Managing role-based access control (RBAC)",
                  "Configuring AWS/Azure identity and resource policies, including S3 bucket policies, EC2 roles, and permissions boundaries",
                ],
              },
              {
                title: "CI/CD and automation",
                items: [
                  "Automating builds, tests, and deployments using GitHub Actions or GitLab CI",
                ],
              },
            ],
          },
          {
            title: "Cybersecurity — Offensive / Red Team",
            items: [
              "We care more about your approach to understanding systems and the process you follow to exploit them.",
            ],
            sections: [
              {
                title: "Security fundamentals",
                items: [
                  "The CIA triad and authentication versus authorization",
                  "Understanding cookies, sessions, and JWTs",
                ],
              },
              {
                title: "Cryptography basics",
                items: [
                  "Encoding (Base64) versus hashing (MD5, SHA-256, bcrypt) versus encryption (symmetric and asymmetric)",
                ],
              },
              {
                title: "Reconnaissance and scanning",
                items: [
                  "Information gathering, footprinting, and port scanning with Nmap",
                  "Directory fuzzing with ffuf or Gobuster",
                  "Packet inspection with Wireshark or tcpdump",
                ],
              },
              {
                title: "Web exploitation",
                items: [
                  "Intercepting and modifying HTTP requests with Burp Suite or Caido",
                  "Vulnerabilities including SQLi, XSS, CSRF, IDOR, SSRF, and more",
                  "The OWASP Top 10 is key",
                ],
              },
              {
                title: "System exploitation",
                items: [
                  "Linux privilege escalation basics: SUID binaries, sudo misconfigurations, and cron jobs",
                  "Understanding reverse and bind shells",
                ],
              },
            ],
          },
          {
            title: "Cybersecurity — Defensive / Blue Team",
            items: [
              "Secure, monitor, and investigate systems once they are running.",
            ],
            sections: [
              {
                title: "Security Operations (SOC) & monitoring",
                items: [
                  "Centralized log management and configuring SIEM/SOAR",
                  "Identifying brute-force attempts and detecting anomalous traffic",
                  "Hunting for indicators of compromise (IoCs) in server and network logs",
                ],
              },
              {
                title: "Incident Response (IR)",
                items: [
                  "The IR lifecycle: Preparation, Identification, Containment, Eradication, and Recovery",
                  "Triaging security alerts to distinguish false positives from actual breaches",
                ],
              },
              {
                title: "Digital Forensics (DFIR)",
                items: [
                  "Disk and memory imaging concepts and timeline analysis",
                  "Preserving the chain of custody",
                  "Basic malware static analysis: extracting strings and inspecting file signatures and magic bytes",
                ],
              },
            ],
          },
        ],
        outro:
          "Don’t let the heavy terminology panic you. We’ll secure the system once it’s turned on.",
      },
      questions: [
        {
          id: "devsecops-certs",
          label:
            "Do you have any certifications? (If you do, please lend us some money. Just kidding!)",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-hardware",
          label:
            "Anything you’ve done in IoT or hardware hacking? Even network jamming or any other cool stuff.",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-os",
          label: "Which OS do you use?",
          hint: "iykyk",
          type: "text",
        },
        {
          id: "devsecops-os-setup",
          label: "How do you run your OS?",
          type: "choice",
          options: [
            { id: "installed", label: "Installed directly on my machine" },
            { id: "dual-boot", label: "Dual boot" },
            { id: "vm", label: "In a virtual machine" },
            { id: "wsl", label: "WSL" },
            { id: "other", label: "Something else" },
          ],
        },
        {
          id: "devsecops-deployed",
          label: "Have you ever deployed a project? Tell us about it.",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-terminal",
          label: "How comfortable are you with the terminal and scripting?",
          hint: "Pick everything that applies.",
          type: "multi",
          options: [
            { id: "basic", label: "Basic navigation" },
            {
              id: "regular",
              label: "Regular use, including advanced commands",
            },
            { id: "scripts", label: "Writing Bash or Python scripts" },
          ],
        },
        {
          id: "devsecops-stack",
          label: "What is your tech stack?",
          hint: "Pick everything you’ve used. Skip it if none yet.",
          type: "multi",
          required: false,
          options: [
            { id: "git", label: "Git" },
            { id: "docker", label: "Docker" },
            { id: "jenkins", label: "Jenkins" },
            { id: "kubernetes", label: "Kubernetes" },
            { id: "terraform", label: "Terraform" },
            { id: "aws", label: "AWS" },
            { id: "gcp", label: "GCP" },
            { id: "azure", label: "Azure" },
            { id: "other", label: "Other" },
          ],
        },
        {
          id: "devsecops-why-security",
          label: "What made you choose cybersecurity as a career domain?",
          hint: "Applying for the DevOps side? Write N/A.",
          type: "textarea",
        },
        {
          id: "devsecops-team",
          label: "Which side of security interests you?",
          type: "multi",
          required: false,
          options: [
            { id: "red", label: "Red team" },
            { id: "blue", label: "Blue team" },
            { id: "other", label: "Other" },
          ],
        },
        {
          id: "devsecops-tools",
          label: "What security tools are you familiar with?",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-attacks",
          label:
            "Describe one or two attacks or vulnerabilities you can carry out or know about.",
          hint: "Write it in your own words. We’d rather read your bad grammar than a chatbot. No DoS or DDoS, please.",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-profiles",
          label:
            "Blog or write-up profile, TryHackMe, HTB, or any other platform you practice on",
          hint: "Add a link and say what it is. Skip this if you don’t have one yet.",
          type: "links",
          required: false,
          maxLinks: 4,
        },
        {
          id: "devsecops-ctf",
          label: "CTF experience, and any bug bounty or VDP experience",
          hint: "If any.",
          type: "textarea",
          required: false,
        },
        {
          id: "devsecops-why",
          label: "Why do you want to be part of the GDGC DevSecOps team?",
          type: "textarea",
        },
      ],
    },
    {
      id: "creatives",
      preview:
        "Tell the chapter’s stories through design, words, and visual content.",
      expectations: {
        intro:
          "You do not need to be a tech expert to join the Creatives team. We are looking for people who get things done and help run our events smoothly. You also do not have to know everything: we do not expect you to handle posters, video editing, and management all at once. Being good at just one of these areas is more than enough.",
        groups: [
          {
            title: "What we look for",
            items: [
              "Event management and coordination: people who can talk to people, handle logistics, and manage things on the ground while an event is happening",
              "Video editing: no professional software or flashy transitions needed. If you can use a basic app like CapCut to put together a clean, well-edited reel for our socials, you are good to go",
              "Poster designing: we want our posters to look sharp and catchy. An eye for layouts, colours, and decent design sense fits right in",
              "Acting and directing: ideas for reels or short videos, the ability to execute them, or being comfortable in front of the camera",
            ],
          },
        ],
        outro:
          "We will not judge you on perfection. If you have taken even one step into any of these areas, we will help you explore the rest while you grow with us.",
      },
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
