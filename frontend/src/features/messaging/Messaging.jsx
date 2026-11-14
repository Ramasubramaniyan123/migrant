import { ConversationList, Conversation } from '../messaging/Conversation'

export const Messaging = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <ConversationList />
          <Conversation />
        </div>
      </div>
    </section>
  )
}