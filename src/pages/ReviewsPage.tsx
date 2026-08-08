import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRestaurant } from '../context/RestaurantContext'
import { formatDate } from '../lib/format'

export function ReviewsPage() {
  const { reviews, addReview } = useRestaurant()
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState(user?.name ?? '')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const sorted = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [reviews],
  )

  const average = useMemo(() => {
    if (!reviews.length) return 0
    return (
      Math.round(
        (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
      ) / 10
    )
  }, [reviews])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitted(false)

    const name = (user?.name || authorName).trim()
    if (!name) {
      setError('Please add your name.')
      return
    }
    if (!comment.trim()) {
      setError('Please write a short review.')
      return
    }

    addReview({
      authorName: name,
      rating,
      comment: comment.trim(),
    })
    setComment('')
    setRating(5)
    if (!user) setAuthorName('')
    setSubmitted(true)
  }

  return (
    <div className="page reviews-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Guest voices</p>
          <h1>Reviews</h1>
          <p className="lede">
            {average > 0
              ? `${average} average from ${reviews.length} reviews`
              : 'Be the first to leave a review.'}
          </p>
        </div>
      </div>

      <div className="reviews-layout">
        <section className="panel">
          <h2>What guests are saying</h2>
          <ul className="review-list">
            {sorted.map((review) => (
              <li key={review.id} className="review-card">
                <div className="review-card__head">
                  <strong>{review.authorName}</strong>
                  <Stars value={review.rating} />
                </div>
                <p>{review.comment}</p>
                <time className="muted" dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        </section>

        <form className="panel review-form" onSubmit={submit}>
          <h2>Leave a review</h2>
          <p className="muted">
            Share how your meal went — sample data only, saved in this browser.
          </p>

          {!user && (
            <label>
              Your name
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Name shown with your review"
                required
              />
            </label>
          )}

          {user && (
            <p className="review-form__as">
              Posting as <strong>{user.name}</strong>
            </p>
          )}

          <fieldset className="rating-field">
            <legend>Rating</legend>
            <div className="rating-picker" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`rating-picker__star ${n <= rating ? 'is-on' : ''}`}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  aria-pressed={n <= rating}
                  onClick={() => setRating(n)}
                >
                  <Star size={22} fill={n <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Your review
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What stood out — the food, service, atmosphere?"
              rows={4}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {submitted && (
            <p className="form-success">Thanks — your review was added.</p>
          )}

          <button type="submit" className="btn btn--block">
            Submit review
          </button>
        </form>
      </div>
    </div>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          fill={n <= value ? 'currentColor' : 'none'}
          className={n <= value ? 'stars__on' : undefined}
        />
      ))}
    </span>
  )
}
