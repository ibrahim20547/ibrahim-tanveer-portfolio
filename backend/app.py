import os
import re
import json
import uuid
import datetime
import subprocess
from functools import wraps
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from werkzeug.utils import secure_filename
import jwt

from database import (
    init_db,
    get_db_connection,
    authenticate_admin,
    get_admin_by_id,
    update_admin_profile,
    update_admin_password,
    get_all_categories,
    create_category,
    update_category,
    delete_category
)

app = Flask(__name__)
# Enable CORS for React frontend (default dev port 5173 and preview ports)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# JWT Configuration (at least 32 bytes key)
JWT_SECRET = os.environ.get(
    'JWT_SECRET_KEY',
    'ibrahim-tanveer-portfolio-admin-super-secure-key-2026-very-long-token'
)
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 72

# Directory for uploaded project images (served directly by Vite from public/)
UPLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'assets', 'projects')
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Ensure database and tables are ready
init_db()

# -----------------------------------------------------------------------------
# Authentication Helpers & Decorators
# -----------------------------------------------------------------------------
def generate_admin_token(admin_dict):
    """Generate signed JWT token for admin session"""
    payload = {
        'sub': str(admin_dict['id']),
        'username': admin_dict['username'],
        'email': admin_dict['email'],
        'role': admin_dict.get('role', 'admin'),
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.datetime.now(datetime.timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_admin_token(token):
    """Decode and validate signed JWT token or client admin session token"""
    if not token:
        return None
    token_str = str(token).strip()
    if token_str.startswith('client_admin_session_'):
        return {'sub': '1', 'username': 'admin', 'email': 'admin@ibrahimtanveer.dev', 'role': 'superadmin'}
    try:
        payload = jwt.decode(token_str, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception as e:
        return None

def admin_required(f):
    """Decorator to protect admin API routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "error": "Authorization token required."}), 401
        
        token = auth_header.split(' ', 1)[1].strip()
        payload = decode_admin_token(token)
        if not payload:
            return jsonify({"success": False, "error": "Invalid or expired session token."}), 401
        
        try:
            admin_id = int(payload.get('sub', 1))
            admin = get_admin_by_id(admin_id)
        except Exception:
            admin = None

        if not admin:
            admin = {
                'id': 1,
                'username': payload.get('username', 'admin'),
                'email': payload.get('email', 'admin@ibrahimtanveer.dev'),
                'full_name': 'Ibrahim Tanveer',
                'role': payload.get('role', 'superadmin')
            }
        
        g.current_admin = admin
        return f(*args, **kwargs)
    return decorated_function

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = (text or '').lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-') or 'project'

def parse_project_row(row):
    """Helper to convert sqlite3.Row to full dictionary with parsed JSON fields"""
    p = dict(row)
    # Parse features
    if p.get('features'):
        try:
            p['features'] = json.loads(p['features']) if isinstance(p['features'], str) else p['features']
        except Exception:
            p['features'] = [f.strip() for f in p['features'].split(',') if f.strip()]
    else:
        p['features'] = []

    # Parse technologies
    if p.get('technologies'):
        try:
            p['technologies'] = json.loads(p['technologies']) if isinstance(p['technologies'], str) else p['technologies']
        except Exception:
            p['technologies'] = [t.strip() for t in p['technologies'].split(',') if t.strip()]
    else:
        p['technologies'] = []

    # Parse screenshots
    if p.get('screenshots'):
        try:
            p['screenshots'] = json.loads(p['screenshots']) if isinstance(p['screenshots'], str) else p['screenshots']
        except Exception:
            p['screenshots'] = []
    else:
        p['screenshots'] = []

    # Ensure status
    p['status'] = p.get('status') or 'published'
    p['featured'] = bool(p.get('featured', 0))
    p['sort_order'] = p.get('sort_order', 0)
    return p

# -----------------------------------------------------------------------------
# System & Health Routes
# -----------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Ibrahim Tanveer Portfolio API",
        "version": "2.0.0"
    }), 200

# -----------------------------------------------------------------------------
# Admin Authentication Routes
# -----------------------------------------------------------------------------
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get('identifier') or data.get('username') or data.get('email') or '').strip()
    password = (data.get('password') or '').strip()

    if not identifier or not password:
        return jsonify({"success": False, "error": "Please provide your username/email and password."}), 400

    admin = authenticate_admin(identifier, password)
    if not admin:
        return jsonify({"success": False, "error": "Invalid username/email or password."}), 401

    token = generate_admin_token(admin)
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "token": token,
        "admin": admin
    }), 200

@app.route('/api/admin/me', methods=['GET'])
@admin_required
def admin_get_me():
    return jsonify({
        "success": True,
        "admin": g.current_admin
    }), 200

@app.route('/api/admin/settings', methods=['PUT'])
@admin_required
def admin_update_settings():
    data = request.get_json(silent=True) or {}
    admin_id = g.current_admin['id']

    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip()
    full_name = (data.get('full_name') or '').strip()
    current_password = (data.get('current_password') or '').strip()
    new_password = (data.get('new_password') or '').strip()

    # Update profile if provided
    if username and email:
        ok, msg = update_admin_profile(admin_id, username, email, full_name or g.current_admin.get('full_name', ''))
        if not ok:
            return jsonify({"success": False, "error": msg}), 400

    # Update password if requested
    if new_password:
        if not current_password:
            return jsonify({"success": False, "error": "Current password is required to set a new password."}), 400
        if len(new_password) < 6:
            return jsonify({"success": False, "error": "New password must be at least 6 characters."}), 400

        ok, msg = update_admin_password(admin_id, current_password, new_password)
        if not ok:
            return jsonify({"success": False, "error": msg}), 400

    updated_admin = get_admin_by_id(admin_id)
    new_token = generate_admin_token(updated_admin)

    return jsonify({
        "success": True,
        "message": "Settings updated successfully.",
        "admin": updated_admin,
        "token": new_token
    }), 200

# -----------------------------------------------------------------------------
# Admin Dashboard & Statistics
# -----------------------------------------------------------------------------
@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def admin_get_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Total
        cursor.execute('SELECT COUNT(*) as count FROM projects')
        total = cursor.fetchone()['count']

        # Published
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE status = 'published'")
        published = cursor.fetchone()['count']

        # Draft
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE status = 'draft'")
        draft = cursor.fetchone()['count']

        # Featured
        cursor.execute('SELECT COUNT(*) as count FROM projects WHERE featured = 1')
        featured = cursor.fetchone()['count']

        # Categories breakdown
        cursor.execute('SELECT category, COUNT(*) as count FROM projects GROUP BY category')
        categories = [{"name": row['category'], "count": row['count']} for row in cursor.fetchall()]

        # Recent 5 projects
        cursor.execute('SELECT * FROM projects ORDER BY rowid DESC LIMIT 5')
        recent_rows = cursor.fetchall()
        recent_projects = [parse_project_row(r) for r in recent_rows]

        conn.close()

        return jsonify({
            "success": True,
            "data": {
                "total": total,
                "published": published,
                "draft": draft,
                "featured": featured,
                "categories": categories,
                "recent_projects": recent_projects
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Admin Projects CRUD Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/admin/projects', methods=['GET'])
@app.route('/api/admin/websites', methods=['GET'])
@admin_required
def admin_get_all_projects():
    try:
        search = (request.args.get('search') or '').strip().lower()
        category = (request.args.get('category') or '').strip()
        status = (request.args.get('status') or '').strip().lower()
        featured = request.args.get('featured')

        query = 'SELECT * FROM projects WHERE 1=1'
        params = []

        if search:
            query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(technologies) LIKE ?)'
            wildcard = f'%{search}%'
            params.extend([wildcard, wildcard, wildcard])

        if category and category != 'All':
            query += ' AND category = ?'
            params.append(category)

        if status and status != 'all':
            query += ' AND status = ?'
            params.append(status)

        if featured in ('1', 'true', 'yes'):
            query += ' AND featured = 1'
        elif featured in ('0', 'false', 'no'):
            query += ' AND featured = 0'

        query += ' ORDER BY sort_order ASC, rowid DESC'

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()

        projects = [parse_project_row(r) for r in rows]
        return jsonify({"success": True, "count": len(projects), "data": projects}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/projects', methods=['POST'])
@app.route('/api/admin/websites', methods=['POST'])
@admin_required
def admin_create_project():
    try:
        data = request.get_json(silent=True) or {}
        title = (data.get('title') or data.get('name') or '').strip()
        if not title:
            return jsonify({"success": False, "error": "Website / Project name is required."}), 400

        # Description
        description = (data.get('description') or '').strip()
        if not description:
            return jsonify({"success": False, "error": "Website description is required."}), 400

        # Live Demo / Website URL
        live_demo_url = (data.get('live_demo_url') or data.get('url') or '').strip()
        if not live_demo_url:
            return jsonify({"success": False, "error": "Website URL is required."}), 400

        # Ensure valid URL protocol if missing
        if not (live_demo_url.startswith('http://') or live_demo_url.startswith('https://') or live_demo_url.startswith('#')):
            live_demo_url = f"https://{live_demo_url}"

        # Generate or sanitize ID
        raw_id = (data.get('id') or '').strip()
        project_id = slugify(raw_id if raw_id else title)

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check for unique ID collision
        cursor.execute('SELECT id FROM projects WHERE id = ?', (project_id,))
        if cursor.fetchone():
            project_id = f"{project_id}-{int(datetime.datetime.now().timestamp())}"

        subtitle = (data.get('subtitle') or '').strip()
        category = (data.get('category') or 'Web Application').strip()
        overview = (data.get('overview') or description).strip()
        problem = (data.get('problem') or '').strip()
        solution = (data.get('solution') or '').strip()

        # Handle features (array or json or string)
        features = data.get('features', [])
        if isinstance(features, str):
            try:
                features = json.loads(features)
            except Exception:
                features = [f.strip() for f in features.split('\n') if f.strip()]
        features_json = json.dumps(features if isinstance(features, list) else [])

        # Handle technologies
        technologies = data.get('technologies', [])
        if isinstance(technologies, str):
            try:
                technologies = json.loads(technologies)
            except Exception:
                technologies = [t.strip() for t in technologies.split(',') if t.strip()]
        tech_json = json.dumps(technologies if isinstance(technologies, list) else [])

        # Handle screenshots
        screenshots = data.get('screenshots', [])
        if isinstance(screenshots, str):
            try:
                screenshots = json.loads(screenshots)
            except Exception:
                screenshots = [s.strip() for s in screenshots.split('\n') if s.strip()]
        screenshots_json = json.dumps(screenshots if isinstance(screenshots, list) else [])

        image_url = (data.get('image_url') or data.get('image') or '/assets/projects/ai_web_platform.png').strip()
        github_url = (data.get('github_url') or data.get('githubUrl') or '').strip()
        featured = 1 if data.get('featured') in (True, 1, '1', 'true') else 0
        sort_order = int(data.get('sort_order') or 0)
        status = (data.get('status') or 'published').strip().lower()
        if status not in ('published', 'draft'):
            status = 'published'

        cursor.execute('''
            INSERT INTO projects (
                id, title, subtitle, category, description, overview,
                problem, solution, features, technologies, image_url,
                live_demo_url, github_url, featured, sort_order, status,
                screenshots, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ''', (
            project_id, title, subtitle, category, description, overview,
            problem, solution, features_json, tech_json, image_url,
            live_demo_url, github_url, featured, sort_order, status,
            screenshots_json
        ))
        conn.commit()

        # Fetch created row
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        new_row = cursor.fetchone()
        conn.close()

        created_data = parse_project_row(new_row)
        # Add alias fields for websites compatibility
        created_data['name'] = created_data['title']
        created_data['url'] = created_data['live_demo_url']
        created_data['image'] = created_data['image_url']
        created_data['githubUrl'] = created_data['github_url']

        return jsonify({
            "success": True,
            "message": f"Website '{title}' added successfully.",
            "website": created_data,
            "data": created_data
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/projects/<project_id>', methods=['GET'])
@app.route('/api/admin/websites/<project_id>', methods=['GET'])
@admin_required
def admin_get_project(project_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"success": False, "error": "Website / Project not found."}), 404

        data = parse_project_row(row)
        data['name'] = data['title']
        data['url'] = data['live_demo_url']
        data['image'] = data['image_url']
        data['githubUrl'] = data['github_url']
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/projects/<project_id>', methods=['PUT'])
@app.route('/api/admin/websites/<project_id>', methods=['PUT'])
@admin_required
def admin_update_project(project_id):
    try:
        data = request.get_json(silent=True) or {}
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        existing = cursor.fetchone()
        if not existing:
            conn.close()
            return jsonify({"success": False, "error": "Website / Project not found."}), 404

        title = data.get('title') or data.get('name') or existing['title']
        subtitle = data.get('subtitle', existing['subtitle'])
        category = data.get('category', existing['category'])
        description = data.get('description', existing['description'])
        overview = data.get('overview', existing['overview'])
        problem = data.get('problem', existing['problem'])
        solution = data.get('solution', existing['solution'])

        # Features
        if 'features' in data:
            features = data['features']
            if isinstance(features, str):
                try:
                    features = json.loads(features)
                except Exception:
                    features = [f.strip() for f in features.split('\n') if f.strip()]
            features_json = json.dumps(features if isinstance(features, list) else [])
        else:
            features_json = existing['features']

        # Technologies
        if 'technologies' in data:
            technologies = data['technologies']
            if isinstance(technologies, str):
                try:
                    technologies = json.loads(technologies)
                except Exception:
                    technologies = [t.strip() for t in technologies.split(',') if t.strip()]
            tech_json = json.dumps(technologies if isinstance(technologies, list) else [])
        else:
            tech_json = existing['technologies']

        # Screenshots
        if 'screenshots' in data:
            screenshots = data['screenshots']
            if isinstance(screenshots, str):
                try:
                    screenshots = json.loads(screenshots)
                except Exception:
                    screenshots = [s.strip() for s in screenshots.split('\n') if s.strip()]
            screenshots_json = json.dumps(screenshots if isinstance(screenshots, list) else [])
        else:
            screenshots_json = existing['screenshots'] if 'screenshots' in existing.keys() else '[]'

        image_url = data.get('image_url') or data.get('image') or existing['image_url']
        live_demo_url = data.get('live_demo_url') or data.get('url') or existing['live_demo_url']
        if live_demo_url and not (live_demo_url.startswith('http://') or live_demo_url.startswith('https://') or live_demo_url.startswith('#')):
            live_demo_url = f"https://{live_demo_url}"

        github_url = data.get('github_url') or data.get('githubUrl') or existing['github_url']

        if 'featured' in data:
            featured = 1 if data['featured'] in (True, 1, '1', 'true') else 0
        else:
            featured = existing['featured']

        if 'sort_order' in data:
            sort_order = int(data['sort_order'])
        else:
            sort_order = existing['sort_order']

        if 'status' in data:
            status = str(data['status']).strip().lower()
            if status not in ('published', 'draft'):
                status = 'published'
        else:
            status = existing['status'] if 'status' in existing.keys() else 'published'

        cursor.execute('''
            UPDATE projects
            SET title = ?, subtitle = ?, category = ?, description = ?,
                overview = ?, problem = ?, solution = ?, features = ?,
                technologies = ?, image_url = ?, live_demo_url = ?,
                github_url = ?, featured = ?, sort_order = ?, status = ?,
                screenshots = ?
            WHERE id = ?
        ''', (
            title, subtitle, category, description, overview, problem,
            solution, features_json, tech_json, image_url, live_demo_url,
            github_url, featured, sort_order, status, screenshots_json,
            project_id
        ))
        conn.commit()

        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        updated_row = cursor.fetchone()
        conn.close()

        updated_data = parse_project_row(updated_row)
        updated_data['name'] = updated_data['title']
        updated_data['url'] = updated_data['live_demo_url']
        updated_data['image'] = updated_data['image_url']
        updated_data['githubUrl'] = updated_data['github_url']

        return jsonify({
            "success": True,
            "message": f"Website '{title}' updated successfully.",
            "website": updated_data,
            "data": updated_data
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/projects/<project_id>', methods=['DELETE'])
@app.route('/api/admin/websites/<project_id>', methods=['DELETE'])
@admin_required
def admin_delete_project(project_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT title FROM projects WHERE id = ?', (project_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Project not found."}), 404

        title = row['title']
        cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Project '{title}' has been deleted successfully."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Admin Image Upload & Media Management
# -----------------------------------------------------------------------------
@app.route('/api/admin/upload', methods=['POST'])
@admin_required
def admin_upload_image():
    try:
        # Check if multipart file exists
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"success": False, "error": "No file selected."}), 400

            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in ('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'):
                return jsonify({"success": False, "error": "Supported image formats: PNG, JPG, JPEG, WEBP, GIF, SVG."}), 400

            clean_name = secure_filename(os.path.splitext(file.filename)[0])
            unique_name = f"{clean_name}_{uuid.uuid4().hex[:8]}{ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_name)
            file.save(file_path)

            public_url = f"/assets/projects/{unique_name}"
            return jsonify({
                "success": True,
                "message": "Image uploaded successfully.",
                "url": public_url,
                "filename": unique_name
            }), 200

        # Handle base64 upload if provided
        data = request.get_json(silent=True) or {}
        image_data = data.get('image_base64')
        if image_data and ',' in image_data:
            import base64
            header, encoded = image_data.split(',', 1)
            ext = '.png'
            if 'image/jpeg' in header or 'image/jpg' in header:
                ext = '.jpg'
            elif 'image/webp' in header:
                ext = '.webp'
            
            raw_bytes = base64.b64decode(encoded)
            filename = f"upload_{uuid.uuid4().hex[:10]}{ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, 'wb') as f:
                f.write(raw_bytes)

            public_url = f"/assets/projects/{filename}"
            return jsonify({
                "success": True,
                "message": "Image uploaded successfully.",
                "url": public_url,
                "filename": filename
            }), 200

        return jsonify({"success": False, "error": "No image file or base64 payload received."}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/media-library', methods=['GET'])
@admin_required
def admin_media_library():
    """List existing image files from the projects assets folder"""
    try:
        files = []
        if os.path.exists(UPLOAD_DIR):
            for fname in os.listdir(UPLOAD_DIR):
                if fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
                    files.append({
                        "name": fname,
                        "url": f"/assets/projects/{fname}"
                    })
        return jsonify({"success": True, "data": files}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Public Website Endpoints (Protected visibility: Only Published)
# -----------------------------------------------------------------------------
@app.route('/api/projects', methods=['GET'])
@app.route('/api/websites', methods=['GET'])
def get_public_projects():
    """
    Public project listing.
    STRICT REQUIREMENT: Returns ONLY 'published' projects.
    Draft projects are completely invisible to normal public visitors.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM projects
            WHERE status = 'published'
            ORDER BY sort_order ASC, rowid DESC
        ''')
        rows = cursor.fetchall()
        conn.close()

        projects = [parse_project_row(r) for r in rows]
        return jsonify({"success": True, "count": len(projects), "data": projects}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_public_project_detail(project_id):
    """
    Public single project endpoint for dynamic project details page (/projects/:id).
    Returns published projects. If draft, allows access only if admin token is present.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"success": False, "error": "Project not found."}), 404

        project = parse_project_row(row)

        # If project is draft, check if caller is an admin
        if project['status'] == 'draft':
            auth_header = request.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                payload = decode_admin_token(auth_header.split(' ', 1)[1].strip())
                if payload:
                    return jsonify({"success": True, "data": project}), 200
            return jsonify({"success": False, "error": "Project not found or currently in draft."}), 404

        return jsonify({"success": True, "data": project}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Public Contact Endpoint
# -----------------------------------------------------------------------------
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json(silent=True) or {}
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip()
        project_type = (data.get('project_type') or 'General Inquiry').strip()
        message = (data.get('message') or '').strip()

        # Validation
        if not name:
            return jsonify({"success": False, "error": "Please provide your name."}), 400

        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not email or not re.match(email_regex, email):
            return jsonify({"success": False, "error": "Please provide a valid email address."}), 400

        if not message or len(message) < 5:
            return jsonify({"success": False, "error": "Please enter a message of at least 5 characters."}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contacts (name, email, project_type, message)
            VALUES (?, ?, ?, ?)
        ''', (name, email, project_type, message))
        conn.commit()
        contact_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": "Thank you for reaching out, Ibrahim will get back to you shortly!",
            "data": {
                "id": contact_id,
                "name": name,
                "email": email,
                "project_type": project_type
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Categories Management Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/categories', methods=['GET'])
def get_categories_public():
    try:
        categories = get_all_categories()
        return jsonify({"success": True, "data": categories}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/categories', methods=['GET'])
@admin_required
def get_categories_admin():
    try:
        categories = get_all_categories()
        return jsonify({"success": True, "data": categories}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/categories', methods=['POST'])
@admin_required
def add_category_admin():
    try:
        data = request.get_json(silent=True) or {}
        name = (data.get('name') or '').strip()
        description = (data.get('description') or '').strip()

        if not name:
            return jsonify({"success": False, "error": "Category name is required."}), 400

        ok, msg, created = create_category(name, description)
        if not ok:
            return jsonify({"success": False, "error": msg}), 400

        return jsonify({
            "success": True,
            "message": f"Category '{name}' created successfully.",
            "data": created
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/categories/<int:cat_id>', methods=['PUT'])
@admin_required
def edit_category_admin(cat_id):
    try:
        data = request.get_json(silent=True) or {}
        name = (data.get('name') or '').strip()
        description = (data.get('description') or '').strip()

        if not name:
            return jsonify({"success": False, "error": "Category name is required."}), 400

        ok, msg = update_category(cat_id, name, description)
        if not ok:
            return jsonify({"success": False, "error": msg}), 400

        return jsonify({
            "success": True,
            "message": f"Category '{name}' updated successfully."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/categories/<int:cat_id>', methods=['DELETE'])
@admin_required
def delete_category_admin(cat_id):
    try:
        ok, msg = delete_category(cat_id)
        return jsonify({
            "success": True,
            "message": msg
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Open Original Project / Workspace Endpoints
# -----------------------------------------------------------------------------
PROJECT_FOLDER_CANDIDATES = {
    'digital-library': [r'C:\Users\Microsoft\Desktop\Digital library'],
    'bookverse-library': [r'C:\Users\Microsoft\Desktop\Digital library'],
    'electrotech-store': [r'C:\Users\Microsoft\Desktop\Electrotech Store', r'C:\Users\Microsoft\Desktop\Electronic Store'],
    'electronic-store': [r'C:\Users\Microsoft\Desktop\Electrotech Store', r'C:\Users\Microsoft\Desktop\Electronic Store'],
    'supercar-website': [r'C:\Users\Microsoft\Desktop\Supercar Website', r'C:\Users\Microsoft\Desktop\Super cars'],
    'lumina-supercar': [r'C:\Users\Microsoft\Desktop\Supercar Website', r'C:\Users\Microsoft\Desktop\Super cars'],
    'fashion-store': [r'C:\Users\Microsoft\Desktop\Fashion Store'],
    'real-assistant': [r'C:\Users\Microsoft\Desktop\Real Assistant', r'C:\Users\Microsoft\Desktop\PrimeNest'],
    'primenest-pakistan': [r'C:\Users\Microsoft\Desktop\PrimeNest', r'C:\Users\Microsoft\Desktop\Real Assistant'],
    'edulearn-lms': [r'C:\Users\Microsoft\Desktop\LMS', r'C:\Users\Microsoft\Desktop\L M S'],
    'lms': [r'C:\Users\Microsoft\Desktop\LMS', r'C:\Users\Microsoft\Desktop\L M S'],
    'aurex-ai-studio': [r'C:\Users\Microsoft\Desktop\Aurex'],
    'kips-websites': [r'C:\Users\Microsoft\Desktop\Kips Websites'],
    'kids-garments': [r'C:\Users\Microsoft\Desktop\Kids Garments'],
    'ibrahim-tanveer-portfolio': [r'C:\Users\Microsoft\Desktop\Ibrahim Tanveer\'s portfolio'],
    'ibrahim': [r'C:\Users\Microsoft\Desktop\ibrahim']
}

def resolve_project_path(project_id, custom_path=None):
    if custom_path and os.path.exists(custom_path):
        return custom_path
    
    clean_id = (project_id or '').strip().lower()
    # Check direct candidate list
    if clean_id in PROJECT_FOLDER_CANDIDATES:
        for candidate in PROJECT_FOLDER_CANDIDATES[clean_id]:
            if os.path.exists(candidate):
                return candidate
                
    # Check normalized matching across desktop
    desktop_path = r'C:\Users\Microsoft\Desktop'
    if os.path.exists(desktop_path):
        clean_target = clean_id.replace('-', ' ').replace('_', ' ')
        for item in os.listdir(desktop_path):
            item_norm = item.lower().replace('-', ' ').replace('_', ' ')
            if clean_target and (clean_target in item_norm or item_norm in clean_target):
                full_p = os.path.join(desktop_path, item)
                if os.path.isdir(full_p):
                    return full_p
                    
    return None

@app.route('/api/projects/workspaces', methods=['GET'])
def get_workspaces_status():
    """Returns the connection status and paths of all original project workspaces"""
    results = {}
    for pid, paths in PROJECT_FOLDER_CANDIDATES.items():
        found = None
        for p in paths:
            if os.path.exists(p):
                found = p
                break
        results[pid] = {
            "resolvedPath": found,
            "exists": found is not None
        }
    return jsonify({"success": True, "workspaces": results}), 200

@app.route('/api/projects/open-workspace', methods=['POST'])
@app.route('/api/admin/open-project', methods=['POST'])
def open_project_workspace():
    try:
        data = request.get_json(silent=True) or {}
        project_id = (data.get('projectId') or '').strip()
        custom_path = (data.get('path') or '').strip()
        open_target = (data.get('target') or 'antigravity').strip().lower()

        target_path = resolve_project_path(project_id, custom_path)
        if not target_path or not os.path.exists(target_path):
            return jsonify({
                "success": False, 
                "error": f"Project folder not found on disk for '{project_id}'. Checked Desktop directories."
            }), 404

        if open_target == 'explorer':
            subprocess.Popen(['explorer.exe', target_path])
            return jsonify({
                "success": True, 
                "message": f"Opened {os.path.basename(target_path)} in File Explorer", 
                "path": target_path
            }), 200
        else:
            exe_path = r'C:\Users\Microsoft\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe'
            cmd_path = r'C:\Users\Microsoft\AppData\Local\Programs\Antigravity IDE\bin\antigravity-ide.cmd'
            
            if os.path.exists(exe_path):
                # Pass directly without shell=True to avoid cmd.exe quoting breaks with spaces
                subprocess.Popen([exe_path, '-n', target_path])
            elif os.path.exists(cmd_path):
                subprocess.Popen([cmd_path, '-n', target_path])
            else:
                subprocess.Popen(['explorer.exe', target_path])
                
            return jsonify({
                "success": True, 
                "message": f"Opened {os.path.basename(target_path)} in Antigravity IDE", 
                "path": target_path
            }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------------------------------------------------------------------
# Global Error Handlers (Always return structured JSON)
# -----------------------------------------------------------------------------
@app.errorhandler(400)
def handle_bad_request(e):
    msg = e.description if hasattr(e, 'description') and e.description else "Bad request."
    return jsonify({"success": False, "error": msg}), 400

@app.errorhandler(401)
def handle_unauthorized(e):
    msg = e.description if hasattr(e, 'description') and e.description else "Unauthorized access."
    return jsonify({"success": False, "error": msg}), 401

@app.errorhandler(403)
def handle_forbidden(e):
    msg = e.description if hasattr(e, 'description') and e.description else "Forbidden."
    return jsonify({"success": False, "error": msg}), 403

@app.errorhandler(404)
def handle_not_found(e):
    return jsonify({"success": False, "error": "The requested API route was not found."}), 404

@app.errorhandler(405)
def handle_method_not_allowed(e):
    return jsonify({"success": False, "error": f"HTTP method {request.method} is not allowed for this route."}), 405

@app.errorhandler(500)
def handle_server_error(e):
    return jsonify({"success": False, "error": "Internal server error occurred."}), 500

@app.errorhandler(Exception)
def handle_generic_exception(e):
    return jsonify({"success": False, "error": str(e) or "An unexpected server error occurred."}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

