import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

_db = None


def get_db():
    global _db
    if _db is not None:
        return _db

    # Try service account key file
    service_account_path = os.path.join(
        os.path.dirname(__file__), "serviceAccountKey.json"
    )

    if os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    elif os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        firebase_admin.initialize_app()
    else:
        raise RuntimeError(
            "No Firebase credentials found. "
            "Place serviceAccountKey.json in the backend/ directory "
            "or set the GOOGLE_APPLICATION_CREDENTIALS environment variable."
        )

    _db = firestore.client()
    return _db


COLLECTION = "Carreras"


def get_all_careers():
    db = get_db()
    docs = db.collection(COLLECTION).stream()
    careers = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        careers.append(data)
    return careers


def get_career(career_id: str):
    db = get_db()
    doc = db.collection(COLLECTION).document(career_id).get()
    if not doc.exists:
        return None
    data = doc.to_dict()
    data["id"] = doc.id
    return data


def set_career(career_id: str, data: dict):
    db = get_db()
    db.collection(COLLECTION).document(career_id).set(data, merge=True)


def set_careers_batch(careers: dict):
    db = get_db()
    batch = db.batch()
    for career_id, data in careers.items():
        ref = db.collection(COLLECTION).document(career_id)
        batch.set(ref, data, merge=True)
    batch.commit()


def delete_career(career_id: str):
    db = get_db()
    db.collection(COLLECTION).document(career_id).delete()
