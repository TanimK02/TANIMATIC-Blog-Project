import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePost, getComments, createComment, deleteComment } from '../api.js'
import { useAuth } from '../components/AuthProvider.jsx'

export default function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [commentPage, setCommentPage] = useState(1)
    const [content, setContent] = useState('')
    const { isAuthenticated, user } = useAuth()

    useEffect(() => {
        getSinglePost(id).then(res => setPost(res.data.post)).catch(console.error)
    }, [id])

    useEffect(() => {
        getComments(id, commentPage).then(res => {
            console.log('Comments data:', res.data.comments);
            setComments(res.data.comments || []);
        }).catch(console.error)
    }, [id, commentPage])

    async function onAddComment(e) {
        e.preventDefault()
        if (!content.trim()) return
        await createComment(id, content)
        setContent('')
        const res = await getComments(id, commentPage)
        setComments(res.data.comments || [])
    }

    async function onDeleteComment(cid) {
        await deleteComment(cid)
        const res = await getComments(id, commentPage)
        setComments(res.data.comments || [])
    }

    if (!post) return <div>Loading post…</div>

    return (
        <div className="stack">
            <h2>{post.title}</h2>
            {post.publicationDate && (
                <div className="meta">Published {new Date(post.publicationDate).toLocaleDateString()}</div>
            )}
            {post.bannerImg && <img src={post.bannerImg} alt='banner' style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags?.length ? (
                <div className="badges">
                    {post.tags.map(t => <span key={t.id} className="badge">{t.name}</span>)}
                </div>
            ) : null}

            <hr style={{ margin: '20px 0' }} />
            <h3>Comments</h3>
            {isAuthenticated ? (
                <form onSubmit={onAddComment} className="stack comment-form">
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder='Write a comment...' />
                    <button className="btn primary" type='submit'>Add Comment</button>
                </form>
            ) : (
                <div>Login to add a comment.</div>
            )}

            <ul className="comments-list">
                {comments.map(c => {
                    console.log('Comment check:', { commentAuthorId: c.authorId, userId: user?.id, isAuth: isAuthenticated, hasUser: !!user });
                    return (
                        <li key={c.id} className="comment-item">
                            <div className="comment-content">{c.content}</div>
                            <div className="meta">By {c.author?.username ?? 'Unknown'} • {new Date(c.createdAt).toLocaleString()}</div>
                            {isAuthenticated && user && c.authorId === user.id && (
                                <div className="comment-actions">
                                    <button className="btn" onClick={() => {
                                        if (confirm('Delete this comment?')) onDeleteComment(c.id)
                                    }}>Delete</button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            <div className="row">
                <button className="btn" onClick={() => setCommentPage(p => Math.max(1, p - 1))} disabled={commentPage === 1}>Prev</button>
                <span>Page {commentPage}</span>
                <button className="btn" onClick={() => setCommentPage(p => p + 1)}>Next</button>
            </div>
        </div>
    )
}
