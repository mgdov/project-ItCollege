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
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react'
import { useStore, adminStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState, DataTable } from '@/components/shared'
import type { Subject } from '@/lib/store/types'

export default function SubjectsPage() {
    const subjects = useStore(adminStore, (s) => s.subjects)
    const isLoading = useStore(adminStore, (s) => s.isLoading)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        credits: 3,
        description: '',
    })

    useEffect(() => {
        adminStore.getState().fetchSubjects()
    }, [])

    const filteredSubjects = subjects.filter(
        (subject) =>
            subject.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.code?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingSubject(null)
        setFormData({ name: '', code: '', credits: 3, description: '' })
        setIsDialogOpen(true)
    }

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject)
        setFormData({
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            description: subject.description || '',
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingSubject) {
            adminStore.getState().updateSubject({ ...editingSubject, ...formData })
        } else {
            adminStore.getState().addSubject(formData as Subject)
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Удалить предмет?')) {
            adminStore.getState().deleteSubject(id)
        }
    }

    if (isLoading) {
        return <LoadingState message="Загрузка предметов..." />
    }

    const columns = [
        {
            key: 'name',
            label: 'Предмет',
            render: (subject: Subject) => (
                <div>
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-sm text-muted-foreground">{subject.code}</div>
                </div>
            ),
        },
        {
            key: 'credits',
            label: 'Кредиты',
            render: (subject: Subject) => <Badge variant="outline">{subject.credits} кредитов</Badge>,
        },
        {
            key: 'description',
            label: 'Описание',
            render: (subject: Subject) => (
                <div className="max-w-md text-sm text-muted-foreground line-clamp-2">
                    {subject.description || '—'}
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Действия',
            render: (subject: Subject) => (
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(subject)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(subject.id)}
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
                title="Предметы"
                description="Управление учебными предметами"
                icon={BookOpen}
                action={
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-5 w-5" />
                        Добавить предмет
                    </Button>
                }
            />

            <div className="container max-w-7xl py-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск предметов..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Badge variant="secondary" className="px-4 py-2">
                        Всего предметов: {subjects.length}
                    </Badge>
                </div>

                {filteredSubjects.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="Нет предметов"
                        description="Добавьте первый предмет"
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Список предметов</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={filteredSubjects} columns={columns} />
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingSubject ? 'Редактировать' : 'Добавить'} предмет</DialogTitle>
                        <DialogDescription>Заполните информацию о предмете</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Название предмета</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Математический анализ"
                            />
                        </div>
                        <div>
                            <Label>Код предмета</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="MATH-101"
                            />
                        </div>
                        <div>
                            <Label>Кредиты</Label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Label>Описание</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Краткое описание предмета"
                                rows={4}
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
