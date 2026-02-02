import Link from "next/link"
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-8 sm:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-3 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-all group-hover:shadow-xl group-hover:shadow-primary/30">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">EduSpace</span>
                <span className="text-xs text-muted-foreground">Образование будущего</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
              Современная образовательная платформа с передовыми технологиями для эффективного обучения
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Платформа</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Возможности</span>
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">О платформе</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Вход</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Регистрация</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Админ-панель</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Section */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Обучение</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Лекции и материалы</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Лабораторные работы</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Экзамены и зачёты</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Практика и игры</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Онлайн-компилятор</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@eduspace.ru"
                  className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>info@eduspace.ru</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+79991234567"
                  className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+7 (999) 123-45-67</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>г. Ростов-на-Дону,<br />ул. Образования, 1</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-8">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2025 EduSpace. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>Автономная некоммерческая организация</span>
            <span className="hidden sm:inline">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
