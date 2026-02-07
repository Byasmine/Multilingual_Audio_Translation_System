## **Backend Blog Management API — Flask + PostgreSQL + OOP + Translation + TTS**

---

# **1. Project Overview**

The goal of this project is to develop a **simple backend API** without authentication that manages blog posts and integrates advanced features such as:

* Full CRUD operations for blogs
* Automatic translation of blog content
* Text-to-speech (TTS) generation
* Clean OOP architecture using a `Blog` class
* PostgreSQL database hosted using **Neon**
* Database communication via **psycopg**
* API built with **Flask**
* Mandatory usage of **for loops**, **map**, **filter**, **lambda**

This backend must be clean, educational, and follow modern development standards.

---'

# **2. Mandatory Technologies**

### **Backend Framework**

* Python 3.10+
* Flask

### **OOP + External Libraries**

* Custom `Blog` class (mandatory)
* translate (Python library)
* gTTS (Google Text-to-Speech)
* python-dotenv

### **Database**

* PostgreSQL (Neon hosting)
* psycopg3

---

# **3. Required Project Structure**

Your project must contain the following files:

```
project/
│── api.py               → Flask API routes
│── blog.py              → Blog OOP class (logic, translation, TTS)
│── db.py                → PostgreSQL connection handler (psycopg)
│── requirements.txt
│── .env                 → Contains DATABASE_URL
```

---

# **4. Database Schema**

You must create the following table in PostgreSQL:

### **blogs**

| Column     | Type      | Description   |
| ---------- | --------- | ------------- |
| id         | SERIAL PK | Unique ID     |
| title      | TEXT      | Blog title    |
| content    | TEXT      | Blog content  |
| created_at | TIMESTAMP | Default NOW() |
| updated_at | TIMESTAMP | Default NOW() |

---

# **5. Required Features**

## **A. Blog CRUD Operations**

You must implement the following API endpoints:

| Action           | Method | Endpoint      |
| ---------------- | ------ | ------------- |
| Create a blog    | POST   | `/blogs`      |
| Get all blogs    | GET    | `/blogs`      |
| Get a blog by ID | GET    | `/blogs/<id>` |
| Update a blog    | PUT    | `/blogs/<id>` |
| Delete a blog    | DELETE | `/blogs/<id>` |

### **Programming constraints:**

You must use:

* `map()`
* `filter()`
* `lambda`
* `for` loops

Example:
`blogs_json = list(map(lambda b: b.to_dict(), blogs))`

---

## **B. OOP Requirements — Blog Class**

You must implement a `Blog` class demonstrating real OOP concepts:

### **Required attributes**

* id
* title
* content
* created_at
* updated_at

### **Required methods**

#### Instance Methods

* `save()` → Insert blog into DB
* `update()` → Update blog in DB
* `delete()` (optional instance)
* `translate_and_speak()` → Translate + generate audio

#### Static Methods

* `get_all()` → Fetch all blogs
* `get_by_id(id)` → Fetch a single blog

The `to_dict()` method must convert a Blog instance to JSON.

**must not write raw SQL inside the Flask routes**.
All database and blog logic **must be handled by the `Blog` OOP class**.

The Flask API (`api.py`) should only:

* Receive HTTP requests
* Validate data
* Create `Blog` objects
* Call class methods (`save`, `update`, `get_all`, etc.)
* Return JSON responses

This is to enforce **OOP separation of concerns**, following a clean “mini-MVC” pattern.

---

## **C. Translation Feature**

You must use the `translate` library.

### Requirements:

* Translate blog content using:
  `Translator(from_lang, to_lang)`
* Method must return translated text
* API must return original + translated content
* The translation must work with GET parameters:

Example endpoint:

```
GET /blogs/<id>/translate?source=fr&target=en
```

---

## **D. Text-to-Speech Feature (TTS)**

Using `gTTS`, you must:

* Convert the **translated text** into audio
* Save audio as: `blog_<id>_audio.mp3`
* Automatically play the audio depending on OS:

| OS      | Command           |
| ------- | ----------------- |
| macOS   | `afplay file.mp3` |
| Linux   | `mpg123 file.mp3` |
| Windows | `start file.mp3`  |

Errors should be handled gracefully.

---

# **6. API Translation Route**

You must implement:

### `GET /blogs/<id>/translate?source=xx&target=yy`

Returning JSON:

```json
{
  "id": 1,
  "original_title": "...",
  "original_content": "...",
  "translated_content": "..."
}
```

---

# **7. Technical Constraints**

### **Mandatory**

* psycopg for all SQL queries
* Flask for API
* Neon PostgreSQL
* OOP architecture
* JSON-only API responses
* Clean structure and readable code
* Precise error handling
* MVC-like structure:

  * Blog class = logic
  * API = routes
  * db.py = database connection

### **Forbidden**

* No authentication
* No ORM (no SQLAlchemy)
* No additional frameworks

---

# **8. Required Testing**

You must test:

* Blog creation
* Blog listing
* Blog retrieval
* Blog update
* Blog deletion
* Translation feature
* Audio file generation
* Audio playback on OS

---

# **9. Expected Deliverables**

The final deliverables must include:

### **Source Code**

* Fully working project as described
* All required Python files
* Working CRUD + Translation + TTS

### **Audio Folder**

* Contains generated audio files

---

# **10. Timeline**

Estimated development time: **1 day**

