import { PostCard } from '../posts/PostCard'

export const Feed = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Feed</h2>
          <p className="font-body text-token-text-secondary">
            Latest from the communities you follow.
          </p>
        </header>

        <div className="space-y-6">
          <PostCard
            id={1}
            author="Maria G."
            authorImage="/assets/users/maria.jpg"
            community="Bangalore Tech Circle"
            content="Just joined the community! Looking forward to connecting with fellow tech professionals in Bangalore. 👋"
            image="/assets/posts/post1.jpg"
            timestamp="2h ago"
            likes={12}
            comments={3}
          />
          <PostCard
            id={2}
            author="Arjun S."
            authorImage="/assets/users/arjun.jpg"
            community="Mumbai Foodies"
            content="Exploring the best street food in Mumbai this weekend. Any recommendations? 🍛"
            image="/assets/posts/post2.jpg"
            timestamp="5h ago"
            likes={28}
            comments={7}
          />
          <PostCard
            id={3}
            author="Wei L."
            authorImage="/assets/users/wei.jpg"
            community="Chennai Culture Club"
            content="Celebrating Thai Pongal with our Chennai community! #ThaiPongal #Chennai"
            image="/assets/posts/post3.jpg"
            timestamp="1d ago"
            likes={45}
            comments={12}
          />
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <a href="#" className="text-token-accent font-medium hover:underline">
            Create a Post
          </a>
        </div>
      </div>
    </section>
  )
}