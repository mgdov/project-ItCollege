'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Pencil, Trash2, FileText, Calendar, Clock } from 'lucide-react'
import { useStore, adminStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState, DataTable } from '@/components/shared'
import type { Exam } from '@/lib/store/types'

export default function ExamsPage() {
    const exams = useStore(adminStore, (s) => s.exams)
    const subjects = useStore(adminStore, (s) => s.subjects)
    const isLoading = useStore(adminStore, (s) => s.isLoading)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingExam, setEditingExam] = useState<Exam | null>(null)
    const [formData, setFormData] = useState({
        subject: '',
        date: '',
        time: '',
        room: '',
        duration: 90,
    })

    useEffect(() => {
        adminStore.getState().fetchExams()
        adminStore.getState().fetchSubjects()
    }, [])

    const filteredExams = exams.filter(
        (exam) =>
            exam.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.room?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingExam(null)
        setFormData({ subject: '', date: '', time: '', room: '', duration: 90 })
        setIsDialogOpen(true)
    }

    const handleEdit = (exam: Exam) => {
        setEditingExam(exam)
        setFormData({
            subject: exam.subject,
            date: exam.date,
            time: exam.time,
            room: exam.room || '',
            duration: exam.duration || 90,
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingExam) {
            adminStore.getState().updateExam({ ...editingExam, ...formData })
        } else {
            adminStore.getState().addExam(formData as Exam)
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Удалить экзамен?')) {
            adminStore.getState().deleteExam(id)
        }
    }

    if (isLoading) {
        return <LoadingState message="Загрузка экзаменов..." />
    }

    const columns = [
        {
            key: 'subject',
            label: 'Предмет',
            render: (exam: Exam) => <div className="font-medium">{exam.subject}</div>,
        },
        {
            key: 'date',
            label: 'Дата',
            render: (exam: Exam) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(exam.date).toLocaleDateString('ru-RU')}
                </div>
            ),
        },
        {
            key: 'time',
            label: 'Время',
            render: (exam: Exam) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {exam.time}
                </div>
            ),
        },
        {
            key: 'room',
            label: 'Аудитория',
            render: (exam: Exam) => <Badge variant="outline">{exam.room || '—'}</Badge>,
        },
        {
            key: 'duration',
            label: 'Длительность',
            render: (exam: Exam) => <span>{exam.duration || 90} мин</span>,
        },
        {
            key: 'actions',
            label: 'Действия',
            render: (exam: Exam) => (
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(exam)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(exam.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Экзамены"
                description="Управление экзаменационным расписанием"
                icon={FileText}
                action={
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-5 w-5" />
                        Добавить экзамен
                    </Button>
                }
            />

            <div className="container max-w-7xl py-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск экзаменов..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Badge variant="secondary" className="px-4 py-2">
                        Всего экзаменов: {exams.length}
                    </Badge>
                </div>

                {filteredExams.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Нет экзаменов"
                        description="Добавьте первый экзамен"
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Расписание экзаменов</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={filteredExams} columns={columns} />
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingExam ? 'Редактировать' : 'Добавить'} экзамен</DialogTitle>
                        <DialogDescription>Заполните информацию об экзамене</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Предмет</Label>
                            <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите предмет" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.name}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Дата</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Время</Label>
                            <Input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Аудитория</Label>
                            <Input
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                placeholder="Ауд. 101"
                            />
                        </div>
                        <div>
                            <Label>Длительность (минуты)</Label>
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSave}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
