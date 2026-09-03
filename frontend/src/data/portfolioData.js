export const developerInfo = {
  name: "Ibrahim Tanveer",
  title: "AI Web App Developer",
  role: "AI Web App Developer & Full-Stack Web Creator",
  heroSubtitle: "Building modern AI-powered web applications and digital experiences that combine clean design, intelligent functionality, and scalable technology.",
  shortStatement: "Passionate about turning ideas into functional, modern and user-friendly web applications.",
  aboutText: [
    "I am an AI Web App Developer and Full-Stack Web Creator dedicated to building responsive, intelligent digital solutions that bridge technical complexity with refined, intuitive interfaces.",
    "My focus centers on architecting modern web platforms, integrating generative AI capabilities, building high-throughput APIs, and designing responsive dashboards that empower users and streamline digital operations.",
    "Whether developing custom AI assistants, robust database-backed business applications, or interactive consumer platforms, I prioritize performance, clean code architecture, and modern visual design."
  ],
  focusAreas: [
    "AI-powered web applications",
    "Modern responsive websites",
    "Full-stack web experiences",
    "Admin dashboards",
    "Business platforms",
    "Interactive digital products"
  ],
  socialLinks: {
    github: "https://github.com/ibrahimtanveer",
    linkedin: "https://linkedin.com/in/ibrahimtanveer",
    email: "ibrahimtanveer.dev@example.com"
  }
};

export const skillsData = [
  {
    category: "Frontend",
    description: "Building responsive, modern, and high-performance client interfaces.",
    skills: [
      { name: "React.js", level: "Core Framework" },
      { name: "Next.js", level: "Production SSR/SSG" },
      { name: "HTML5", level: "Semantic Markup" },
      { name: "CSS3 / Modern CSS", level: "Design Systems & Flex/Grid" },
      { name: "JavaScript (ES6+)", level: "Modern Standards" },
      { name: "Responsive UI", level: "Cross-Device Adaptive" },
      { name: "Modern UI/UX", level: "Design & Interactions" }
    ]
  },
  {
    category: "Backend",
    description: "Architecting reliable APIs, business logic, and database schemas.",
    skills: [
      { name: "Python", level: "Core Language" },
      { name: "Flask", level: "Micro-framework & APIs" },
      { name: "REST APIs", level: "Endpoint Architecture" },
      { name: "PostgreSQL", level: "Relational Modeling" },
      { name: "Database Integration", level: "ORM & SQL Queries" }
    ]
  },
  {
    category: "AI & Development",
    description: "Integrating intelligent models and automated generation pipelines.",
    skills: [
      { name: "AI-Powered Web Apps", level: "End-to-end Solutions" },
      { name: "AI Integrations", level: "LLM & Embedding Pipelines" },
      { name: "AI Assistants", level: "Conversational Logic" },
      { name: "AI Image Generation Concepts", level: "Diffusion Models & Prompts" },
      { name: "AI Website Generation", level: "Automated Layout Synthesis" },
      { name: "AI Design Tools", level: "Smart Workflow Automation" },
      { name: "API Integrations", level: "Third-Party Microservices" }
    ]
  },
  {
    category: "Tools & Workflow",
    description: "Version control, modern developer tooling, and iterative workflows.",
    skills: [
      { name: "Git", level: "Version Control" },
      { name: "GitHub", level: "Collaboration & Repos" },
      { name: "Modern Development Workflows", level: "CI/CD & Linting" },
      { name: "AI-Assisted Development", level: "Productivity Acceleration" }
    ]
  }
];

export const projectsData = [
  {
    id: "ai-web-platform",
    title: "AI Web Platform",
    subtitle: "Generative AI Suite & Multi-Tool Workspace",
    category: "AI & Web Apps",
    badge: "Featured AI Suite",
    description: "An all-in-one generative AI platform bringing image, code, text, website, and 3D generation into a cohesive web suite.",
    overview: "The AI Web Platform is built to showcase end-to-end integration of cutting-edge generative AI capabilities within an ultra-responsive, developer-grade web interface. It combines text-to-image synthesis, interactive code generation, and assistive web layout drafting in a single platform.",
    problem: "Creators and developers frequently switch between multiple isolated AI tools with disparate interfaces, high subscription friction, and fragmented workflows.",
    solution: "Architected a unified web interface featuring a multi-agent model coordinator, context-aware prompt refinement, and real-time streaming results across text, code, and visual media.",
    features: [
      "AI Image Generator with style presets",
      "AI Website Generator with live preview",
      "AI 3D Model Concept Generator",
      "AI Design Assistant & UI wireframing",
      "AI Text Generator for copy & documentation",
      "AI Code Generator & debugger"
    ],
    technologies: [
      "React.js", "Python", "Flask", "OpenAI API", "REST APIs", "Modern CSS"
    ],
    image_url: "/assets/projects/ai_web_platform.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/ai-platform",
    github_url: "https://github.com/ibrahimtanveer/ai-web-platform",
    stats: { tools: "6 Core AI Engines", architecture: "REST / Async Streaming", status: "Active Concept" }
  },
  {
    id: "bookverse-library",
    title: "BookVerse — Digital Library",
    subtitle: "Full-Stack Library Management & Discovery System",
    category: "Full-Stack & APIs",
    badge: "Full-Stack Platform",
    description: "A comprehensive digital library platform with catalog search, borrow/return workflows, and administrative dashboards.",
    overview: "BookVerse is an end-to-end digital library platform engineered for reader community engagement and library administration. It includes full role-based access control, catalog organization, real-time inventory availability, and loan management.",
    problem: "Traditional library catalogs are notoriously clunky, lacking modern search heuristics, responsive mobile views, and seamless self-service borrow/return tracking.",
    solution: "Built a lightning-fast catalog with dynamic category filtering, reader authentication, member dashboards for tracking borrowed volumes, and a secure admin portal for book CRUD operations.",
    features: [
      "Curated book collection with faceted search",
      "Category tagging & genre filtering",
      "Detailed book metadata and summaries",
      "Automated Borrow / Return tracking system",
      "User authentication & reader loan dashboard",
      "Admin dashboard with complete books CRUD",
      "RESTful Backend API with structured database",
      "Responsive interface across mobile and desktop"
    ],
    technologies: [
      "React.js", "Python", "Flask", "SQLite", "REST APIs", "JWT Auth"
    ],
    image_url: "/assets/projects/bookverse_library.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/bookverse",
    github_url: "https://github.com/ibrahimtanveer/bookverse-library",
    stats: { modules: "User & Admin Portals", db: "Relational SQLite/PostgreSQL", status: "Production Ready" }
  },
  {
    id: "lumina-supercar",
    title: "Lumina — Supercar Experience",
    subtitle: "Interactive Automotive Showcase & Customizer",
    category: "Interactive & UI/UX",
    badge: "Interactive Showcase",
    description: "A high-performance digital automotive showroom featuring real-time vehicle color customization and AI Car Match.",
    overview: "Lumina presents an exotic automotive experience focused on hyper-polished aesthetics, buttery smooth UI interactions, and intelligent car recommendation logic. Users explore specs, customize vehicle colorways, and match vehicles based on their driving style.",
    problem: "Standard automotive dealerships offer static, uninspiring web brochures that fail to convey vehicle excitement, performance dynamism, or personalized configuration.",
    solution: "Crafted an ultra-luxurious dark-mode interface with interactive color configurators, instant performance telemetry comparisons, dynamic favorites management, and an AI-assisted questionnaire for car matching.",
    features: [
      "Premium automotive UI with dark aesthetic",
      "Comprehensive vehicle telemetry and performance specs",
      "AI Car Match matching driving habits to supercars",
      "Side-by-side multi-vehicle performance comparison",
      "Interactive real-time car color customization",
      "Persistent user favorites collection",
      "Responsive and fluid motion across devices"
    ],
    technologies: [
      "React.js", "Vanilla CSS", "Python Flask", "Canvas/3D Concepts", "REST APIs"
    ],
    image_url: "/assets/projects/lumina_supercar.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/lumina",
    github_url: "https://github.com/ibrahimtanveer/lumina-supercars",
    stats: { theme: "Luxury Automotive", interactions: "Real-Time Configurator", status: "Live Showcase" }
  },
  {
    id: "electrotech-store",
    title: "Electrotech Store",
    subtitle: "Modern Electronics E-Commerce & Inventory Hub",
    category: "Full-Stack & APIs",
    badge: "E-Commerce System",
    description: "A streamlined electronics store featuring full product catalog management, administrative CRUD, and real-time cart handling.",
    overview: "Electrotech Store is a production-style electronics platform providing both a modern shopper storefront and a comprehensive merchant administration system to manage hardware items, stock counts, and specs.",
    problem: "Many e-commerce systems are bloated and slow, complicating basic inventory workflows and distracting shoppers with cluttered interfaces.",
    solution: "Engineered a minimalist, fast-loading storefront paired with a robust administrative dashboard supporting granular Add/Edit/Delete actions, instant filtering, and responsive device checkout preview.",
    features: [
      "Dynamic electronics product catalogue",
      "Categorized hardware browsing (laptops, audio, components)",
      "Comprehensive Admin dashboard with full CRUD",
      "Interactive product detail modals & specs sheets",
      "Backend API integration with SQLite persistence",
      "Responsive mobile-first layout with smooth transitions"
    ],
    technologies: [
      "React.js", "Python", "Flask", "SQLite", "REST APIs", "Modern UI/UX"
    ],
    image_url: "/assets/projects/electrotech_store.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/electrotech",
    github_url: "https://github.com/ibrahimtanveer/electrotech-store",
    stats: { inventory: "Live Stock Management", speed: "Sub-second Responses", status: "Functional App" }
  },
  {
    id: "real-assistant",
    title: "Real Assistant — Property Platform",
    subtitle: "Pakistan-Focused Real Estate & Discovery Portal",
    category: "Web Platforms",
    badge: "Regional Platform",
    description: "A tailored real estate platform engineered for Pakistan property discovery, interactive map exploration, and detailed listing filters.",
    overview: "Real Assistant streamlines property acquisition and rental searches across major Pakistani metropolitan hubs (Lahore, Karachi, Islamabad, etc.). It delivers transparent property details, neighborhood insights, and map exploration.",
    problem: "Regional property portals often lack clean UI design, accurate filtering for plot/house dimensions (Marlas/Kanals), and responsive mobile mapping.",
    solution: "Developed a clean, focused property portal featuring intuitive Buy and Rent toggles, unit dimension filters, interactive map exploration, and rich image galleries.",
    features: [
      "Curated property listings across residential & commercial sectors",
      "Dedicated Buy vs Rent discovery modes",
      "Granular Pakistan-focused unit filtering (Marla, Kanal, Sq. Ft.)",
      "Interactive map exploration & location tags",
      "High-resolution property details and amenities matrix",
      "Direct inquiry & agent contact interface"
    ],
    technologies: [
      "React.js", "Python", "Flask", "REST APIs", "Leaflet/Map Concepts", "CSS"
    ],
    image_url: "/assets/projects/real_assistant.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/real-assistant",
    github_url: "https://github.com/ibrahimtanveer/real-assistant-property",
    stats: { scope: "Pakistan Real Estate", maps: "Geo Spatial Discovery", status: "Platform Prototype" }
  },
  {
    id: "ai-house-designer",
    title: "AI House Designer",
    subtitle: "Architectural Concept & 3D Spatial Planning Tool",
    category: "AI & Web Apps",
    badge: "Spatial AI Concept",
    description: "An interactive architectural tool allowing users to enter house dimensions and synthesize 3D spatial concepts with custom room layouts.",
    overview: "AI House Designer bridges consumer architectural aspirations and conceptual design. By inputting lot dimensions, desired stories, and aesthetic styles, users generate immediate 3D conceptual house layouts with customizable color palettes and room arrangements.",
    problem: "Early-stage house concept visualization usually requires complex CAD software, expensive architectural consulting, or rigid stock blueprints.",
    solution: "Built a streamlined web app that accepts dimension constraints and prompts, generating interactive spatial floorplans, exterior renderings, and color schemes in real time.",
    features: [
      "House dimension & plot footprint input controls",
      "Instant architectural concept generation",
      "Interactive 3D house concept visualization",
      "Room allocation and spatial layout explorer",
      "Exterior & interior palette customization",
      "Concept export and blueprint specification sheet"
    ],
    technologies: [
      "React.js", "Python", "Flask", "Three.js Concepts", "Generative AI Logic"
    ],
    image_url: "/assets/projects/ai_house_designer.png",
    live_demo_url: "https://demo.ibrahimtanveer.dev/ai-house-designer",
    github_url: "https://github.com/ibrahimtanveer/ai-house-designer",
    stats: { dimensionEngine: "Parametric Layouts", rendering: "3D Facade Concepts", status: "Concept Engine" }
  }
];

export const servicesData = [
  {
    id: "ai-web-app",
    title: "AI Web App Development",
    description: "Building intelligent web applications with custom AI integrations, LLM workflows, and generative capabilities tailored to business needs.",
    details: ["LLM integration & orchestration", "Generative UI components", "Streaming response interfaces", "Prompt engineering & pipelines"]
  },
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    description: "Modern frontend, backend, APIs, and database-powered applications built with robust architectures and clean maintainable code.",
    details: ["React.js & Next.js client apps", "Python Flask REST APIs", "Relational database modeling", "State management & auth flows"]
  },
  {
    id: "business-websites",
    title: "Business Website Development",
    description: "Professional, high-converting websites for businesses and organizations, optimized for speed, clarity, and search engine visibility.",
    details: ["Brand-aligned bespoke design", "SEO & performance optimization", "Content structure & storytelling", "Mobile-first responsive layouts"]
  },
  {
    id: "admin-dashboards",
    title: "Admin Dashboard Development",
    description: "Custom dashboards for managing products, users, inventory, content, and analytical data with role-based access.",
    details: ["Comprehensive CRUD interfaces", "Data tables with filtering & sorting", "Analytics visualization widgets", "Secure authorization controls"]
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description: "Integrating AI capabilities into existing websites and web applications, from smart search to automated workflows and chatbots.",
    details: ["OpenAI & AI API connectors", "Context-aware search & retrieval", "Automated content generation", "Seamless third-party hooks"]
  },
  {
    id: "ui-ux-responsive",
    title: "UI/UX & Responsive Development",
    description: "Creating clean, responsive, and user-friendly interfaces that look stunning and perform smoothly across all devices.",
    details: ["Design token architecture", "Micro-animations & interactions", "Accessible WCAG-aligned UI", "Fluid cross-device consistency"]
  }
];

export const processSteps = [
  {
    step: "01",
    title: "Understand",
    description: "Deep dive into the core idea, functional requirements, target audience, and system architecture to chart a clear development roadmap.",
    points: ["Requirements gathering", "Technical scope definition", "User journey mapping"]
  },
  {
    step: "02",
    title: "Design",
    description: "Create a clean, modern interface emphasizing whitespace, sophisticated typography, visual hierarchy, and intuitive user workflows.",
    points: ["Wireframing & UI layout", "Design system tokens", "Interactive prototypes"]
  },
  {
    step: "03",
    title: "Develop",
    description: "Build the frontend components, backend APIs, database schemas, and AI integrations with clean, scalable, and tested code.",
    points: ["React component engineering", "Flask REST API & DB logic", "AI pipeline integration"]
  },
  {
    step: "04",
    title: "Improve",
    description: "Rigorous testing, performance benchmarking, cross-browser validation, and iterative refinement for a production-grade experience.",
    points: ["Performance optimization", "Responsive testing", "Refinement & deployment readiness"]
  }
];

export const whyWorkWithMe = [
  {
    title: "Modern Web Development",
    description: "Leveraging the latest component-driven architectures, modern CSS, and clean build tooling for reliable performance."
  },
  {
    title: "AI-Focused Solutions",
    description: "Practical integration of intelligent models, LLM assistants, and generative features that solve real problems."
  },
  {
    title: "Clean UI & Aesthetics",
    description: "Minimal, sophisticated designs with thoughtful whitespace, subtle borders, and smooth micro-interactions."
  },
  {
    title: "Responsive Design",
    description: "Thoroughly tested cross-device responsiveness ensuring flawless rendering from mobile phones to high-res desktop monitors."
  },
  {
    title: "Functional Applications",
    description: "Beyond static designs: real backend endpoints, database persistence, state handling, and interactive user journeys."
  },
  {
    title: "Scalable Architecture",
    description: "Modular, well-organized codebases that are easy to maintain, extend, and adapt as project requirements grow."
  },
  {
    title: "User-Focused Experiences",
    description: "Prioritizing fast loading times, accessible layouts, and clear information hierarchy for high user engagement."
  },
  {
    title: "Continuous Improvement",
    description: "Relentless attention to detail, proactive problem-solving, and continuous optimization of every digital product built."
  }
];
