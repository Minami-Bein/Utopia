"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
      </header>

      <div className={styles.content}>
        <Image
          priority
          src="/sphere.svg"
          alt="Sphere"
          width={200}
          height={200}
        />
        <h1 className={styles.title}>匿名活动组织平台</h1>

        <p className={styles.subtitle}>
          创建和参与去中心化的匿名活动
        </p>

        <div className={styles.quickLinks}>
          <Link href="/rankings" className={styles.primaryButton}>
            🏆 查看活动排行榜
          </Link>
          <button className={styles.secondaryButton}>
            ➕ 创建新活动
          </button>
        </div>

        <h2 className={styles.componentsTitle}>平台功能</h2>

        <ul className={styles.components}>
          {[
            {
              name: "活动排行榜",
              url: "/rankings",
              internal: true,
            },
            {
              name: "创建活动",
              url: "/create",
              internal: true,
            },
            {
              name: "我的活动",
              url: "/my-events",
              internal: true,
            },
            {
              name: "匿名身份管理",
              url: "#",
              internal: true,
            },
            {
              name: "活动验证",
              url: "#",
              internal: true,
            },
          ].map((component) => (
            <li key={component.name}>
              {component.internal ? (
                <Link href={component.url}>{component.name}</Link>
              ) : (
                <a target="_blank" rel="noreferrer" href={component.url}>
                  {component.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
