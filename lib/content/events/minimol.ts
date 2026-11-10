import { defineEvent } from "@/lib/events/schema";

export const minimol = defineEvent({
  id: "minimol",
  slug: "minimol",
  title: "MiniMol",
  kind: "hackathon",
  summary:
    "MiniMol featured an intensive 8-hour development round in which participating teams conceptualized, designed, and developed functional prototypes and MVPs evaluated by mentors and judges.",
  status: "completed",
  visibility: "published",
  color: "yellow",
  date: {
    label: "1 November 2026",
    timeLabel: "9:30 am – 6:10 pm",
    startsAt: "2026-11-01T09:30:00+05:30",
    endsAt: "2026-11-01T18:10:00+05:30",
  },
  location: {
    mode: "in-person",
    name: "CC 301, NIT Jalandhar",
  },
  media: [
    {
      id: "moment-1",
      src: "/images/events/minimol2026/image1.jpg",
      alt: "Participants developing prototypes in CC 301 computer lab",
      caption: "Teams immersed in the 8-hour development sprint at CC 301.",
      kind: "photo",
    },
    {
      id: "moment-2",
      src: "/images/events/minimol2026/image2.jpg",
      alt: "Teams coding and collaborating with laptops and workstations",
      caption:
        "Collaborative problem-solving and software development in full swing.",
      kind: "photo",
    },
    {
      id: "moment-3",
      src: "/images/events/minimol2026/image3.jpg",
      alt: "Mentors and judges evaluating a team demonstration",
      caption:
        "Live project evaluation and pitch demonstration with GDGC mentors.",
      kind: "photo",
    },
  ],
  coverId: "moment-3",
  registration: {
    mode: "none",
  },
  homepage: {
    featured: false,
  },
  sections: [
    {
      id: "recap",
      type: "story",
      title: "A day of building, together.",
      navLabel: "Recap",
      paragraphs: [
        "That's a wrap! 8 hours of intense coding, prototyping, and pitching. Congratulations to all the winning teams!",
      ],
    },
    {
      id: "results",
      type: "results",
      title: "Winners & Results",
      navLabel: "Results",
      items: [
        {
          trackId: "main",
          rank: "Winner (1st Place)",
          team: "Team Dev Ansh Pandey",
          prize: "₹4,000 Cash Prize · Direct Entry to HackMOL 8.0",
        },
        {
          trackId: "main",
          rank: "1st Runner Up (2nd Place)",
          team: "Team Md Zayan",
          prize: "₹2,500 Cash Prize · Club Induction Spots",
        },
        {
          trackId: "main",
          rank: "2nd Runner Up (3rd Place)",
          team: "Team Day_zero",
          prize: "₹1,500 Cash Prize · Club Induction Spots",
        },
        {
          trackId: "freshers",
          rank: "Winner",
          team: "Team Data Crushers",
          prize: "₹2,000 Cash Prize · Club Induction Spots",
        },
      ],
    },
    {
      id: "challenges",
      type: "challenges",
      title: "Problem Statements",
      navLabel: "Challenges",
      description:
        "Official problem statements for MiniMol 2026. Teams had 8 hours to design, build, and deploy functional prototypes evaluated across rigorous benchmarks.",
      tracks: [
        {
          id: "main",
          title: "Main Track",
          description:
            "Distributed systems, peer-to-peer compute, and multi-agent AI architecture.",
        },
        {
          id: "freshers",
          title: "Freshers Track",
          description:
            "Dedicated challenge exclusively for first-year builders focusing on UI/UX and practical utility.",
        },
      ],
      statements: [
        {
          id: "p2p-inference",
          trackId: "main",
          title: "P2P Mobile Mesh Inference",
          tagline:
            "Split-execution Byte-Level Micro-Transformer running across two physical smartphones over local WebRTC DataChannel.",
          badge: "WebRTC & Web CPU",
          highlights: [
            "11.04M Parameters",
            "Web CPU Only",
            "Zero Native Installs",
            "PyTorch Seed 42",
          ],
          objective:
            "Build a web application that runs distributed text generation for a Byte-Level Micro-Transformer across two physical mobile phones connected over a local peer-to-peer network. The forward pass is split across both phones in real time so both devices collaborate to generate every single byte.",
          runtime: {
            target: "Stock Mobile Browsers (iOS Safari / Android Chrome)",
            description:
              "JavaScript / WebAssembly on CPU. Strictly zero app installations, APKs, or browser developer flags.",
            mandate:
              "Judges pair two random phones of their choice to measure tokens-per-second throughput.",
          },
          specs: [
            {
              label: "Model Architecture",
              value: "Vanilla Causal Decoder Transformer (GPT-style)",
            },
            {
              label: "Vocabulary Size",
              value: "256 (Raw ASCII / UTF-8 bytes; no tokenizer)",
            },
            {
              label: "Context Length",
              value: "512 tokens (max_seq_len)",
            },
            {
              label: "Transformer Layers",
              value: "6 layers (Phone 1: 0–2, Phone 2: 3–5)",
            },
            {
              label: "Hidden / FF Dim",
              value: "d_model = 384, d_ff = 1536 (4 × d_model)",
            },
            {
              label: "Parameter Count",
              value: "11,040,768 (~11.04M params, ~44.16 MB in FP32)",
            },
            {
              label: "Weight Generation",
              value: "PyTorch seed 42 deterministic FP32 weights",
            },
          ],
          architecture: {
            summary:
              "Phone 1 computes embeddings and layers 0–2, then transmits activations over WebRTC DataChannel. Phone 2 computes layers 3–5, final projection, samples the next byte, and sends it back to Phone 1 to continue generation.",
            steps: [
              {
                step: "01. Pairing",
                description:
                  "Phones pair via WebRTC DataChannel using local QR signaling.",
              },
              {
                step: "02. Stage 1 (Phone 1)",
                description:
                  "Runs token embeddings and Transformer Layers 0–2 on Web CPU.",
              },
              {
                step: "03. Local Transport",
                description:
                  "Intermediate activation tensor is sent directly across WebRTC DataChannel.",
              },
              {
                step: "04. Stage 2 (Phone 2)",
                description:
                  "Runs Layers 3–5, output projection, and samples the next byte token.",
              },
              {
                step: "05. Feedback Loop",
                description:
                  "Sends token back to Phone 1 to append to context and repeat autoregression.",
              },
            ],
            notes: [
              "Weights are initialized with seed 42 so all implementations evaluate against identical ground-truth outputs at temperature = 0.0.",
            ],
          },
          hardRequirements: [
            "P2P Split Execution: Weights and forward pass must be split across both phones (3 layers each). Neither phone can execute the full model alone.",
            "Local Peer Transport: All activations and byte tokens must travel directly between phones via WebRTC DataChannel.",
            "Standalone Runtime: All text generation must run completely offline/locally across the two phones once loaded.",
            "Zero Native Installs: Must run in stock mobile Safari/Chrome without APK sideloading or browser flags.",
          ],
          strictlyProhibited: [
            "NO native applications, APKs, TestFlight, or developer profiles.",
            "NO WebGPU or WebGL shaders - compute must run strictly on Web CPU.",
            "NO cloud or remote server offloading of compute or activations during inference.",
            "NO centralized TURN data relays during inference - local P2P transfer only.",
          ],
          icon: "cpu",
        },
        {
          id: "hivenet-storage",
          trackId: "main",
          title: "HiveNet: Distributed Edge Storage & Smart Router",
          tagline:
            "Decentralized serverless cloud drive pooling local filesystem storage across devices with telemetry-based smart routing.",
          badge: "Standalone App & Mesh Storage",
          highlights: [
            "Replication Factor ≥ 2",
            "Client-Side Compression",
            "Standalone App Only",
            "No Cloud Buckets",
          ],
          objective:
            "Build a decentralized, peer-to-peer cloud storage standalone application (HiveNet) where multiple connected devices (smartphones/laptops) pool their local filesystem storage into a unified, serverless cloud drive. Every uploaded image is compressed client-side, and an intelligent storage router dynamically dispatches chunks to the optimal nodes.",
          runtime: {
            target: "Standalone Application (Mobile or Desktop)",
            description:
              "Flutter, React Native, Expo, Kotlin Multiplatform, Swift, Kotlin, Tauri, Electron, or Go/Rust GUI.",
            mandate:
              "Strictly standalone apps using native filesystem I/O. Web browsers are prohibited.",
          },
          specs: [
            {
              label: "Runtime Category",
              value: "Standalone native desktop or mobile app",
            },
            {
              label: "Storage Engine",
              value: "Native filesystem, local app sandbox, or raw disk I/O",
            },
            {
              label: "Replication Factor",
              value: "RF ≥ 2 (Minimum 2 distinct redundant storage nodes)",
            },
            {
              label: "Compression",
              value:
                "Mandatory client-side WebP/AVIF, downscaling, or quantization",
            },
            {
              label: "Addressing",
              value: "Content-addressable hashes across the peer mesh",
            },
          ],
          architecture: {
            summary:
              "The storage router evaluates peer telemetry (available disk quota, latency, and uptime) to dispatch redundant chunks across the network, ensuring zero data loss if a node disconnects.",
            steps: [
              {
                step: "01. Compression",
                description:
                  "Client app compresses raw image before network transmission.",
              },
              {
                step: "02. Telemetry Query",
                description:
                  "Router evaluates connected peers: available disk quota, ping/latency, and stability.",
              },
              {
                step: "03. Smart Routing",
                description:
                  "Dispatches redundant copies or chunks to 2+ optimal peer nodes (RF ≥ 2).",
              },
              {
                step: "04. Mesh Gallery",
                description:
                  "Any connected device can browse file catalog and retrieve images on demand.",
              },
              {
                step: "05. Fault Tolerance",
                description:
                  "If a node disconnects, files remain retrievable from redundant replicas.",
              },
            ],
            notes: [
              "Storage load must balance proportionally according to each device's available storage quota.",
            ],
          },
          hardRequirements: [
            "Standalone App Execution: Runs as an installable desktop or mobile app using native filesystem and disk I/O.",
            "Decentralized Storage: Files physically reside on the local disks of peer devices. Zero centralized cloud buckets.",
            "Mandatory Client Compression: Images must be compressed before network transfer; raw uncompressed payloads are rejected.",
            "Content-Addressable Retrieval: Any peer on the mesh can browse the gallery and view stored images on demand.",
            "Node Disconnect Resilience: Data must remain retrievable when any single storage node drops offline.",
          ],
          strictlyProhibited: [
            "NO web browser implementations - must run as a standalone application.",
            "NO central cloud storage buckets (no AWS S3, Google Cloud Storage, Cloudinary, Firebase, or remote SQL/NoSQL).",
            "NO uncompressed raw image transfers across the network.",
            "NO single-phone storage monopolies - all connected devices must participate in the storage pool.",
          ],
          icon: "storage",
        },
        {
          id: "autonomous-intersection",
          trackId: "main",
          title: "Autonomous Intersection: LLM Multi-Agent Control",
          tagline:
            "Dynamic 4-way 20-vehicle simulation orchestrated by real-time single-batch LLM API structured reasoning.",
          badge: "Simulation & Batch LLM",
          highlights: [
            "20 Concurrent Cars",
            "Single Batch API Call",
            "Local Telemetry Only",
            "Zero Collisions",
          ],
          objective:
            "Program an autonomous traffic simulation where 20 vehicles navigate a busy 4-way intersection controlled by dynamic traffic lights. Instead of traditional hardcoded physics scripts, driving decisions for all 20 vehicles must be driven by an LLM via an API using a single batch prompt per decision tick, maximizing throughput while preventing collisions and deadlocks.",
          runtime: {
            target: "Standard Web Browser (HTML5 Canvas / WebGL / SVG)",
            description:
              "HTML5 Canvas, p5.js, PixiJS, Three.js, Babylon.js, Phaser, or D3 (2D top-down or 3D scene).",
            mandate:
              "Browser-based interactive visualization with real-time HUD (collision count, API latency, vehicles cleared).",
          },
          specs: [
            {
              label: "Vehicle Fleet",
              value: "20 concurrent autonomous vehicles",
            },
            {
              label: "Intersection Type",
              value: "4-way intersection with dynamic 3-phase signals",
            },
            {
              label: "API Calling Model",
              value: "Exactly ONE batch prompt per decision step",
            },
            {
              label: "LLM Output Format",
              value: "Structured JSON array of actions for all 20 cars",
            },
            {
              label: "Sensory Scope",
              value:
                "Strict local telemetry only (Front, Rear, Blind-spot, Signal)",
            },
            {
              label: "Safety Target",
              value: "Zero collisions allowed (Collision counter must stay 0)",
            },
          ],
          architecture: {
            summary:
              "At each simulation tick, telemetry is gathered from each vehicle's local sensors (relative velocity, distance ahead/behind, lane signals). Telemetry is combined into one single structured batch prompt sent to the LLM. The LLM returns JSON actions which the physics engine applies simultaneously.",
            steps: [
              {
                step: "01. Telemetry Harvest",
                description:
                  "Extract local sensor readings for cars 0..19 (front distance, relative velocity, signal distance).",
              },
              {
                step: "02. Single Batch Prompt",
                description:
                  "Package all 20 sensor bundles into a single prompt sent to the LLM API.",
              },
              {
                step: "03. Structured JSON Response",
                description:
                  "LLM responds with simultaneous actions: ACCELERATE, BRAKE, MAINTAIN, YIELD.",
              },
              {
                step: "04. Physics & Simulation",
                description:
                  "Sim engine advances vehicle velocity and positions according to realistic deceleration.",
              },
              {
                step: "05. HUD Metrics",
                description:
                  "Live HUD updates active latency, total cleared cars, and verifies zero collisions.",
              },
            ],
            notes: [
              "Prompts must NEVER supply global (x, y) map coordinates. The LLM must reason through local sensory inputs only.",
            ],
          },
          hardRequirements: [
            "Zero Collisions: The LLM's generated instructions must never cause any physical contact. A single crash is immediate failure.",
            "Single Batch API Call: All 20 vehicle decisions per step must be generated in a single LLM API request.",
            "Strict Structured Output: LLM must reliably return valid, parseable JSON containing explicit actions for active cars.",
            "Traffic Law Compliance: Vehicles must stop on RED, handle yellow dilemmas safely, and avoid gridlock.",
            "Decentralized Local Telemetry: Telemetry must be strictly local sensor readings per car, not global map coordinates.",
          ],
          strictlyProhibited: [
            "NO separate API calls per vehicle (firing 20 individual calls per step is banned).",
            "NO global map coordinates or omniscient grid matrices passed to the LLM prompt.",
            "NO hardcoded collision override scripts bypassing the LLM's actual decisions.",
            "NO teleportation or instant braking - vehicles must respect physical acceleration limits.",
          ],
          icon: "car",
        },
        {
          id: "reach-together",
          trackId: "freshers",
          title: "Reach Together: Campus Rideshare & Travel Pooling",
          tagline:
            "Student-centric transit pooling and dynamic cab fare splitting designed for university routes and student safety.",
          badge: "Responsive Web / Mobile App",
          highlights: [
            "Route & Window Matching",
            "Dynamic Fare Split",
            "Privacy Masking",
            "Women-Only Pools",
          ],
          objective:
            "Build a clean, user-friendly web or mobile application that connects students traveling to the same destination (airport, railway station, concert, or hometown trips) so they can travel together, share cab fares, and feel safer. The challenge focuses on clean UI/UX, intuitive trip discovery, and practical student safety features.",
          runtime: {
            target: "Responsive Web Application or Native Mobile App",
            description:
              "React, Next.js, Vue, Flutter, React Native, or similar stack with responsive mobile design.",
            mandate:
              "Functional cross-client application with intuitive student onboarding and clean user flows.",
          },
          specs: [
            {
              label: "Target Audience",
              value: "College students, campus freshers, and transit commuters",
            },
            {
              label: "Matching Window",
              value: "Route destination matching within ±30–60 min departure",
            },
            {
              label: "Capacity Model",
              value: "Dynamic seat availability with automatic capacity lock",
            },
            {
              label: "Fare Calculator",
              value: "Real-time cost splitting per passenger as pool fills",
            },
            {
              label: "Privacy Protection",
              value: "Masked contact details until host approves join request",
            },
          ],
          coreFeatures: [
            {
              title: "Trip Posting & Discovery",
              description:
                "Post rides with Origin, Destination, Departure window, and open seats. Search with fuzzy destination matching and departure filters.",
            },
            {
              title: "Travel Pool Formation & Capacity",
              description:
                "Visual seat indicators (e.g. '2 of 4 open'). Host approval workflow for join requests and auto-locking when vehicle is full.",
            },
            {
              title: "Dynamic Fare Split Calculator",
              description:
                "Calculates total ride cost and automatically computes individual shares as co-travelers join the pool.",
            },
            {
              title: "Safety & Privacy Guardrails",
              description:
                "Personal phone numbers and room addresses are masked from public search until host accepts the request.",
            },
          ],
          bonusPoints: [
            "★ Women-Only Travel Pools: A dedicated safety filter and toggle allowing female students to create and discover verified female-only travel groups for late-night rides or transit safety.",
          ],
          hardRequirements: [
            "Functional Trip Matching: Searching trips must match both destination area and overlapping departure time windows.",
            "Interactive Seat Capacity: Seat availability must update dynamically and prevent overbooking beyond capacity.",
            "Clean & Responsive UI/UX: Polished, modern interface that is easy to navigate on mobile devices.",
            "Privacy Protection: Personal contact numbers must remain masked until approved by the trip host.",
          ],
          strictlyProhibited: [
            "NO static non-interactive mockups - trip creation and joining must work functionally across sessions.",
            "NO unmasked contact leaks - phone numbers must never be publicly exposed on open search feeds.",
            "NO overbooking beyond the specified vehicle seat capacity.",
          ],
          icon: "people",
        },
      ],
    },
    {
      id: "prizes",
      type: "prizes",
      title: "Prizes & Incentives",
      navLabel: "Prizes",
      items: [
        {
          title: "₹15,000 Prize Pool",
          description:
            "₹10,000 in direct cash prizes awarded to top-performing teams.",
          highlight: true,
        },
        {
          title: "Direct Entry to HackMOL 8.0",
          description:
            "Winners secure guaranteed qualification to NIT Jalandhar's flagship hackathon.",
          highlight: true,
        },
        {
          title: "15 GDGC Club Induction Spots",
          description:
            "15 direct spots offered for upcoming GDGC NITJ club recruitments.",
        },
      ],
    },
    {
      id: "schedule",
      type: "schedule",
      title: "Stages & Timelines",
      navLabel: "Schedule",
      items: [
        {
          time: "09:30 AM – 10:30 AM",
          title: "Problem Statement Release",
          description:
            "Briefing, Q&A, and official release of competition problem statements.",
        },
        {
          time: "10:00 AM – 01:00 PM",
          title: "Development Begins",
          description:
            "Participants commenced working and coding on their chosen problem statements.",
        },
        {
          time: "01:00 PM – 02:00 PM",
          title: "Lunch Break",
          description: "Participants were given a lunch break.",
        },
        {
          time: "02:00 PM – 05:00 PM",
          title: "Development Resumes",
          description:
            "Final sprint for prototyping, feature development, and testing.",
        },
        {
          time: "05:00 PM – 05:30 PM",
          title: "Submission",
          description:
            "Teams submitted projects on the platform; shortlisted teams selected for evaluation.",
        },
        {
          time: "05:30 PM – 06:00 PM",
          title: "Final Pitching",
          description:
            "Shortlisted teams delivered their live pitch and product demonstration to judges.",
        },
        {
          time: "06:00 PM – 06:10 PM",
          title: "Closing Ceremony",
          description: "Final winners announced and prize awards distributed.",
        },
      ],
    },
    {
      id: "rules",
      type: "list",
      title: "Rules & Guidelines",
      navLabel: "Guidelines",
      style: "numbered",
      items: [
        "All participants must complete their registration through the official event platform (Unstop).",
        "Teams must follow the announced problem statements, themes, and submission requirements.",
        "All submissions must be original. Plagiarism or misrepresentation of work may lead to disqualification.",
        "Participants must comply with the event schedule and submit their projects before the announced deadline.",
        "Teams must be prepared to demonstrate their solutions and explain their implementation during evaluation.",
        "Participants must maintain professional conduct and respect fellow participants, mentors, volunteers, and judges.",
        "The organizers reserve the right to resolve disputes and take action in cases of rule violations, subject to the published competition guidelines.",
      ],
    },
  ],
});
