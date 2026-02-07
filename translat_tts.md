##  Séparation des concerns
* db.py : fournit la connexion.

* api.py : gère le cycle de vie de la connexion (ouverture/fermeture) et les routes.

* blog.py : contient la logique métier et les opérations sur la base de données en utilisant la connexion fournie.

## But des variables d’environnement (pourquoi)

Les variables d’environnement (env vars) permettent de séparer la configuration sensible (identifiants, urls, chemins) du code.
Avantages :

* Pas de secrets dans le dépôt git.

* Facile à changer par environnement (dev/staging/prod).

* Permet aux plateformes cloud (Render, Railway, Vercel, Heroku, Neon) d’injecter des secrets.

__Pour ton projet, les variables essentielles sont :__

* DATABASE_URL → l’URL Postgres fournie par Neon (utilisée par psycopg).

* PSYCOPG_SSLMODE → option SSL si Neon l’exige (require).

* AUDIO_DIR → chemin où stocker les mp3 générés.

* PORT → port pour Flask (5000 par défaut).

* Éventuellement : FLASK_ENV, SENTRY_DSN, LOG_LEVEL, etc.

### The dotenv concept 
is about managing environment variables in a clean, secure way — especially for things like:

* Database URLs (like your Neon connection string)

* API keys

* Secret tokens

* Configuration values (e.g. DEBUG=True, PORT=5000)

### conseils pratiques

* Toujours passer les paramètres SQL comme tuple/list, même pour un seul paramètre : (x,) ou [x].

* Garde la cohérence des noms : updated_at partout (DB / code).

* Si tu veux renvoyer du JSON depuis api.py, convertis les datetimes avec isoformat() (ou utilise str()), sinon Flask lèvera une erreur JSON serialization.

### langdetect
La bibliothèque langdetect est un outil Python qui permet de détecter automatiquement la langue d’un texte. Elle est basée sur les algorithmes de Google Language Detection (comme dans Chrome).