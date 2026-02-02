import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import { useState } from 'react'

interface Column<T> {
    key: keyof T | string
    header: string
    render?: (item: T) => React.ReactNode
    sortable?: boolean
}

interface DataTableProps<T> {
    title?: string
    data: T[]
    columns: Column<T>[]
    searchKey?: keyof T
    searchPlaceholder?: string
    onAdd?: () => void
    addLabel?: string
    actions?: (item: T) => React.ReactNode
    emptyMessage?: string
}

export function DataTable<T extends { id?: string | number }>({
    title,
    data,
    columns,
    searchKey,
    searchPlaceholder = 'Поиск...',
    onAdd,
    addLabel = 'Добавить',
    actions,
    emptyMessage = 'Нет данных',
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = searchKey
        ? data.filter((item) => {
            const value = item[searchKey]
            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
        : data

    return (
        <Card>
            {(title || onAdd || searchKey) && (
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        {title && <CardTitle>{title}</CardTitle>}
                        <div className="flex items-center gap-2">
                            {searchKey && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={searchPlaceholder}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 w-[200px] lg:w-[300px]"
                                    />
                                </div>
                            )}
                            {onAdd && (
                                <Button onClick={onAdd} size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {addLabel}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
            )}
            <CardContent className={title || onAdd || searchKey ? '' : 'pt-6'}>
                {filteredData.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableHead key={index}>{column.header}</TableHead>
                                    ))}
                                    {actions && <TableHead className="text-right">Действия</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((item, rowIndex) => (
                                    <TableRow key={item.id || rowIndex}>
                                        {columns.map((column, colIndex) => (
                                            <TableCell key={colIndex}>
                                                {column.render
                                                    ? column.render(item)
                                                    : String(item[column.key as keyof T] || '')}
                                            </TableCell>
                                        ))}
                                        {actions && (
                                            <TableCell className="text-right">{actions(item)}</TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
