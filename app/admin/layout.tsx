import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="transition-all duration-300 md:ml-64">{children}</main>
    </div>
  )
}
