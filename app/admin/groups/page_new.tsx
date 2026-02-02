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
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore, adminStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState, DataTable } from '@/components/shared'
import type { Group } from '@/lib/store/types'

export default function GroupsPage() {
    const groups = useStore(adminStore, (s) => s.groups)
    const isLoading = useStore(adminStore, (s) => s.isLoading)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        course: 1,
        studentCount: 0,
    })

    useEffect(() => {
        adminStore.getState().fetchGroups()
    }, [])

    const filteredGroups = groups.filter((group) =>
        group.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setEditingGroup(null)
        setFormData({ name: '', course: 1, studentCount: 0 })
        setIsDialogOpen(true)
    }

    const handleEdit = (group: Group) => {
        setEditingGroup(group)
        setFormData({
            name: group.name,
            course: group.course,
            studentCount: group.studentCount,
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingGroup) {
            adminStore.getState().updateGroup({ ...editingGroup, ...formData })
        } else {
            adminStore.getState().addGroup(formData as Group)
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Удалить группу?')) {
            adminStore.getState().deleteGroup(id)
        }
    }

    if (isLoading) {
        return <LoadingState message="Загрузка групп..." />
    }

    const columns = [
        {
            key: 'name',
            label: 'Название',
            render: (group: Group) => (
                <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {group.id}</div>
                </div>
            ),
        },
        {
            key: 'course',
            label: 'Курс',
            render: (group: Group) => <Badge variant="outline">{group.course} курс</Badge>,
        },
        {
            key: 'studentCount',
            label: 'Студентов',
            render: (group: Group) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group.studentCount}</span>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Действия',
            render: (group: Group) => (
                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(group)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(group.id)}
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
                title="Группы"
                description="Управление учебными группами"
                icon={Users}
                action={
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-5 w-5" />
                        Добавить группу
                    </Button>
                }
            />

            <div className="container max-w-7xl py-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск групп..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Badge variant="secondary" className="px-4 py-2">
                        Всего групп: {groups.length}
                    </Badge>
                </div>

                {filteredGroups.length === 0 ? (
                    <EmptyState icon={Users} title="Нет групп" description="Добавьте первую группу" />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Список групп</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={filteredGroups} columns={columns} />
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGroup ? 'Редактировать' : 'Добавить'} группу</DialogTitle>
                        <DialogDescription>Заполните информацию о группе</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Название группы</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ИСТ-301"
                            />
                        </div>
                        <div>
                            <Label>Курс</Label>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: parseInt(e.target.value) })}
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
