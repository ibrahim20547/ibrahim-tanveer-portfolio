import sqlite3
import os
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'portfolio.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Contacts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            project_type TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subtitle TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            overview TEXT NOT NULL,
            problem TEXT NOT NULL,
            solution TEXT NOT NULL,
            features TEXT NOT NULL,
            technologies TEXT NOT NULL,
            image_url TEXT NOT NULL,
            live_demo_url TEXT,
            github_url TEXT,
            featured INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0,
            status TEXT DEFAULT 'published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            screenshots TEXT DEFAULT '[]'
        )
    ''')

    # Schema migration: Check for missing columns in existing projects table
    cursor.execute('PRAGMA table_info(projects)')
    columns = [col['name'] for col in cursor.fetchall()]
    
    if 'status' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'published'")
    if 'created_at' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN created_at TEXT DEFAULT NULL")
        cursor.execute("UPDATE projects SET created_at = datetime('now') WHERE created_at IS NULL")
    if 'screenshots' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN screenshots TEXT DEFAULT '[]'")

    # Admins table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT DEFAULT 'Ibrahim Tanveer',
            role TEXT DEFAULT 'superadmin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed default categories if none exist
    cursor.execute('SELECT COUNT(*) as count FROM categories')
    if cursor.fetchone()['count'] == 0:
        default_cats = [
            ('Web Application', 'Full-featured interactive web software and SaaS portals'),
            ('E-Commerce', 'Online retail, product catalogs, shopping carts, and payment checkouts'),
            ('AI & Machine Learning', 'Generative AI, conversational interfaces, and intelligent automation'),
            ('Education & LMS', 'Learning platforms, course catalogs, student portals, and digital libraries'),
            ('Portfolio & UI/UX', 'Personal portfolios, design showcases, and creative agency websites'),
            ('Full-Stack & APIs', 'Backend-heavy platforms, REST APIs, and database-driven solutions'),
            ('Web Platforms', 'Scalable multi-user platforms and web systems'),
            ('Other', 'Specialized and custom projects')
        ]
        cursor.executemany('INSERT INTO categories (name, description) VALUES (?, ?)', default_cats)

    # Check and seed default admin
    cursor.execute('SELECT COUNT(*) as count FROM admins')
    admin_count = cursor.fetchone()['count']
    if admin_count == 0:
        default_username = 'admin'
        default_email = 'admin@ibrahimtanveer.dev'
        default_pw = 'Admin@Portfolio2026!'
        pw_hash = generate_password_hash(default_pw)
        cursor.execute('''
            INSERT INTO admins (username, email, password_hash, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        ''', (default_username, default_email, pw_hash, 'Ibrahim Tanveer', 'superadmin'))

    # Check if projects are seeded
    cursor.execute('SELECT COUNT(*) as count FROM projects')
    count = cursor.fetchone()['count']

    if count == 0:
        seed_projects = [
            {
                "id": "ai-web-platform",
                "title": "AI Web Platform",
                "subtitle": "Generative AI Suite & Multi-Tool Workspace",
                "category": "AI & Web Apps",
                "description": "An all-in-one generative AI platform bringing image, code, text, website, and 3D generation into a cohesive web suite.",
                "overview": "The AI Web Platform is built to showcase end-to-end integration of cutting-edge generative AI capabilities within an ultra-responsive, developer-grade web interface. It combines text-to-image synthesis, interactive code generation, and assistive web layout drafting in a single platform.",
                "problem": "Creators and developers frequently switch between multiple isolated AI tools with disparate interfaces, high subscription friction, and fragmented workflows.",
                "solution": "Architected a unified web interface featuring a multi-agent model coordinator, context-aware prompt refinement, and real-time streaming results across text, code, and visual media.",
                "features": json.dumps([
                    "AI Image Generator with style presets",
                    "AI Website Generator with live preview",
                    "AI 3D Model Concept Generator",
                    "AI Design Assistant & UI wireframing",
                    "AI Text Generator for copy & documentation",
                    "AI Code Generator & debugger"
                ]),
                "technologies": json.dumps([
                    "React.js", "Python", "Flask", "OpenAI API", "REST APIs", "Modern CSS"
                ]),
                "image_url": "/assets/projects/ai_web_platform.png",
                "live_demo_url": "#demo-ai-web-platform",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 1
            },
            {
                "id": "bookverse-library",
                "title": "BookVerse — Digital Library",
                "subtitle": "Full-Stack Library Management & Discovery System",
                "category": "Full-Stack & APIs",
                "description": "A comprehensive digital library platform with catalog search, borrow/return workflows, and administrative dashboards.",
                "overview": "BookVerse is an end-to-end digital library platform engineered for reader community engagement and library administration. It includes full role-based access control, catalog organization, real-time inventory availability, and loan management.",
                "problem": "Traditional library catalogs are notoriously clunky, lacking modern search heuristics, responsive mobile views, and seamless self-service borrow/return tracking.",
                "solution": "Built a lightning-fast catalog with dynamic category filtering, reader authentication, member dashboards for tracking borrowed volumes, and a secure admin portal for book CRUD operations.",
                "features": json.dumps([
                    "Curated book collection with faceted search",
                    "Category tagging & genre filtering",
                    "Detailed book metadata and summaries",
                    "Automated Borrow / Return tracking system",
                    "User authentication & reader loan dashboard",
                    "Admin dashboard with complete books CRUD",
                    "RESTful Backend API with structured database"
                ]),
                "technologies": json.dumps([
                    "React.js", "Python", "Flask", "SQLite", "REST APIs", "JWT Auth"
                ]),
                "image_url": "/assets/projects/bookverse_library.png",
                "live_demo_url": "#demo-bookverse",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 2
            },
            {
                "id": "lumina-supercar",
                "title": "Lumina — Supercar Experience",
                "subtitle": "Interactive Automotive Showcase & Customizer",
                "category": "Interactive & UI/UX",
                "description": "A high-performance digital automotive showroom featuring real-time vehicle color customization and AI Car Match.",
                "overview": "Lumina presents an exotic automotive experience focused on hyper-polished aesthetics, buttery smooth UI interactions, and intelligent car recommendation logic. Users explore specs, customize vehicle colorways, and match vehicles based on their driving style.",
                "problem": "Standard automotive dealerships offer static, uninspiring web brochures that fail to convey vehicle excitement, performance dynamism, or personalized configuration.",
                "solution": "Crafted an ultra-luxurious dark-mode interface with interactive color configurators, instant performance telemetry comparisons, dynamic favorites management, and an AI-assisted questionnaire for car matching.",
                "features": json.dumps([
                    "Premium dark-themed automotive UI",
                    "Detailed mechanical specs & performance analytics",
                    "AI Car Match matching driving habits to supercars",
                    "Side-by-side multi-vehicle performance comparison",
                    "Interactive real-time car color customization",
                    "User favorites collection with persistent state",
                    "Silky smooth responsive layout across all screen sizes"
                ]),
                "technologies": json.dumps([
                    "React.js", "Vanilla CSS", "Python Flask", "Canvas/3D Concepts", "REST APIs"
                ]),
                "image_url": "/assets/projects/lumina_supercar.png",
                "live_demo_url": "#demo-lumina",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 3
            },
            {
                "id": "electrotech-store",
                "title": "Electrotech Store",
                "subtitle": "Modern Electronics E-Commerce & Inventory Hub",
                "category": "Full-Stack & APIs",
                "description": "A streamlined electronics store featuring full product catalog management, administrative CRUD, and real-time cart handling.",
                "overview": "Electrotech Store is a production-style electronics platform providing both a modern shopper storefront and a comprehensive merchant administration system to manage hardware items, stock counts, and specs.",
                "problem": "Many e-commerce systems are bloated and slow, complicating basic inventory workflows and distracting shoppers with cluttered interfaces.",
                "solution": "Engineered a minimalist, fast-loading storefront paired with a robust administrative dashboard supporting granular Add/Edit/Delete actions, instant filtering, and responsive device checkout preview.",
                "features": json.dumps([
                    "Dynamic electronics product catalogue",
                    "Categorized hardware browsing (laptops, audio, components)",
                    "Comprehensive Admin dashboard with full CRUD",
                    "Interactive product detail modals & specs sheets",
                    "Backend API integration with SQLite persistence",
                    "Responsive mobile-first layout with smooth transitions"
                ]),
                "technologies": json.dumps([
                    "React.js", "Python", "Flask", "SQLite", "REST APIs", "Modern UI/UX"
                ]),
                "image_url": "/assets/projects/electrotech_store.png",
                "live_demo_url": "#demo-electrotech",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 4
            },
            {
                "id": "real-assistant",
                "title": "Real Assistant — Property Platform",
                "subtitle": "Pakistan-Focused Real Estate & Discovery Portal",
                "category": "Web Platforms",
                "description": "A tailored real estate platform engineered for Pakistan property discovery, interactive map exploration, and detailed listing filters.",
                "overview": "Real Assistant streamlines property acquisition and rental searches across major Pakistani metropolitan hubs (Lahore, Karachi, Islamabad, etc.). It delivers transparent property details, neighborhood insights, and map exploration.",
                "problem": "Regional property portals often lack clean UI design, accurate filtering for plot/house dimensions (Marlas/Kanals), and responsive mobile mapping.",
                "solution": "Developed a clean, focused property portal featuring intuitive Buy and Rent toggles, unit dimension filters, interactive map exploration, and rich image galleries.",
                "features": json.dumps([
                    "Curated property listings across residential & commercial sectors",
                    "Dedicated Buy vs Rent discovery modes",
                    "Granular Pakistan-focused unit filtering (Marla, Kanal, Sq. Ft.)",
                    "Interactive map exploration & location tags",
                    "High-resolution property details and amenities matrix",
                    "Direct inquiry & agent contact interface"
                ]),
                "technologies": json.dumps([
                    "React.js", "Python", "Flask", "REST APIs", "Leaflet/Map Concepts", "CSS"
                ]),
                "image_url": "/assets/projects/real_assistant.png",
                "live_demo_url": "#demo-real-assistant",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 5
            },
            {
                "id": "ai-house-designer",
                "title": "AI House Designer",
                "subtitle": "Architectural Concept & 3D Spatial Planning Tool",
                "category": "AI & Web Apps",
                "description": "An interactive architectural tool allowing users to enter house dimensions and synthesize 3D spatial concepts with custom room layouts.",
                "overview": "AI House Designer bridges consumer architectural aspirations and conceptual design. By inputting lot dimensions, desired stories, and aesthetic styles, users generate immediate 3D conceptual house layouts with customizable color palettes and room arrangements.",
                "problem": "Early-stage house concept visualization usually requires complex CAD software, expensive architectural consulting, or rigid stock blueprints.",
                "solution": "Built a streamlined web app that accepts dimension constraints and prompts, generating interactive spatial floorplans, exterior renderings, and color schemes in real time.",
                "features": json.dumps([
                    "House dimension & plot footprint input controls",
                    "Instant architectural concept generation",
                    "Interactive 3D house concept visualization",
                    "Room allocation and spatial layout explorer",
                    "Exterior & interior palette customization",
                    "Concept export and blueprint specification sheet"
                ]),
                "technologies": json.dumps([
                    "React.js", "Python", "Flask", "Three.js Concepts", "Generative AI Logic"
                ]),
                "image_url": "/assets/projects/ai_house_designer.png",
                "live_demo_url": "#demo-ai-house-designer",
                "github_url": "https://github.com/ibrahimtanveer",
                "sort_order": 6
            }
        ]

        for p in seed_projects:
            cursor.execute('''
                INSERT INTO projects (
                    id, title, subtitle, category, description, overview,
                    problem, solution, features, technologies, image_url,
                    live_demo_url, github_url, sort_order
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                p["id"], p["title"], p["subtitle"], p["category"], p["description"],
                p["overview"], p["problem"], p["solution"], p["features"],
                p["technologies"], p["image_url"], p["live_demo_url"],
                p["github_url"], p["sort_order"]
            ))

    conn.commit()
    conn.close()

def authenticate_admin(identifier, password):
    """Authenticate admin by username or email and return admin dict or None"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM admins
        WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
    ''', (identifier.strip(), identifier.strip()))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    if check_password_hash(row['password_hash'], password):
        return {
            "id": row['id'],
            "username": row['username'],
            "email": row['email'],
            "full_name": row['full_name'],
            "role": row['role'],
            "created_at": row['created_at']
        }
    return None

def get_admin_by_id(admin_id):
    """Get admin profile by ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?', (admin_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def update_admin_profile(admin_id, username, email, full_name):
    """Update admin username, email, and full name"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            UPDATE admins
            SET username = ?, email = ?, full_name = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (username.strip(), email.strip(), full_name.strip(), admin_id))
        conn.commit()
        conn.close()
        return True, "Profile updated successfully"
    except sqlite3.IntegrityError as e:
        conn.close()
        return False, "Username or email is already in use by another account"
    except Exception as e:
        conn.close()
        return False, str(e)

def update_admin_password(admin_id, current_password, new_password):
    """Update admin password after validating current password"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password_hash FROM admins WHERE id = ?', (admin_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False, "Admin account not found"

    if not check_password_hash(row['password_hash'], current_password):
        conn.close()
        return False, "Current password is incorrect"

    new_hash = generate_password_hash(new_password)
    cursor.execute('''
        UPDATE admins
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (new_hash, admin_id))
    conn.commit()
    conn.close()
    return True, "Password changed successfully"

def get_all_categories():
    """Retrieve all categories with project counts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.id, c.name, c.description, c.created_at,
               COUNT(p.id) as total_projects,
               SUM(CASE WHEN p.status = 'published' THEN 1 ELSE 0 END) as published_projects,
               SUM(CASE WHEN p.status = 'draft' THEN 1 ELSE 0 END) as draft_projects
        FROM categories c
        LEFT JOIN projects p ON p.category = c.name
        GROUP BY c.id, c.name, c.description, c.created_at
        ORDER BY c.name ASC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r['id'],
            "name": r['name'],
            "description": r['description'] or '',
            "created_at": r['created_at'],
            "total_projects": r['total_projects'],
            "published_projects": r['published_projects'] or 0,
            "draft_projects": r['draft_projects'] or 0
        }
        for r in rows
    ]

def create_category(name, description=''):
    """Create a new category"""
    name = name.strip()
    if not name:
        return False, "Category name is required", None
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO categories (name, description) VALUES (?, ?)', (name, description.strip()))
        conn.commit()
        cat_id = cursor.lastrowid
        conn.close()
        return True, "Category created successfully", {"id": cat_id, "name": name, "description": description.strip()}
    except sqlite3.IntegrityError:
        conn.close()
        return False, f"Category '{name}' already exists", None
    except Exception as e:
        conn.close()
        return False, str(e), None

def update_category(cat_id, name, description=''):
    """Update category name and update existing projects in that category"""
    name = name.strip()
    if not name:
        return False, "Category name is required"
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Get existing name
        cursor.execute('SELECT name FROM categories WHERE id = ?', (cat_id,))
        old = cursor.fetchone()
        if not old:
            conn.close()
            return False, "Category not found"
        old_name = old['name']

        cursor.execute('''
            UPDATE categories
            SET name = ?, description = ?
            WHERE id = ?
        ''', (name, description.strip(), cat_id))

        # Update category on existing projects if changed
        if old_name != name:
            cursor.execute('UPDATE projects SET category = ? WHERE category = ?', (name, old_name))

        conn.commit()
        conn.close()
        return True, "Category updated successfully"
    except sqlite3.IntegrityError:
        conn.close()
        return False, f"Category name '{name}' is already in use"
    except Exception as e:
        conn.close()
        return False, str(e)

def delete_category(cat_id):
    """Delete category and reassign projects to 'Other'"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT name FROM categories WHERE id = ?', (cat_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return False, "Category not found"
        cat_name = row['name']

        # Reassign projects in this category to 'Other'
        cursor.execute("UPDATE projects SET category = 'Other' WHERE category = ?", (cat_name,))

        cursor.execute('DELETE FROM categories WHERE id = ?', (cat_id,))
        conn.commit()
        conn.close()
        return True, f"Category '{cat_name}' deleted successfully"
    except Exception as e:
        conn.close()
        return False, str(e)

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
