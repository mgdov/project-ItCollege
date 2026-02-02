'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Pencil, Trash2, Mail, Phone, UserPlus, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, adminStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState, DataTable } from '@/components/shared'
import type { Student } from '@/lib/store/types'

export default function StudentsPage() {
    const students = useStore(adminStore, (s) => s.students)
    const isLoading = useStore(adminStore, (s) => s.isLoading)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        group: '',
        status: 'active' as 'active' | 'inactive',
    })

    useEffect(() => {
        adminStore.getState().fetchStudents()
    }, [])

    const filteredStudents = students.filter(
        (student) =>
            student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.group?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingStudent(null)
        setFormData({ name: '', email: '', phone: '', group: '', status: 'active' })
        setIsDialogOpen(true)
    }

    const handleEdit = (student: Student) => {
        setEditingStudent(student)
        setFormData({
            name: student.name,
            email: student.email,
            phone: student.phone || '',
            group: student.group,
            status: student.status,
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingStudent) {
            adminStore.getState().updateStudent({ ...editingStudent, ...formData })
        } else {
            adminStore.getState().addStudent(formData as Student)
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Удалить студента?')) {
            adminStore.getState().deleteStudent(id)
        }
    }

    if (isLoading) {
        return <LoadingState message="Загрузка студентов..." />
    }

    const activeCount = students.filter((s) => s.status === 'active').length

    const columns = [
        {
            key: 'name',
            label: 'Студент',
            render: (student: Student) => (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'contacts',
            label: 'Контакты',
            render: (student: Student) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {student.email}
                    </div>
                    {student.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {student.phone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'group',
            label: 'Группа',
            render: (student: Student) => <Badge variant="outline">{student.group}</Badge>,
        },
        {
            key: 'status',
            label: 'Статус',
            render: (student: Student) => (
                <Badge className={student.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                    {student.status === 'active' ? 'Активен' : 'Неактивен'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Действия',
            render: (student: Student) => (
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(student)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(student.id)}
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
                title="Студенты"
                description="Управление списком студентов"
                icon={UserPlus}
                action={
                    <div className="flex gap-3">
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-5 w-5" />
                            Добавить студента
                        </Button>
                        <Button variant="outline">
                            <Download className="mr-2 h-5 w-5" />
                            Экспорт
                        </Button>
                    </div>
                }
            />

            <div className="container max-w-7xl py-8 space-y-6">
                {/* Search and Stats */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск студентов..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="px-4 py-2">
                            Всего: {students.length}
                        </Badge>
                        <Badge className="bg-green-500 px-4 py-2">Активных: {activeCount}</Badge>
                    </div>
                </div>

                {/* Students Table */}
                {filteredStudents.length === 0 ? (
                    <EmptyState
                        icon={UserPlus}
                        title="Нет студентов"
                        description="Добавьте первого студента"
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Список студентов</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={filteredStudents} columns={columns} />
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingStudent ? 'Редактировать' : 'Добавить'} студента</DialogTitle>
                        <DialogDescription>Заполните информацию о студенте</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Имя</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Телефон</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Группа</Label>
                            <Input
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
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
