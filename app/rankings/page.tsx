"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./rankings.module.css";

// 排行榜类型
type RankingType = "popular" | "upcoming" | "participants" | "recent";

// 活动数据接口
interface Event {
  id: string;
  name: string;
  description: string;
  participants: number;
  startTime: Date;
  category: string;
  anonymousLevel: "low" | "medium" | "high";
  organizer?: string; // 如果是匿名活动，可以不显示
}

// 模拟数据（后续可以从链上或API获取）
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Web3 黑客松",
    description: "构建下一代去中心化应用",
    participants: 1250,
    startTime: new Date("2024-02-15"),
    category: "技术",
    anonymousLevel: "medium",
  },
  {
    id: "2",
    name: "加密艺术展览",
    description: "探索NFT艺术的未来",
    participants: 890,
    startTime: new Date("2024-02-20"),
    category: "艺术",
    anonymousLevel: "high",
  },
  {
    id: "3",
    name: "DeFi 研讨会",
    description: "深入了解去中心化金融",
    participants: 567,
    startTime: new Date("2024-02-10"),
    category: "金融",
    anonymousLevel: "low",
  },
  {
    id: "4",
    name: "DAO 治理峰会",
    description: "讨论社区治理最佳实践",
    participants: 2100,
    startTime: new Date("2024-03-01"),
    category: "治理",
    anonymousLevel: "medium",
  },
  {
    id: "5",
    name: "区块链游戏嘉年华",
    description: "体验最新的链游项目",
    participants: 3400,
    startTime: new Date("2024-02-25"),
    category: "游戏",
    anonymousLevel: "low",
  },
];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<RankingType>("popular");

  // 根据不同的排行榜类型排序
  const getSortedEvents = (type: RankingType): Event[] => {
    const now = new Date();
    switch (type) {
      case "popular":
        return [...mockEvents].sort((a, b) => b.participants - a.participants);
      case "upcoming":
        return [...mockEvents]
          .filter((e) => e.startTime > now)
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      case "participants":
        return [...mockEvents].sort((a, b) => b.participants - a.participants);
      case "recent":
        return [...mockEvents].sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        );
      default:
        return mockEvents;
    }
  };

  const sortedEvents = getSortedEvents(activeTab);

  // 获取匿名等级标签
  const getAnonymityBadge = (level: "low" | "medium" | "high") => {
    const badges = {
      low: { text: "公开", color: "#10b981" },
      medium: { text: "半匿名", color: "#f59e0b" },
      high: { text: "完全匿名", color: "#8b5cf6" },
    };
    return badges[level];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>活动排行榜</h1>
        <p>发现最受欢迎的匿名活动</p>
      </header>

      {/* 排行榜类型切换 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "popular" ? styles.active : ""}`}
          onClick={() => setActiveTab("popular")}
        >
          🔥 最热门
        </button>
        <button
          className={`${styles.tab} ${activeTab === "upcoming" ? styles.active : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          🚀 即将开始
        </button>
        <button
          className={`${styles.tab} ${activeTab === "participants" ? styles.active : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          👥 参与人数
        </button>
        <button
          className={`${styles.tab} ${activeTab === "recent" ? styles.active : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          ⏰ 最新发布
        </button>
      </div>

      {/* 排行榜列表 */}
      <div className={styles.rankingList}>
        {sortedEvents.map((event, index) => {
          const anonymityBadge = getAnonymityBadge(event.anonymousLevel);
          return (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.rank}>
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && `#${index + 1}`}
              </div>

              <div className={styles.eventInfo}>
                <div className={styles.eventHeader}>
                  <h3>{event.name}</h3>
                  <span
                    className={styles.anonymityBadge}
                    style={{ backgroundColor: anonymityBadge.color }}
                  >
                    {anonymityBadge.text}
                  </span>
                </div>

                <p className={styles.description}>{event.description}</p>

                <div className={styles.eventMeta}>
                  <span className={styles.category}>📂 {event.category}</span>
                  <span className={styles.participants}>
                    👥 {event.participants.toLocaleString()} 参与者
                  </span>
                  <span className={styles.date}>
                    📅 {event.startTime.toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              <Link href={`/events/${event.id}?source=rankings`} className={styles.viewButton}>查看详情</Link>
            </div>
          );
        })}
      </div>

      {/* 统计信息 */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h4>总活动数</h4>
          <p>{mockEvents.length}</p>
        </div>
        <div className={styles.statCard}>
          <h4>总参与人数</h4>
          <p>
            {mockEvents
              .reduce((sum, e) => sum + e.participants, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className={styles.statCard}>
          <h4>即将开始</h4>
          <p>
            {
              mockEvents.filter((e) => e.startTime > new Date()).length
            }
          </p>
        </div>
      </div>
    </div>
  );
}
