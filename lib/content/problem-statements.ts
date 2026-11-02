export type ProblemStatement = {
  id: string;
  trackId: "main" | "freshers";
  trackTitle: string;
  title: string;
  tagline: string;
  badge: string;
  highlights: string[];
  objective: string;
  runtime: {
    target: string;
    description: string;
    mandate?: string;
  };
  specs?: { label: string; value: string }[];
  architecture?: {
    summary: string;
    steps?: { step: string; description: string }[];
    notes?: string[];
  };
  coreFeatures?: { title: string; description: string }[];
  hardRequirements: string[];
  strictlyProhibited: string[];
  bonusPoints?: string[];
};

export type EventProblemData = {
  eventId: string;
  eventTitle: string;
  description: string;
  tracks: {
    id: "main" | "freshers";
    title: string;
    description: string;
    count: number;
  }[];
  statements: ProblemStatement[];
};

export const minimolProblemStatements: EventProblemData = {
  eventId: "minimol",
  eventTitle: "MiniMol",
  description:
    "Official problem statements for MiniMol 2026. Teams had 8 hours to design, build, and deploy functional prototypes evaluated across rigorous benchmarks.",
  tracks: [
    {
      id: "main",
      title: "Main Track",
      description: "Distributed systems, peer-to-peer compute, and multi-agent AI architecture.",
      count: 3,
    },
    {
      id: "freshers",
      title: "Freshers Track",
      description: "Dedicated challenge exclusively for first-year builders focusing on UI/UX and practical utility.",
      count: 1,
    },
  ],
  statements: [
    {
      id: "p2p-inference",
      trackId: "main",
      trackTitle: "Main Track",
      title: "P2P Mobile Mesh Inference",
      tagline: "Split-execution Byte-Level Micro-Transformer running across two physical smartphones over local WebRTC DataChannel.",
      badge: "WebRTC & Web CPU",
      highlights: ["11.04M Parameters", "Web CPU Only", "Zero Native Installs", "PyTorch Seed 42"],
      objective:
        "Build a web application that runs distributed text generation for a Byte-Level Micro-Transformer across two physical mobile phones connected over a local peer-to-peer network. The forward pass is split across both phones in real time so both devices collaborate to generate every single byte.",
      runtime: {
        target: "Stock Mobile Browsers (iOS Safari / Android Chrome)",
        description: "JavaScript / WebAssembly on CPU. Strictly zero app installations, APKs, or browser developer flags.",
        mandate: "Judges pair two random phones of their choice to measure tokens-per-second throughput.",
      },
      specs: [
        { label: "Model Architecture", value: "Vanilla Causal Decoder Transformer (GPT-style)" },
        { label: "Vocabulary Size", value: "256 (Raw ASCII / UTF-8 bytes; no tokenizer)" },
        { label: "Context Length", value: "512 tokens (max_seq_len)" },
        { label: "Transformer Layers", value: "6 layers (Phone 1: 0–2, Phone 2: 3–5)" },
        { label: "Hidden / FF Dim", value: "d_model = 384, d_ff = 1536 (4 × d_model)" },
        { label: "Parameter Count", value: "11,040,768 (~11.04M params, ~44.16 MB in FP32)" },
        { label: "Weight Generation", value: "PyTorch seed 42 deterministic FP32 weights" },
      ],
      architecture: {
        summary:
          "Phone 1 computes embeddings and layers 0–2, then transmits activations over WebRTC DataChannel. Phone 2 computes layers 3–5, final projection, samples the next byte, and sends it back to Phone 1 to continue generation.",
        steps: [
          { step: "01. Pairing", description: "Phones pair via WebRTC DataChannel using local QR signaling." },
          { step: "02. Stage 1 (Phone 1)", description: "Runs token embeddings and Transformer Layers 0–2 on Web CPU." },
          { step: "03. Local Transport", description: "Intermediate activation tensor is sent directly across WebRTC DataChannel." },
          { step: "04. Stage 2 (Phone 2)", description: "Runs Layers 3–5, output projection, and samples the next byte token." },
          { step: "05. Feedback Loop", description: "Sends token back to Phone 1 to append to context and repeat autoregression." },
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
    },
    {
      id: "hivenet-storage",
      trackId: "main",
      trackTitle: "Main Track",
      title: "HiveNet: Distributed Edge Storage & Smart Router",
      tagline: "Decentralized serverless cloud drive pooling local filesystem storage across devices with telemetry-based smart routing.",
      badge: "Standalone App & Mesh Storage",
      highlights: ["Replication Factor ≥ 2", "Client-Side Compression", "Standalone App Only", "No Cloud Buckets"],
      objective:
        "Build a decentralized, peer-to-peer cloud storage standalone application (HiveNet) where multiple connected devices (smartphones/laptops) pool their local filesystem storage into a unified, serverless cloud drive. Every uploaded image is compressed client-side, and an intelligent storage router dynamically dispatches chunks to the optimal nodes.",
      runtime: {
        target: "Standalone Application (Mobile or Desktop)",
        description: "Flutter, React Native, Expo, Kotlin Multiplatform, Swift, Kotlin, Tauri, Electron, or Go/Rust GUI.",
        mandate: "Strictly standalone apps using native filesystem I/O. Web browsers are prohibited.",
      },
      specs: [
        { label: "Runtime Category", value: "Standalone native desktop or mobile app" },
        { label: "Storage Engine", value: "Native filesystem, local app sandbox, or raw disk I/O" },
        { label: "Replication Factor", value: "RF ≥ 2 (Minimum 2 distinct redundant storage nodes)" },
        { label: "Compression", value: "Mandatory client-side WebP/AVIF, downscaling, or quantization" },
        { label: "Addressing", value: "Content-addressable hashes across the peer mesh" },
      ],
      architecture: {
        summary:
          "The storage router evaluates peer telemetry (available disk quota, latency, and uptime) to dispatch redundant chunks across the network, ensuring zero data loss if a node disconnects.",
        steps: [
          { step: "01. Compression", description: "Client app compresses raw image before network transmission." },
          { step: "02. Telemetry Query", description: "Router evaluates connected peers: available disk quota, ping/latency, and stability." },
          { step: "03. Smart Routing", description: "Dispatches redundant copies or chunks to 2+ optimal peer nodes (RF ≥ 2)." },
          { step: "04. Mesh Gallery", description: "Any connected device can browse file catalog and retrieve images on demand." },
          { step: "05. Fault Tolerance", description: "If a node disconnects, files remain retrievable from redundant replicas." },
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
    },
    {
      id: "autonomous-intersection",
      trackId: "main",
      trackTitle: "Main Track",
      title: "Autonomous Intersection: LLM Multi-Agent Control",
      tagline: "Dynamic 4-way 20-vehicle simulation orchestrated by real-time single-batch LLM API structured reasoning.",
      badge: "Simulation & Batch LLM",
      highlights: ["20 Concurrent Cars", "Single Batch API Call", "Local Telemetry Only", "Zero Collisions"],
      objective:
        "Program an autonomous traffic simulation where 20 vehicles navigate a busy 4-way intersection controlled by dynamic traffic lights. Instead of traditional hardcoded physics scripts, driving decisions for all 20 vehicles must be driven by an LLM via an API using a single batch prompt per decision tick, maximizing throughput while preventing collisions and deadlocks.",
      runtime: {
        target: "Standard Web Browser (HTML5 Canvas / WebGL / SVG)",
        description: "HTML5 Canvas, p5.js, PixiJS, Three.js, Babylon.js, Phaser, or D3 (2D top-down or 3D scene).",
        mandate: "Browser-based interactive visualization with real-time HUD (collision count, API latency, vehicles cleared).",
      },
      specs: [
        { label: "Vehicle Fleet", value: "20 concurrent autonomous vehicles" },
        { label: "Intersection Type", value: "4-way intersection with dynamic 3-phase signals" },
        { label: "API Calling Model", value: "Exactly ONE batch prompt per decision step" },
        { label: "LLM Output Format", value: "Structured JSON array of actions for all 20 cars" },
        { label: "Sensory Scope", value: "Strict local telemetry only (Front, Rear, Blind-spot, Signal)" },
        { label: "Safety Target", value: "Zero collisions allowed (Collision counter must stay 0)" },
      ],
      architecture: {
        summary:
          "At each simulation tick, telemetry is gathered from each vehicle's local sensors (relative velocity, distance ahead/behind, lane signals). Telemetry is combined into one single structured batch prompt sent to the LLM. The LLM returns JSON actions which the physics engine applies simultaneously.",
        steps: [
          { step: "01. Telemetry Harvest", description: "Extract local sensor readings for cars 0..19 (front distance, relative velocity, signal distance)." },
          { step: "02. Single Batch Prompt", description: "Package all 20 sensor bundles into a single prompt sent to the LLM API." },
          { step: "03. Structured JSON Response", description: "LLM responds with simultaneous actions: ACCELERATE, BRAKE, MAINTAIN, YIELD." },
          { step: "04. Physics & Simulation", description: "Sim engine advances vehicle velocity and positions according to realistic deceleration." },
          { step: "05. HUD Metrics", description: "Live HUD updates active latency, total cleared cars, and verifies zero collisions." },
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
    },
    {
      id: "reach-together",
      trackId: "freshers",
      trackTitle: "Freshers Track",
      title: "Reach Together: Campus Rideshare & Travel Pooling",
      tagline: "Student-centric transit pooling and dynamic cab fare splitting designed for university routes and student safety.",
      badge: "Responsive Web / Mobile App",
      highlights: ["Route & Window Matching", "Dynamic Fare Split", "Privacy Masking", "Women-Only Pools"],
      objective:
        "Build a clean, user-friendly web or mobile application that connects students traveling to the same destination (airport, railway station, concert, or hometown trips) so they can travel together, share cab fares, and feel safer. The challenge focuses on clean UI/UX, intuitive trip discovery, and practical student safety features.",
      runtime: {
        target: "Responsive Web Application or Native Mobile App",
        description: "React, Next.js, Vue, Flutter, React Native, or similar stack with responsive mobile design.",
        mandate: "Functional cross-client application with intuitive student onboarding and clean user flows.",
      },
      specs: [
        { label: "Target Audience", value: "College students, campus freshers, and transit commuters" },
        { label: "Matching Window", value: "Route destination matching within ±30–60 min departure" },
        { label: "Capacity Model", value: "Dynamic seat availability with automatic capacity lock" },
        { label: "Fare Calculator", value: "Real-time cost splitting per passenger as pool fills" },
        { label: "Privacy Protection", value: "Masked contact details until host approves join request" },
      ],
      coreFeatures: [
        {
          title: "Trip Posting & Discovery",
          description: "Post rides with Origin, Destination, Departure window, and open seats. Search with fuzzy destination matching and departure filters.",
        },
        {
          title: "Travel Pool Formation & Capacity",
          description: "Visual seat indicators (e.g. '2 of 4 open'). Host approval workflow for join requests and auto-locking when vehicle is full.",
        },
        {
          title: "Dynamic Fare Split Calculator",
          description: "Calculates total ride cost and automatically computes individual shares as co-travelers join the pool.",
        },
        {
          title: "Safety & Privacy Guardrails",
          description: "Personal phone numbers and room addresses are masked from public search until host accepts the request.",
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
    },
  ],
};

export function getProblemStatements(eventId: string): EventProblemData | undefined {
  if (eventId === "minimol") {
    return minimolProblemStatements;
  }
  return undefined;
}
