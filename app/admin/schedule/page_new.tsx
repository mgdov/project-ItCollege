'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react'
import { useStore, adminStore } from '@/lib/store'
import { PageHeader, LoadingState, EmptyState } from '@/components/shared'
import type { ScheduleItem } from '@/lib/store/types'

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export default function SchedulePage() {
    const schedule = useStore(adminStore, (s) => s.schedule)
    const subjects = useStore(adminStore, (s) => s.subjects)
    const groups = useStore(adminStore, (s) => s.groups)
    const isLoading = useStore(adminStore, (s) => s.isLoading)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
    const [formData, setFormData] = useState({
        day: 0,
        time: '',
        subject: '',
        group: '',
        teacher: '',
        room: '',
        type: 'lecture' as 'lecture' | 'practice' | 'lab',
    })

    useEffect(() => {
        adminStore.getState().fetchSchedule()
        adminStore.getState().fetchSubjects()
        adminStore.getState().fetchGroups()
    }, [])

    const handleAdd = () => {
        setEditingItem(null)
        setFormData({
            day: 0,
            time: '',
            subject: '',
            group: '',
            teacher: '',
            room: '',
            type: 'lecture',
        })
        setIsDialogOpen(true)
    }

    const handleEdit = (item: ScheduleItem) => {
        setEditingItem(item)
        setFormData({
            day: item.day,
            time: item.time,
            subject: item.subject,
            group: item.group || '',
            teacher: item.teacher || '',
            room: item.room || '',
            type: item.type,
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingItem) {
            adminStore.getState().updateScheduleItem({ ...editingItem, ...formData })
        } else {
            adminStore.getState().addScheduleItem(formData as ScheduleItem)
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm('Удалить занятие из расписания?')) {
            adminStore.getState().deleteScheduleItem(id)
        }
    }

    if (isLoading) {
        return <LoadingState message="Загрузка расписания..." />
    }

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Расписание"
                description="Управление расписанием занятий"
                icon={Calendar}
                action={
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-5 w-5" />
                        Добавить занятие
                    </Button>
                }
            />

            <div className="container max-w-7xl py-8 space-y-6">
                {schedule.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="Расписание пусто"
                        description="Добавьте первое занятие"
                    />
                ) : (
                    <div className="space-y-6">
                        {DAYS.map((day, dayIndex) => {
                            const daySchedule = schedule.filter((item) => item.day === dayIndex)
                            if (daySchedule.length === 0) return null

                            return (
                                <Card key={day}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            {day}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {daySchedule.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                                                >
                                                    <div className="flex-shrink-0 w-20 text-center">
                                                        <div className="text-sm font-semibold">{item.time}</div>
                                                        <Badge variant="outline" className="mt-1">
                                                            {item.type}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex-1 space-y-2">
                                                        <h4 className="font-semibold text-lg">{item.subject}</h4>
                                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                            {item.group && (
                                                                <div className="flex items-center gap-1">
                                                                    <Badge variant="secondary">{item.group}</Badge>
                                                                </div>
                                                            )}
                                                            {item.teacher && <div>{item.teacher}</div>}
                                                            {item.room && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    {item.room}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-500 hover:bg-red-500/10"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Редактировать' : 'Добавить'} занятие</DialogTitle>
                        <DialogDescription>Заполните информацию о занятии</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>День недели</Label>
                            <Select
                                value={formData.day.toString()}
                                onValueChange={(v) => setFormData({ ...formData, day: parseInt(v) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((day, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Время</Label>
                            <Input
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                placeholder="09:00-10:30"
                            />
                        </div>
                        <div>
                            <Label>Предмет</Label>
                            <Select
                                value={formData.subject}
                                onValueChange={(v) => setFormData({ ...formData, subject: v })}
                            >
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
                            <Label>Группа</Label>
                            <Select
                                value={formData.group}
                                onValueChange={(v) => setFormData({ ...formData, group: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите группу" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.name}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Преподаватель</Label>
                            <Input
                                value={formData.teacher}
                                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
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
                            <Label>Тип занятия</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lecture">Лекция</SelectItem>
                                    <SelectItem value="practice">Практика</SelectItem>
                                    <SelectItem value="lab">Лабораторная</SelectItem>
                                </SelectContent>
                            </Select>
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
