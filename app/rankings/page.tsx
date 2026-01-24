"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./rankings.module.css";

// 排行榜类型
type RankingType = "popular" | "upcoming" | "participants" | "recent";

// 活动数据接口
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
  eventType: string;
  tags: string[];
  contentLevels: {
    high: string;
    medium: string;
    low: string;
  };
}

// 活动列表接口
interface EventList {
  title: string;
  description: string;
  events: Event[];
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<RankingType>("popular");
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0, upcomingEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从JSON文件加载活动数据
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 加载所有四个JSON文件
        const tabs = ["popular", "upcoming", "recent", "participants"];
        const fetchPromises = tabs.map(tab => 
          fetch(`/data/events/${tab}.json`).then(res => res.json() as Promise<EventList>)
        );
        
        // 同时加载统计数据
        const statsPromise = fetch(`/data/events/stats.json`).then(res => res.json());
        
        const [allData, statsData] = await Promise.all([Promise.all(fetchPromises), statsPromise]);
        
        // 合并所有活动数据，去除重复项
        const allEventsMap = new Map<string, Event>();
        
        allData.forEach(data => {
          data.events.forEach(event => {
            if (!allEventsMap.has(event.id)) {
              const formattedEvent = {
                ...event,
                name: event.title, // 添加name字段以兼容现有代码
                category: event.tags[0] || "其他", // 使用第一个标签作为分类
                anonymousLevel: "medium" as const, // 默认半匿名
              };
              allEventsMap.set(event.id, formattedEvent);
            }
          });
        });
        
        const mergedAllEvents = Array.from(allEventsMap.values());
        setAllEvents(mergedAllEvents);
        
        // 设置统计数据
        if (statsData && statsData.stats) {
          setStats(statsData.stats);
        }
        
        // 根据当前标签页加载对应的活动数据
        const currentTabData = allData.find(data => 
          data.title.includes(activeTab === "popular" ? "最热门" : 
                            activeTab === "upcoming" ? "即将开始" : 
                            activeTab === "recent" ? "最新发布" : 
                            activeTab === "participants" ? "参与人数" : "最热门")
        );
        
        if (currentTabData) {
          const formattedEvents = currentTabData.events.map(event => ({
            ...event,
            name: event.title, // 添加name字段以兼容现有代码
            category: event.tags[0] || "其他", // 使用第一个标签作为分类
            anonymousLevel: "medium" as const, // 默认半匿名
          }));
          setEvents(formattedEvents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载活动失败");
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [activeTab]);

  const sortedEvents = events;

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
                    📅 {new Date(event.startTime).toLocaleDateString("zh-CN")}
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
          <p>{stats.totalEvents}</p>
        </div>
        <div className={styles.statCard}>
          <h4>总参与人数</h4>
          <p>{stats.totalParticipants.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <h4>即将开始</h4>
          <p>{stats.upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
}
