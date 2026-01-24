"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./my-events.module.css";

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export default function MyEvents() {
  // State for user events
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Web3开发者大会",
      description: "探讨Web3技术的最新发展和应用场景",
      location: "线上",
      startTime: "2026-02-01T10:00:00",
      endTime: "2026-02-01T18:00:00",
      status: "upcoming"
    },
    {
      id: "2",
      title: "DeFi安全研讨会",
      description: "讨论DeFi项目的安全问题和解决方案",
      location: "上海",
      startTime: "2026-01-20T14:00:00",
      endTime: "2026-01-20T16:00:00",
      status: "completed"
    },
    {
      id: "3",
      title: "NFT艺术展览",
      description: "展示最新的NFT艺术作品和创作理念",
      location: "北京",
      startTime: "2026-02-15T10:00:00",
      endTime: "2026-02-15T17:00:00",
      status: "upcoming"
    }
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>我的活动</h1>

        <div className={styles.eventsList}>
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}?source=my-events`} className={styles.eventLink}>
              <div className={styles.eventCard}>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.eventDescription}>{event.description}</p>
                <div className={styles.eventDetails}>
                  <p className={styles.eventLocation}>📍 {event.location}</p>
                  <p className={styles.eventTime}>
                    🕒 {formatDate(event.startTime)} - {formatDate(event.endTime)}
                  </p>
                  <p className={`${styles.eventStatus} ${event.status === "upcoming" ? styles.upcoming : styles.completed}`}>
                    {event.status === "upcoming" ? "即将开始" : "已完成"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/" className={styles.backButton}>
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
