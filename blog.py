import os
from datetime import datetime
from translate import Translator
import pathlib
import platform
import subprocess
from gtts import gTTS
from langdetect import detect


# Configuration du dossier audio
AUDIO_DIR = os.getenv("AUDIO_DIR", "./audio")
# Crée le dossier s'il n'existe pas
pathlib.Path(AUDIO_DIR).mkdir(parents=True, exist_ok=True)

class Blog:
    def __init__(self,title,content, id=None, created_at=None, updated_at=None):
        self.id = id
        self.title = title
        self.content = content
        self.created_at = created_at
        self.updated_at = updated_at

    def save(self,conn):
        #try
        with conn.cursor() as cur:
            cur.execute( #curseur pour exécuter des requêtes SQL sur la connexion conn
                """
                INSERT INTO blogs (title, content)
                VALUES (%s,%s)
                RETURNING id, created_at,updated_at
                """,
                (self.title,self.content) 
            )
            row = cur.fetchone() #recupere id
            self.id, self.created_at, self.updated_at = row
            conn.commit() #valider les changements
            cur.close()
            conn.close()
        #except
    
    def update(self, conn):
        if not self.id:
            raise ValueError("Cannot update Blog without id")

        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE blogs
                SET title = %s, content = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING updated_at
                """,
                (self.title, self.content, self.id)  # tuple à 3 éléments
            )
            row = cur.fetchone()
            if row:
                self.updated_at = row[0]
            conn.commit()

    def delete(self, conn):
        if not self.id:
            raise ValueError("Cannot delete Blog without id")

        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM blogs WHERE id = %s",
                (self.id,)
            )
            conn.commit()

    def translate_content(self, source="None",target="en"):

        try:
            translator = Translator(from_lang= source, to_lang= target)
            translator_content = translator.translate(self.content)
        except Exception as e:
            raise RuntimeError(f'Translation failed: {e}')
        
        return translator_content
    
    def tts_content(self, source, target):
        try:

            if source is None:
                detected_lang = detect(self.content)
            else:
                detected_lang = source

            # 1. Traduction du contenu
            translated_content = self.translate_content(detected_lang, target)
            
            # 2. Génération du fichier audio
            if self.id:
                filename = f"blog_{self.id}_audio.mp3"
            else:
                # Fallback si pas d'ID (blog non sauvegardé)
                import time
                filename = f"blog_temp_{int(time.time())}.mp3"
            
            filepath = os.path.join(AUDIO_DIR, filename)
            
            # Création de l'audio avec gTTS
            tts = gTTS(text=translated_content, lang=target, slow=False)
            tts.save(filepath)
            
            # 3. Lecture automatique (optionnel)
            try:
                self._play_audio(filepath)
            except Exception as e:
                print(f"⚠️ Lecture audio échouée: {e}")
                # On continue même si la lecture échoue
            
            return translated_content, filepath, detected_lang
            
        except Exception as e:
            raise RuntimeError(f"Translation & TTS failed: {e}")

    def _play_audio(self, filepath):
        """Lecture audio selon l'OS"""
        system = platform.system().lower()
        
        if system == "darwin":  # macOS
            subprocess.Popen(["afplay", filepath])
        elif system == "linux":
            subprocess.Popen(["mpg123", filepath])
        elif system == "windows":
            os.startfile(filepath)
        else:
            print(f"❌ OS non supporté pour lecture auto: {system}")
            
    @staticmethod
    def get_all(conn):
        with conn.cursor() as cur:
            cur.execute(
                'SELECT * FROM blogs ORDER BY created_at DESC'
            )
            rows = cur.fetchall() #list de tuples

            blogs = list(map(lambda row: Blog(
                id=row[0],
                title=row[1],
                content=row[2],
                created_at=row[3],
                updated_at=row[4]
            ), rows))

            # Exemple d'utilisation de filter() : on garde uniquement les blogs non vides (démo pédagogique)
            blogs = list(filter(lambda b: bool(b.title and b.content), blogs))

        return blogs

    @staticmethod
    def get_by_id(conn,blog_id):
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, title, content, created_at, updated_at FROM blogs WHERE id = %s",
                    (blog_id,)
                )
                row = cur.fetchone() #recupere la 1 ere ligne du resultat & row = (id, title, content, created_at, updated_at)
        except Exception as e:
            raise ValueError ('Id not found')

        if row is None:
            return None
            
        return Blog(
            id= row[0],
            title=row[1],
            content=row[2],
            created_at=row[3],
            updated_at= row[4],
        )