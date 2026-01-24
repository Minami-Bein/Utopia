"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "首页", icon: "🏠" },
    { href: "/rankings", label: "排行榜", icon: "🏆" },
    { href: "/create", label: "创建活动", icon: "➕" },
    { href: "/my-events", label: "我的活动", icon: "📅" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <Image src="/sphere.svg" alt="Logo" width={50} height={50} />
          </span>
          <span className={styles.logoText}>匿名活动</span>
        </Link>

        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
