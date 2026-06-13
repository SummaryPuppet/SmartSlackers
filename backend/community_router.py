from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from firestore_service import get_db

router = APIRouter(prefix="/api/community", tags=["community"])

POSTS_COL = "Posts"
COMMENTS_COL = "Comentarios"

CAREER_VALUES = {
    "general", "software", "medicina", "derecho",
    "arquitectura", "ingenieria-civil", "psicologia",
    "marketing", "gastronomia",
}


def _serialize(doc_id: str, data: dict) -> dict:
    result = {"id": doc_id}
    for k, v in data.items():
        if hasattr(v, "isoformat"):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


# ── Models ─────────────────────────────────────────────────────────

class PostBody(BaseModel):
    userId: str
    userName: str
    text: str
    imageUrl: Optional[str] = None
    career: str = "general"


class LikeBody(BaseModel):
    userId: str


class CommentBody(BaseModel):
    userId: str
    userName: str
    text: str


# ── Posts ──────────────────────────────────────────────────────────

@router.get("/posts")
def get_posts(career: str = "general"):
    db = get_db()
    col = db.collection(POSTS_COL)

    try:
        if career == "general":
            query = col.order_by("createdAt", direction="DESCENDING").limit(60)
        else:
            query = (
                col.where("career", "==", career)
                   .order_by("createdAt", direction="DESCENDING")
                   .limit(60)
            )
        docs = list(query.stream())
    except Exception:
        # Composite index not yet created — fall back, sort in Python
        if career == "general":
            docs = list(col.limit(60).stream())
        else:
            docs = list(col.where("career", "==", career).limit(60).stream())
        docs.sort(
            key=lambda d: d.to_dict().get("createdAt", datetime.min),
            reverse=True,
        )

    posts = []
    for doc in docs:
        data = doc.to_dict()
        comment_docs = list(doc.reference.collection(COMMENTS_COL).limit(200).stream())
        data["commentCount"] = len(comment_docs)
        posts.append(_serialize(doc.id, data))

    return {"posts": posts}


@router.post("/posts")
def create_post(body: PostBody):
    if not body.text.strip() and not body.imageUrl:
        raise HTTPException(status_code=400, detail="Post must have text or an image")

    if body.career not in CAREER_VALUES:
        raise HTTPException(status_code=400, detail=f"Invalid career: {body.career}")

    db = get_db()
    now = datetime.now(timezone.utc)
    data = {
        "userId": body.userId,
        "userName": body.userName,
        "text": body.text.strip(),
        "imageUrl": body.imageUrl,
        "career": body.career,
        "createdAt": now,
        "likeCount": 0,
        "likedBy": [],
        "commentCount": 0,
    }
    _, ref = db.collection(POSTS_COL).add(data)

    return _serialize(ref.id, {
        **data,
        "id": ref.id,
    })


@router.post("/posts/{post_id}/like")
def toggle_like(post_id: str, body: LikeBody):
    db = get_db()
    ref = db.collection(POSTS_COL).document(post_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Post not found")

    liked_by: list = doc.to_dict().get("likedBy", [])

    if body.userId in liked_by:
        liked_by.remove(body.userId)
        liked = False
    else:
        liked_by.append(body.userId)
        liked = True

    ref.update({"likedBy": liked_by, "likeCount": len(liked_by)})
    return {"likeCount": len(liked_by), "liked": liked}


# ── Comments ───────────────────────────────────────────────────────

@router.get("/posts/{post_id}/comments")
def get_comments(post_id: str):
    db = get_db()
    post_ref = db.collection(POSTS_COL).document(post_id)
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post not found")

    try:
        docs = list(
            post_ref.collection(COMMENTS_COL)
                    .order_by("createdAt", direction="ASCENDING")
                    .stream()
        )
    except Exception:
        docs = list(post_ref.collection(COMMENTS_COL).stream())
        docs.sort(key=lambda d: d.to_dict().get("createdAt", datetime.min))

    return {"comments": [_serialize(d.id, d.to_dict()) for d in docs]}


@router.post("/posts/{post_id}/comments")
def add_comment(post_id: str, body: CommentBody):
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    db = get_db()
    post_ref = db.collection(POSTS_COL).document(post_id)
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post not found")

    now = datetime.now(timezone.utc)
    data = {
        "userId": body.userId,
        "userName": body.userName,
        "text": body.text.strip(),
        "createdAt": now,
    }
    _, ref = post_ref.collection(COMMENTS_COL).add(data)

    # Increment commentCount on the post
    post_ref.update({"commentCount": post_ref.get().to_dict().get("commentCount", 0) + 1})

    return _serialize(ref.id, data)
