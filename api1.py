#here we open and close the connection (connection life cycle)
from flask import Flask, request, jsonify, abort, send_from_directory
from db import get_connection
from blog import Blog
import os


app = Flask(__name__)

@app.route("/blogs",methods=["POST"])
def create_blog():
    data = request.get_json() #recupere json envoye par client
    #blog obj
    blog = Blog(title = data.get("title"), content= data.get("content"))

    #ouvrire une cnx
    with get_connection() as conn:
        blog.save(conn)

    # Retourner une réponse JSON simple
    return jsonify({
        "message": "Blog créé avec succès !",
        "id": blog.id,
        "title": blog.title,
        "content": blog.content
    }), 201

@app.route("/blogs/<int:blog_id>", methods=["GET"])
def get_blog(blog_id):
    try:
        with get_connection() as conn:
            blog = Blog.get_by_id(conn,blog_id)
    except Exception as e:
        abort(500,description = f'DB error: {e}')

    if not blog:
        abort(404, description="Blog not found")

    # Retour JSON simple
    return jsonify({
        "id": blog.id,
        "title": blog.title,
        "content": blog.content,
        "created_at": blog.created_at.isoformat() if blog.created_at else None,
        "updated_at": blog.updated_at.isoformat() if blog.updated_at else None
    }), 200

@app.route("/blogs", methods=['GET'])
def Get_all_blogs():
    try:
        with get_connection() as conn:
            blogs = Blog.get_all(conn)
    except Exception as e:
        abort(500,description=f'DB error : {e}')

    blogs_json = list(map(lambda b: {
                          'id': b.id,
                          'title': b.title,
                          'content': b.content,
                          'created_at': b.created_at.isoformat() if b.created_at else None,
                          'updated_at': b.updated_at.isoformat() if b.updated_at else None
                          }, blogs))
    
    return jsonify(blogs_json), 200

@app.route("/blogs/<int:blog_id>",methods=["PUT"])
def update_blog(blog_id):
    data = request.get_json()
    if not data:
        abort(400,description="Missing Json payload")

    title = data.get("title","").strip()
    content = data.get("content","").strip()

    if not title or not content:
        abort(400,description = "Both 'title' and 'content' are required")

    try:
        with get_connection() as conn:
            blog = Blog.get_by_id(conn,blog_id)
            if not blog:
                abort(404,description = "Blog not found")
            #mettre a jour l'instance
            blog.title= title
            blog.content= content
            blog.update(conn)

    except Exception as e :
        abort(500,description=f'DB error: {e}')

    return jsonify({
        "message": "Blog updated",
        "id": blog.id,
        "title": blog.title,
        "content": blog.content,
        "updated_at": blog.updated_at.isoformat() if blog.updated_at else None
    }), 200

@app.route("/blogs/<int:blog_id>", methods=["DELETE"])
def delete_blog(blog_id):
    try:
        with get_connection() as conn:
            blog = Blog.get_by_id(conn, blog_id)
            if not blog:
                abort(404, description="Blog not found")
            blog.delete(conn)
    except Exception as e:
        abort(500, description=f"DB error: {e}")

    return jsonify({"message": "Blog deleted", "id": blog_id}), 200

# @app.route("/blogs/<int:blog_id>/translate", methods=["GET"])
# def translate_blog(blog_id):
#     # Récupère les paramètres de query string
#     source = request.args.get("source", "fr")  # Par défaut: auto-détection
#     target = request.args.get("target", "en")    # Par défaut: anglais
    
#     try:
#         # Récupère le blog depuis la DB
#         with get_connection() as conn:
#             blog = Blog.get_by_id(conn, blog_id)
            
#         if blog is None:
#             return jsonify({"error": "Blog not found"}), 404
        
#         # Appelle la traduction SEULEMENT du contenu
#         translated_content = blog.translate_content(source=source, target=target)
        
#         # Retourne la réponse JSON
#         return jsonify({
#             "id": blog.id,
#             "original_title": blog.title,           # Titre original
#             "original_content": blog.content,        # Contenu original  
#             "translated_content": translated_content, # Contenu traduit seulement
#             "translation_info": f"Translated from {source} to {target}"
#         }), 200
        
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route("/blogs/<int:blog_id>/translate", methods=["GET"])
def translate_blog(blog_id):
    source = request.args.get("source")
    target = request.args.get("target", "en")
    
    try:
        with get_connection() as conn:
            blog = Blog.get_by_id(conn, blog_id)
            
        if blog is None:
            return jsonify({"error": "Blog not found"}), 404
        
        # CHANGEMENT ICI: Appel de translate_and_speak au lieu de translate_content
        translated_content, audio_file_path,detected_lang = blog.tts_content(
            source=source, 
            target=target
        )
        
        # Retourne la réponse JSON avec les infos audio
        return jsonify({
            "id": blog.id,
            "original_title": blog.title,
            "original_content": blog.content,
            "translated_content": translated_content,
            "audio_file": audio_file_path,  # Nouveau: chemin du fichier audio
            "audio_url": f"/audio/{os.path.basename(audio_file_path)}",  # URL pour téléchargement
            "translation_info": f"Translated from {detected_lang} to {target}"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/audio/<filename>", methods=["GET"])
def serve_audio(filename):
    """Sert les fichiers audio générés"""
    audio_dir = os.getenv("AUDIO_DIR", "./audio")
    return send_from_directory(audio_dir, filename)

# @app.route("/llm/generate", methods=['GET'])




if __name__ == "__main__":
    app.run(debug=True)
