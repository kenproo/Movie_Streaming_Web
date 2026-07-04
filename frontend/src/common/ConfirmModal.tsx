import { Button } from './Button'
import { Modal } from './Modal'

type ConfirmModalProps = {
  open: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({ open, title, description, onCancel, onConfirm }: ConfirmModalProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p>{description}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Xác nhận
        </Button>
      </div>
    </Modal>
  )
}
