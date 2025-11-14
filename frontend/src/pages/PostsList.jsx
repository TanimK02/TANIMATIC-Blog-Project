import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedPosts } from '../api.js'

export default function PostsList() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getPublishedPosts(page)
            .then(res => setPosts(res.data.posts || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [page])

    const hasMorePosts = posts.length === 10

    return (
        <div>
            <h2 className="section-title">Published Posts</h2>
            {loading ? (
                <div>Loading posts…</div>
            ) : (
                <div className="posts-grid">
                    {posts.map(p => (
                        <Link key={p.id} to={`/post/${p.id}`} className="post-card">
                            <img className="post-card-img" src={p.bannerImg || 'https://placehold.co/280x160?text=No+Image'} alt="thumb" />
                            <div className="post-card-content">
                                <h3 className="post-card-title">{p.title}</h3>
                                {p.publicationDate && (
                                    <div className="meta">Published {new Date(p.publicationDate).toLocaleDateString()}</div>
                                )}
                                {p.tags?.length ? (
                                    <div className="badges">
                                        {p.tags.map(t => <span key={t.id} className="badge">{t.name}</span>)}
                                    </div>
                                ) : null}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                <span>Page {page}</span>
                <button className="btn" onClick={() => setPage(p => p + 1)} disabled={!hasMorePosts}>Next</button>
            </div>
        </div>
    )
}
