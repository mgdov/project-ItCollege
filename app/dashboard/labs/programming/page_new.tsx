"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Code2 } from "lucide-react"
import { PageHeader, EmptyState } from "@/components/shared"

export default function ProgrammingLabPage() {
    return (
        <div className="min-h-screen pb-12">
            <PageHeader
                title="Программирование"
                description="Пишите и тестируйте код в онлайн-компиляторе"
                icon={Code2}
            />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Онлайн-компилятор</CardTitle>
                        <CardDescription>
                            Редактор кода будет доступен после подключения к серверу
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            title="Компилятор недоступен"
                            description="Онлайн-компилятор для написания и тестирования кода появится здесь после подключения к серверу"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
