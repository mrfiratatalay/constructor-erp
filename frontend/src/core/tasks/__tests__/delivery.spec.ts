import { describe, expect, it } from 'vitest'
import type { MediaView, TaskDeliveryView, TaskView } from '@/core/api/generated/model'
import { deliverableTasks } from '@/core/tasks/deliverableTasks'
import { deliveryCard, markedPhoto } from '@/core/tasks/deliveryCard'
import { taskIcon, taskName } from '@/core/tasks/taskIcon'

const photo = (id: string) => ({ id, kind: 'PHOTO', status: 'READY' }) as MediaView

const delivery = (fields: Partial<TaskDeliveryView> = {}): TaskDeliveryView => ({
  id: 'd',
  taskId: 't',
  taskTitle: '3. Kat Elektrik',
  taskStatus: 'SUBMITTED',
  siteName: 'B Blok',
  status: 'PENDING',
  deliveredBy: { id: 'ali', fullName: 'Ali Usta' },
  deliveredAt: '2026-09-28T08:00:00',
  postId: 'teslim',
  photos: [photo('p1'), photo('p2')],
  canReview: false,
  canRedeliver: false,
  ...fields,
})

const task = (id: string, status: TaskView['status'], assigneeId: string | null) =>
  ({
    id,
    title: id,
    status,
    assignee: assigneeId ? { id: assigneeId, fullName: 'x' } : undefined,
  }) as TaskView

describe('görevin simgesi', () => {
  it('başlıktan okunur; tanınmayan iş 📋', () => {
    expect(taskIcon('Banyo tesisatı')).toBe('🚿')
    expect(taskIcon('3. KAT ELEKTRİK')).toBe('⚡')
    expect(taskIcon('Tuğla duvar')).toBe('🧱')
    expect(taskIcon('İç cephe boya')).toBe('🎨')
    expect(taskName('Kalıp söküm')).toBe('📋 Kalıp söküm')
  })
})

describe('teslim edilebilir işler', () => {
  it('yalnızca kişiye verilmiş, bitmemiş ve kontrolde olmayanlar; eksiği dönen en üstte', () => {
    const tasks = [
      task('sıradaki', 'TODO', 'ali'),
      task('başkasının', 'TODO', 'veli'),
      task('kontrolde', 'SUBMITTED', 'ali'),
      task('bitti', 'DONE', 'ali'),
      task('eksik', 'RETURNED', 'ali'),
      task('yapılıyor', 'IN_PROGRESS', 'ali'),
      task('sahipsiz', 'TODO', null),
    ]
    expect(deliverableTasks(tasks, 'ali').map((item) => item.id)).toEqual([
      'eksik',
      'yapılıyor',
      'sıradaki',
    ])
  })
})

describe('sohbetteki teslim kartı', () => {
  it('teslim mesajında: kim, kaç fotoğraf, durum; şefte İNCELE', () => {
    expect(deliveryCard(delivery({ canReview: true }), 'teslim')).toEqual({
      title: '✅ İş teslim edildi',
      task: '⚡ 3. Kat Elektrik',
      place: '📍 B Blok',
      lines: ['👤 Ali Usta', '📷 2 fotoğraf'],
      status: { label: 'Kontrol bekliyor', tone: 'warning' },
      action: 'review',
      showMark: false,
    })
  })

  it('şefin eksik cevabında: not ve çalışanda yeniden teslim', () => {
    const returned = delivery({
      status: 'RETURNED',
      missingNote: 'Kablo bağlantısı',
      canRedeliver: true,
      mark: { mediaId: 'p1', x: 0.5, y: 0.5 },
    })
    expect(deliveryCard(returned, 'cevap')).toMatchObject({
      title: '❌ İş tamamlanmadı',
      lines: ['Eksik: Kablo bağlantısı'],
      action: 'redeliver',
      showMark: true,
    })
  })

  it('şefin onay cevabında: tamamlandı ve onaylayan', () => {
    const approved = delivery({
      status: 'APPROVED',
      reviewedBy: { id: 's', fullName: 'Mehmet Şef' },
      reviewedAt: '2026-09-28T14:20:00',
    })
    expect(deliveryCard(approved, 'cevap')).toMatchObject({
      title: '✅ Tamamlandı',
      lines: ['Onaylayan: Mehmet Şef · 28 Eylül 14:20'],
      action: null,
    })
  })

  it('eksik gösterilen fotoğraf şefin noktayı koyduğu fotoğraftır', () => {
    expect(markedPhoto(delivery({ mark: { mediaId: 'p2', x: 0.4, y: 0.6 } }))?.id).toBe('p2')
    expect(markedPhoto(delivery())).toBeNull()
  })
})
