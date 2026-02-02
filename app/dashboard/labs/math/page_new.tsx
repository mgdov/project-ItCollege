"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calculator } from "lucide-react"
import { PageHeader, EmptyState } from "@/components/shared"

export default function MathLabPage() {
    return (
        <div className="min-h-screen pb-12">
            <PageHeader
                title="Математика"
                description="Решайте математические задачи и уравнения"
                icon={Calculator}
            />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Математические задачи</CardTitle>
                        <CardDescription>
                            Задачи будут доступны после подключения к серверу
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            title="Нет доступных задач"
                            description="Математические задачи появятся здесь после подключения к серверу"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
