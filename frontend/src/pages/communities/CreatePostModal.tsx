import { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import Input, { Textarea } from '@/components/common/Input'
import Modal from '@/components/common/Modal'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string, imageUrl?: string | null) => Promise<void> | void
  isSubmitting?: boolean
}

const MAX_LENGTH = 600

/** Modal composer for creating a community post with an optional image link. */
export default function CreatePostModal({ isOpen, onClose, onSubmit, isSubmitting = false }: CreatePostModalProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setContent('')
      setImageUrl('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Write something before posting.')
      return
    }
    setError('')
    await onSubmit(content.trim(), imageUrl.trim() || null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a post"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} isLoading={isSubmitting} disabled={!content.trim()}>
            Post
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Textarea
            label="What do you want to share?"
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, MAX_LENGTH))}
            rows={5}
            maxLength={MAX_LENGTH}
            error={error}
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {content.length}/{MAX_LENGTH}
          </p>
        </div>
        <Input
          label="Image URL"
          hint="Optional — paste a link to an image."
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://…"
        />
      </div>
    </Modal>
  )
}
