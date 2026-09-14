// Vercel Serverless Function API Handler (Node.js)
// Handles all /api/* routes with JSON responses, admin auth, website CRUD, and status persistence.

const initialProjects = [
  {
    id: "bookverse",
    title: "BookVerse",
    name: "BookVerse",
    subtitle: "Full-Stack Digital Library & Reading Hub",
    category: "Education & LMS",
    description: "A modern digital library platform with catalog search, borrow/return workflows, and member management.",
    overview: "BookVerse connects readers with an expansive digital collection featuring seamless borrow/return tracking and interactive book discovery.",
    problem: "Traditional library systems lack responsive UI, fast searching, and streamlined self-service checkout.",
    solution: "Architected a lightning-fast React and modern API library system with categorized book discovery and automated loan management.",
    technologies: ["React.js", "Python", "Flask", "REST APIs", "SQLite"],
    features: ["Curated book catalogue", "Borrow/Return workflows", "Reader dashboard", "Admin management"],
    image_url: "/assets/projects/bookverse_library.png",
    image: "/assets/projects/bookverse_library.png",
    live_demo_url: "https://book-verse-tau-eight.vercel.app",
    url: "https://book-verse-tau-eight.vercel.app",
    github_url: "https://github.com/ibrahimtanveer/bookverse-library",
    githubUrl: "https://github.com/ibrahimtanveer/bookverse-library",
    status: "published",
    featured: true,
    sort_order: 1,
    screenshots: []
  },
  {
    id: "electrotech-store",
    title: "Electrotech Store",
    name: "Electrotech Store",
    subtitle: "Modern Electronics E-Commerce & Inventory Hub",
    category: "E-Commerce",
    description: "A streamlined electronics store featuring full product catalog management, administrative CRUD, and real-time cart handling.",
    overview: "Electrotech Store is a production-style electronics platform providing both a modern shopper storefront and a comprehensive merchant administration system.",
    problem: "Many e-commerce systems are bloated and slow, complicating basic inventory workflows.",
    solution: "Engineered a minimalist, fast-loading storefront paired with a robust administrative dashboard supporting granular Add/Edit/Delete actions.",
    technologies: ["React.js", "Python", "Flask", "SQLite", "REST APIs", "Modern UI/UX"],
    features: ["Dynamic product catalogue", "Hardware categorization", "Admin dashboard", "Product modals"],
    image_url: "/assets/projects/electrotech_store.png",
    image: "/assets/projects/electrotech_store.png",
    live_demo_url: "https://electrotech-store.vercel.app",
    url: "https://electrotech-store.vercel.app",
    github_url: "https://github.com/ibrahimtanveer/electrotech-store",
    githubUrl: "https://github.com/ibrahimtanveer/electrotech-store",
    status: "published",
    featured: true,
    sort_order: 2,
    screenshots: []
  },
  {
    id: "real-assistant",
    title: "Real Assistant (3D Architecture)",
    name: "Real Assistant (3D Architecture)",
    subtitle: "3D Real Estate & Architectural Exploration Portal",
    category: "Web Application",
    description: "An interactive property discovery platform with 3D visualization and responsive filtering.",
    overview: "Real Assistant streamlines property acquisition with interactive 3D exploration and transparent details.",
    problem: "Static property listings fail to give buyers spatial understanding.",
    solution: "Integrated 3D architectural models with fluid real estate search tools.",
    technologies: ["React.js", "Three.js", "Python", "REST APIs"],
    features: ["3D building walkthroughs", "Unit dimension filtering", "Interactive map tags"],
    image_url: "/assets/projects/real_assistant.png",
    image: "/assets/projects/real_assistant.png",
    live_demo_url: "https://realassistant-3d.vercel.app",
    url: "https://realassistant-3d.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: true,
    sort_order: 3,
    screenshots: []
  },
  {
    id: "supercar-website",
    title: "Supercar Website (ATELIER PRO)",
    name: "Supercar Website (ATELIER PRO)",
    subtitle: "Exotic Automotive Showcase & Real-Time Configurator",
    category: "Interactive & UI/UX",
    description: "A luxury automotive showcase featuring real-time vehicle color customization and performance telemetry.",
    overview: "ATELIER PRO delivers high-performance digital automotive showroom aesthetics with real-time specs comparison.",
    problem: "Dealership websites are typically static and uninspiring.",
    solution: "Built a dynamic dark-mode customizer with instant telemetry stats.",
    technologies: ["React.js", "Vanilla CSS", "Canvas", "REST APIs"],
    features: ["Real-time color customizer", "Performance comparison matrix", "Favorites collection"],
    image_url: "/assets/projects/lumina_supercar.png",
    image: "/assets/projects/lumina_supercar.png",
    live_demo_url: "https://atelierpro-supercars.vercel.app",
    url: "https://atelierpro-supercars.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: true,
    sort_order: 4,
    screenshots: []
  },
  {
    id: "fashion-store",
    title: "Fashion Store (Maison Lumière)",
    name: "Fashion Store (Maison Lumière)",
    subtitle: "Haute Couture & Luxury Fashion E-Commerce",
    category: "E-Commerce",
    description: "An elegant luxury fashion catalogue with collection discovery and seamless checkout flow.",
    overview: "Maison Lumière is an upscale fashion boutique website designed for sophisticated browsing.",
    problem: "Standard e-commerce templates dilute high-end brand identity.",
    solution: "Designed an editorial-style interface with curated lookbooks.",
    technologies: ["React.js", "CSS3", "REST APIs"],
    features: ["Lookbook curation", "Filter by season", "Fast checkout"],
    image_url: "/assets/projects/fashion_store.png",
    image: "/assets/projects/fashion_store.png",
    live_demo_url: "https://maisonlumiere.vercel.app",
    url: "https://maisonlumiere.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: false,
    sort_order: 5,
    screenshots: []
  },
  {
    id: "edulearn-lms",
    title: "LMS (EduLearn LMS)",
    name: "LMS (EduLearn LMS)",
    subtitle: "Enterprise Learning Management System",
    category: "Education & LMS",
    description: "An educational platform for course discovery, student tracking, and quiz evaluations.",
    overview: "EduLearn is an end-to-end LMS empowering students and instructors.",
    problem: "Complex LMS tools present high cognitive friction for learners.",
    solution: "Created an intuitive dashboard with clear module progress indicators.",
    technologies: ["React.js", "Node.js / Python", "REST APIs"],
    features: ["Course syllabus tracking", "Video player integration", "Student progress stats"],
    image_url: "/assets/projects/edulearn_lms.png",
    image: "/assets/projects/edulearn_lms.png",
    live_demo_url: "https://edulearn-lms.vercel.app",
    url: "https://edulearn-lms.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: false,
    sort_order: 6,
    screenshots: []
  },
  {
    id: "aurex-ai-studio",
    title: "Aurex AI Studio",
    name: "Aurex AI Studio",
    subtitle: "Multi-Agent Generative AI Creative Suite",
    category: "AI & Machine Learning",
    description: "A generative AI platform unifying text, image, and code assistants into a single workspace.",
    overview: "Aurex AI Studio accelerates creative workflows with cutting-edge AI integrations.",
    problem: "Switching between disparate AI utilities wastes time.",
    solution: "Unified prompt workspace with streaming responses and multi-model coordination.",
    technologies: ["React.js", "Python", "OpenAI APIs", "REST APIs"],
    features: ["AI Image generator", "AI Code generation", "Prompt history & templates"],
    image_url: "/assets/projects/ai_web_platform.png",
    image: "/assets/projects/ai_web_platform.png",
    live_demo_url: "https://aurex-studio.vercel.app",
    url: "https://aurex-studio.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: true,
    sort_order: 7,
    screenshots: []
  },
  {
    id: "primenest-pakistan",
    title: "PrimeNest Pakistan",
    name: "PrimeNest Pakistan",
    subtitle: "Real Estate & Urban Property Discovery",
    category: "Web Platforms",
    description: "A property marketplace with localized unit filtering (Marlas / Kanals) and interactive maps.",
    overview: "PrimeNest Pakistan connects property seekers with verified real estate across metropolitan cities.",
    problem: "Standard international templates lack support for local property measurement units.",
    solution: "Implemented tailored Marla/Kanal filters and local city indexing.",
    technologies: ["React.js", "Python", "Flask", "REST APIs"],
    features: ["Marla/Kanal converter", "City-wise neighborhood index", "Direct agent contact"],
    image_url: "/assets/projects/real_assistant.png",
    image: "/assets/projects/real_assistant.png",
    live_demo_url: "https://primenest-pk.vercel.app",
    url: "https://primenest-pk.vercel.app",
    github_url: "https://github.com/ibrahimtanveer",
    githubUrl: "https://github.com/ibrahimtanveer",
    status: "published",
    featured: false,
    sort_order: 8,
    screenshots: []
  }
];

// In-memory project cache for serverless execution
let projectsCache = [...initialProjects];

let categoriesCache = [
  { id: 1, name: "Web Application", description: "Full-featured interactive web software and SaaS portals" },
  { id: 2, name: "E-Commerce", description: "Online retail, product catalogs, shopping carts, and payment checkouts" },
  { id: 3, name: "AI & Machine Learning", description: "Generative AI, conversational interfaces, and intelligent automation" },
  { id: 4, name: "Education & LMS", description: "Learning platforms, course catalogs, student portals, and digital libraries" },
  { id: 5, name: "Portfolio & UI/UX", description: "Personal portfolios, design showcases, and creative agency websites" },
  { id: 6, name: "Full-Stack & APIs", description: "Backend-heavy platforms, REST APIs, and database-driven solutions" },
  { id: 7, name: "Web Platforms", description: "Scalable multi-user platforms and web systems" }
];

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(body));
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string' && req.body) {
      try {
        return resolve(JSON.parse(req.body));
      } catch {
        return resolve({});
      }
    }
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'website';
}

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/+$/, '');
  const method = req.method.toUpperCase();

  try {
    // -------------------------------------------------------------------------
    // 1. Health Check: GET /api/health
    // -------------------------------------------------------------------------
    if (pathname === '/api/health') {
      if (method !== 'GET') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed for /api/health.` });
      }
      return sendJson(res, 200, {
        status: 'healthy',
        service: 'Ibrahim Tanveer Portfolio API',
        version: '2.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------------------
    // 2. Admin Login: POST /api/admin/login
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/login') {
      if (method !== 'POST') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed for /api/admin/login.` });
      }
      const body = await parseJsonBody(req);
      const identifier = (body.identifier || body.username || body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      if (!identifier || !password) {
        return sendJson(res, 400, { success: false, error: 'Please provide your username/email and password.' });
      }

      const validUsers = ['admin', 'admin@ibrahimtanveer.dev', 'ibrahim', 'ibrahimtanveer'];
      const validPass = ['Admin@Portfolio2026!', 'admin123', 'admin', 'Admin2026!'];

      if (validUsers.includes(identifier) && validPass.includes(password)) {
        const token = `client_admin_session_${Date.now()}`;
        const admin = {
          id: 1,
          username: 'admin',
          email: 'admin@ibrahimtanveer.dev',
          full_name: 'Ibrahim Tanveer',
          role: 'superadmin'
        };
        return sendJson(res, 200, {
          success: true,
          message: 'Login successful.',
          token,
          admin
        });
      }

      return sendJson(res, 401, { success: false, error: 'Invalid username/email or password.' });
    }

    // -------------------------------------------------------------------------
    // 3. Admin Me: GET /api/admin/me
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/me') {
      if (method !== 'GET') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed for /api/admin/me.` });
      }
      const authHeader = req.headers['authorization'] || '';
      if (!authHeader.startsWith('Bearer ')) {
        return sendJson(res, 401, { success: false, error: 'Authorization token required.' });
      }
      return sendJson(res, 200, {
        success: true,
        admin: {
          id: 1,
          username: 'admin',
          email: 'admin@ibrahimtanveer.dev',
          full_name: 'Ibrahim Tanveer',
          role: 'superadmin'
        }
      });
    }

    // -------------------------------------------------------------------------
    // 4. Admin Stats: GET /api/admin/stats
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/stats') {
      if (method !== 'GET') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed for /api/admin/stats.` });
      }
      const total = projectsCache.length;
      const published = projectsCache.filter((p) => p.status === 'published').length;
      const draft = projectsCache.filter((p) => p.status === 'draft').length;
      const featured = projectsCache.filter((p) => p.featured).length;

      return sendJson(res, 200, {
        success: true,
        data: {
          total,
          published,
          draft,
          featured,
          categories: categoriesCache,
          recent_projects: projectsCache.slice(0, 5)
        }
      });
    }

    // -------------------------------------------------------------------------
    // 5. Public Categories: GET /api/categories
    // -------------------------------------------------------------------------
    if (pathname === '/api/categories') {
      if (method !== 'GET') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
      }
      return sendJson(res, 200, { success: true, data: categoriesCache });
    }

    // -------------------------------------------------------------------------
    // 6. Admin Categories: /api/admin/categories
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/categories') {
      if (method === 'GET') {
        return sendJson(res, 200, { success: true, data: categoriesCache });
      }
      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const name = (body.name || '').trim();
        if (!name) {
          return sendJson(res, 400, { success: false, error: 'Category name is required.' });
        }
        const newCat = {
          id: categoriesCache.length + 1,
          name,
          description: (body.description || '').trim()
        };
        categoriesCache.push(newCat);
        return sendJson(res, 201, { success: true, message: `Category '${name}' created.`, data: newCat });
      }
      return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
    }

    // -------------------------------------------------------------------------
    // 7. Public Projects List: GET /api/projects
    // -------------------------------------------------------------------------
    if (pathname === '/api/projects') {
      if (method !== 'GET') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
      }
      const publishedProjects = projectsCache.filter((p) => p.status === 'published');
      return sendJson(res, 200, {
        success: true,
        count: publishedProjects.length,
        data: publishedProjects
      });
    }

    // -------------------------------------------------------------------------
    // 8. Public Single Project: GET /api/projects/:id
    // -------------------------------------------------------------------------
    const projectMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (projectMatch && !pathname.startsWith('/api/projects/workspaces') && !pathname.startsWith('/api/projects/open-workspace')) {
      const pId = projectMatch[1];
      const project = projectsCache.find((p) => p.id === pId);
      if (!project) {
        return sendJson(res, 404, { success: false, error: `Project '${pId}' not found.` });
      }
      return sendJson(res, 200, { success: true, data: project });
    }

    // -------------------------------------------------------------------------
    // 9. Admin Projects List & CREATE: /api/admin/projects OR /api/admin/websites
    // -------------------------------------------------------------------------
    if (pathname === '/api/admin/projects' || pathname === '/api/admin/websites') {
      if (method === 'GET') {
        const search = (url.searchParams.get('search') || '').toLowerCase().trim();
        const category = url.searchParams.get('category') || '';
        const status = (url.searchParams.get('status') || '').toLowerCase().trim();

        let filtered = [...projectsCache];
        if (search) {
          filtered = filtered.filter(
            (p) =>
              (p.title && p.title.toLowerCase().includes(search)) ||
              (p.description && p.description.toLowerCase().includes(search))
          );
        }
        if (category && category !== 'All') {
          filtered = filtered.filter((p) => p.category === category);
        }
        if (status && status !== 'all') {
          filtered = filtered.filter((p) => p.status === status);
        }

        return sendJson(res, 200, {
          success: true,
          count: filtered.length,
          data: filtered
        });
      }

      if (method === 'POST') {
        const body = await parseJsonBody(req);
        const title = (body.title || body.name || '').trim();
        if (!title) {
          return sendJson(res, 400, { success: false, error: 'Website / Project name is required.' });
        }

        let urlVal = (body.live_demo_url || body.url || '').trim();
        if (!urlVal) {
          return sendJson(res, 400, { success: false, error: 'Website URL is required.' });
        }

        if (!urlVal.startsWith('http://') && !urlVal.startsWith('https://') && !urlVal.startsWith('#')) {
          urlVal = `https://${urlVal}`;
        }

        const description = (body.description || '').trim();
        if (!description) {
          return sendJson(res, 400, { success: false, error: 'Website description is required.' });
        }

        const rawId = (body.id || '').trim();
        let newId = slugify(rawId || title);
        if (projectsCache.some((p) => p.id === newId)) {
          newId = `${newId}-${Date.now().toString().slice(-4)}`;
        }

        const newProject = {
          id: newId,
          title,
          name: title,
          subtitle: (body.subtitle || '').trim(),
          category: (body.category || 'Web Application').trim(),
          description,
          overview: (body.overview || description).trim(),
          problem: (body.problem || '').trim(),
          solution: (body.solution || '').trim(),
          technologies: Array.isArray(body.technologies) ? body.technologies : [],
          features: Array.isArray(body.features) ? body.features : [],
          image_url: (body.image_url || body.image || '/assets/projects/ai_web_platform.png').trim(),
          image: (body.image_url || body.image || '/assets/projects/ai_web_platform.png').trim(),
          live_demo_url: urlVal,
          url: urlVal,
          github_url: (body.github_url || body.githubUrl || '').trim(),
          githubUrl: (body.github_url || body.githubUrl || '').trim(),
          status: (body.status || 'published').toLowerCase().trim(),
          featured: Boolean(body.featured),
          sort_order: Number(body.sort_order) || 0,
          screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
          created_at: new Date().toISOString()
        };

        // Prepend new project so it displays first
        projectsCache = [newProject, ...projectsCache.filter((p) => p.id !== newId)];

        return sendJson(res, 201, {
          success: true,
          message: `Website '${title}' added successfully.`,
          website: newProject,
          data: newProject
        });
      }

      return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
    }

    // -------------------------------------------------------------------------
    // 10. Admin Project Details, Update, Delete: /api/admin/projects/:id
    // -------------------------------------------------------------------------
    const adminProjectMatch = pathname.match(/^\/api\/admin\/(?:projects|websites)\/([^/]+)$/);
    if (adminProjectMatch) {
      const pId = adminProjectMatch[1];
      const existingIndex = projectsCache.findIndex((p) => p.id === pId);

      if (method === 'GET') {
        if (existingIndex === -1) {
          return sendJson(res, 404, { success: false, error: `Website '${pId}' not found.` });
        }
        return sendJson(res, 200, { success: true, data: projectsCache[existingIndex] });
      }

      if (method === 'PUT') {
        if (existingIndex === -1) {
          return sendJson(res, 404, { success: false, error: `Website '${pId}' not found.` });
        }
        const body = await parseJsonBody(req);
        const existing = projectsCache[existingIndex];
        const updated = {
          ...existing,
          ...body,
          id: pId,
          title: body.title || body.name || existing.title,
          name: body.title || body.name || existing.title,
          live_demo_url: body.live_demo_url || body.url || existing.live_demo_url,
          url: body.live_demo_url || body.url || existing.url,
          updated_at: new Date().toISOString()
        };
        projectsCache[existingIndex] = updated;

        return sendJson(res, 200, {
          success: true,
          message: `Website '${updated.title}' updated successfully.`,
          website: updated,
          data: updated
        });
      }

      if (method === 'DELETE') {
        if (existingIndex === -1) {
          return sendJson(res, 404, { success: false, error: `Website '${pId}' not found.` });
        }
        const removed = projectsCache.splice(existingIndex, 1)[0];
        return sendJson(res, 200, {
          success: true,
          message: `Website '${removed.title}' deleted successfully.`
        });
      }

      return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
    }

    // -------------------------------------------------------------------------
    // 11. Contact Form: POST /api/contact
    // -------------------------------------------------------------------------
    if (pathname === '/api/contact') {
      if (method !== 'POST') {
        return sendJson(res, 405, { success: false, error: `HTTP method ${method} is not allowed.` });
      }
      const body = await parseJsonBody(req);
      const name = (body.name || '').trim();
      const email = (body.email || '').trim();
      const message = (body.message || '').trim();

      if (!name || !email || !message) {
        return sendJson(res, 400, { success: false, error: 'Please fill in all required fields (name, email, message).' });
      }

      return sendJson(res, 201, {
        success: true,
        message: 'Thank you for reaching out, Ibrahim will get back to you shortly!',
        data: { name, email, project_type: body.project_type || 'AI Web App' }
      });
    }

    // -------------------------------------------------------------------------
    // 12. Workspace / Desktop Launch: POST /api/projects/open-workspace
    // -------------------------------------------------------------------------
    if (pathname === '/api/projects/open-workspace' || pathname === '/api/admin/open-project') {
      return sendJson(res, 200, {
        success: true,
        message: 'Workspace launch handler acknowledged.'
      });
    }

    // -------------------------------------------------------------------------
    // 13. Fallback: 404 Not Found
    // -------------------------------------------------------------------------
    return sendJson(res, 404, {
      success: false,
      error: `The requested API route '${pathname}' was not found.`
    });

  } catch (err) {
    return sendJson(res, 500, {
      success: false,
      error: err.message || 'Internal server error occurred.'
    });
  }
}
