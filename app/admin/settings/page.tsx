"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Mail, Globe, Save } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function SettingsPage() {
    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 text-white">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
                        alt="Admin Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative px-4 py-12 md:px-8 md:py-16"
                >
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="text-sm font-medium">Настройки системы</span>
                        </motion.div>
                        <div>
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Настройки</h1>
                            <p className="text-lg opacity-90">Конфигурация образовательной платформы</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="px-4 py-8 md:px-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Общие настройки
                                </CardTitle>
                                <CardDescription>Основные параметры платформы</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="platform-name">Название платформы</Label>
                                    <Input id="platform-name" defaultValue="Образовательная платформа" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution">Учебное заведение</Label>
                                    <Input id="institution" defaultValue="Университет информационных технологий" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Email администратора</Label>
                                    <Input id="admin-email" type="email" defaultValue="admin@university.edu" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Уведомления
                                </CardTitle>
                                <CardDescription>Настройка системы уведомлений</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email уведомления</Label>
                                        <p className="text-sm text-muted-foreground">Отправка уведомлений на email</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Push уведомления</Label>
                                        <p className="text-sm text-muted-foreground">Браузерные уведомления</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Уведомления о новых студентах</Label>
                                        <p className="text-sm text-muted-foreground">При добавлении нового студента</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Security */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Безопасность
                                </CardTitle>
                                <CardDescription>Настройки безопасности и доступа</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Двухфакторная аутентификация</Label>
                                        <p className="text-sm text-muted-foreground">Требовать 2FA для админов</p>
                                    </div>
                                    <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Автоматический выход</Label>
                                        <p className="text-sm text-muted-foreground">После 30 минут неактивности</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="password-expiry">Срок действия пароля (дней)</Label>
                                    <Input id="password-expiry" type="number" defaultValue="90" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Database */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    База данных
                                </CardTitle>
                                <CardDescription>Настройки и обслуживание БД</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Автоматическое резервное копирование</Label>
                                        <p className="text-sm text-muted-foreground">Ежедневно в 02:00</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Последняя резервная копия</Label>
                                    <p className="text-sm text-muted-foreground">07 января 2026, 02:00</p>
                                </div>
                                <Button variant="outline" className="w-full">Создать резервную копию сейчас</Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email сервер
                                </CardTitle>
                                <CardDescription>SMTP настройки для отправки email</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP хост</Label>
                                    <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp-port">Порт</Label>
                                        <Input id="smtp-port" type="number" defaultValue="587" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp-user">Пользователь</Label>
                                        <Input id="smtp-user" defaultValue="noreply@university.edu" />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">Проверить подключение</Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Save className="h-5 w-5" />
                            Сохранить все изменения
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
