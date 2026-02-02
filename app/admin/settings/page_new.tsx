'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings, Bell, Mail, Lock, Globe, Palette, Save } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            sms: false,
        },
        display: {
            theme: 'system',
            language: 'ru',
        },
        security: {
            twoFactor: false,
            sessionTimeout: 30,
        },
        system: {
            siteName: 'Онлайн обучение',
            maxStudents: 100,
            autoBackup: true,
        },
    })

    const handleSave = () => {
        // Save to store or API
        toast.success('Настройки сохранены')
    }

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Настройки"
                description="Управление настройками системы"
                icon={Settings}
            />

            <div className="container max-w-4xl py-8 space-y-6">
                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Уведомления
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Email уведомления</Label>
                                <p className="text-sm text-muted-foreground">
                                    Получать уведомления на email
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications.email}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, email: checked },
                                    })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Push уведомления</Label>
                                <p className="text-sm text-muted-foreground">
                                    Показывать push уведомления в браузере
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications.push}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, push: checked },
                                    })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>SMS уведомления</Label>
                                <p className="text-sm text-muted-foreground">Получать SMS уведомления</p>
                            </div>
                            <Switch
                                checked={settings.notifications.sms}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, sms: checked },
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Display */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Отображение
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Тема</Label>
                            <select
                                className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2"
                                value={settings.display.theme}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        display: { ...settings.display, theme: e.target.value },
                                    })
                                }
                            >
                                <option value="light">Светлая</option>
                                <option value="dark">Темная</option>
                                <option value="system">Системная</option>
                            </select>
                        </div>
                        <div>
                            <Label>Язык</Label>
                            <select
                                className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2"
                                value={settings.display.language}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        display: { ...settings.display, language: e.target.value },
                                    })
                                }
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="kk">Қазақша</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Безопасность
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Двухфакторная аутентификация</Label>
                                <p className="text-sm text-muted-foreground">
                                    Дополнительная защита аккаунта
                                </p>
                            </div>
                            <Switch
                                checked={settings.security.twoFactor}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        security: { ...settings.security, twoFactor: checked },
                                    })
                                }
                            />
                        </div>
                        <Separator />
                        <div>
                            <Label>Таймаут сессии (минуты)</Label>
                            <Input
                                type="number"
                                className="mt-2"
                                value={settings.security.sessionTimeout}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        security: {
                                            ...settings.security,
                                            sessionTimeout: parseInt(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Системные настройки
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Название сайта</Label>
                            <Input
                                className="mt-2"
                                value={settings.system.siteName}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        system: { ...settings.system, siteName: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Максимум студентов</Label>
                            <Input
                                type="number"
                                className="mt-2"
                                value={settings.system.maxStudents}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        system: {
                                            ...settings.system,
                                            maxStudents: parseInt(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Автоматическое резервное копирование</Label>
                                <p className="text-sm text-muted-foreground">
                                    Ежедневное резервное копирование данных
                                </p>
                            </div>
                            <Switch
                                checked={settings.system.autoBackup}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        system: { ...settings.system, autoBackup: checked },
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} size="lg">
                        <Save className="mr-2 h-5 w-5" />
                        Сохранить настройки
                    </Button>
                </div>
            </div>
        </div>
    )
}
