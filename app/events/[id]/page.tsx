"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./event-detail.module.css";

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const isFromRankings = source === 'rankings';
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching event data
    const fetchEventData = () => {
      // In a real application, this would be an API call
      const mockEvents = [
        {
          id: "1",
          title: "Web3开发者大会",
          description: "探讨Web3技术的最新发展和应用场景，包括区块链、智能合约、NFT、DeFi等热门话题。来自全球的行业专家将分享他们的见解和经验，为参与者提供宝贵的学习和交流机会。",
          location: "线上",
          startTime: "2026-02-01T10:00:00",
          endTime: "2026-02-01T18:00:00",
          status: "upcoming",
          organizer: "Web3 Foundation",
          participants: 1250,
          maxParticipants: 2000,
          eventType: "public",
          tags: ["Web3", "区块链", "开发者"],
          contentLevels: {
            high: "这是高等级内容，包含详细的技术演讲安排和嘉宾信息，只有注册用户才能查看。",
            medium: "这是中等级内容，包含基本的活动流程和演讲主题，登录后可以查看。",
            low: "这是低等级内容，包含活动的基本信息和时间地点，任何人都可以查看。"
          }
        },
        {
          id: "2",
          title: "DeFi安全研讨会",
          description: "讨论DeFi项目的安全问题和解决方案，包括智能合约审计、漏洞防范、风险控制等内容。邀请了多位安全专家和项目负责人，分享他们在DeFi安全领域的实践经验。",
          location: "上海",
          startTime: "2026-01-20T14:00:00",
          endTime: "2026-01-20T16:00:00",
          status: "completed",
          organizer: "DeFi Security Alliance",
          participants: 85,
          maxParticipants: 100,
          eventType: "invitation",
          tags: ["DeFi", "安全", "研讨会"],
          contentLevels: {
            high: "这是高等级内容，包含详细的安全案例分析和解决方案，只有邀请用户才能查看。",
            medium: "这是中等级内容，包含基本的安全问题讨论和建议，登录后可以查看。",
            low: "这是低等级内容，包含研讨会的基本信息和时间地点，任何人都可以查看。"
          }
        },
        {
          id: "3",
          title: "NFT艺术展览",
          description: "展示最新的NFT艺术作品和创作理念，包括数字艺术、虚拟收藏品、元宇宙资产等。参展艺术家来自世界各地，作品涵盖多种风格和主题，为观众带来一场视觉盛宴。",
          location: "北京",
          startTime: "2026-02-15T10:00:00",
          endTime: "2026-02-15T17:00:00",
          status: "upcoming",
          organizer: "NFT Art Gallery",
          participants: 320,
          maxParticipants: 500,
          eventType: "public",
          tags: ["NFT", "艺术", "展览"],
          contentLevels: {
            high: "这是高等级内容，包含详细的艺术作品介绍和艺术家信息，只有注册用户才能查看。",
            medium: "这是中等级内容，包含基本的展览信息和作品列表，登录后可以查看。",
            low: "这是低等级内容，包含展览的基本信息和时间地点，任何人都可以查看。"
          }
        }
      ];

      const foundEvent = mockEvents.find(e => e.id === id);
      setEvent(foundEvent);
      setLoading(false);
    };

    fetchEventData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>加载中...</h1>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>活动不存在</h1>
          <Link href="/my-events" className={styles.backButton}>
            ← 返回我的活动
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{event.title}</h1>

        <div className={styles.eventCard}>
          <div className={styles.eventHeader}>
            <p className={`${styles.eventStatus} ${event.status === "upcoming" ? styles.upcoming : styles.completed}`}>
              {event.status === "upcoming" ? "即将开始" : "已完成"}
            </p>
          </div>

          <p className={styles.eventDescription}>{event.description}</p>

          {/* 根据来源显示不同等级的内容 */}
          <div className={styles.contentLevels}>
            {isFromRankings ? (
              <div className={styles.levelContent}>
                <h3 className={styles.levelTitle}>低等级内容</h3>
                <p className={styles.levelText}>{event.contentLevels.low}</p>
              </div>
            ) : (
              <>
                <div className={styles.levelContent}>
                  <h3 className={styles.levelTitle}>高等级内容</h3>
                  <p className={styles.levelText}>{event.contentLevels.high}</p>
                </div>
                <div className={styles.levelContent}>
                  <h3 className={styles.levelTitle}>中等级内容</h3>
                  <p className={styles.levelText}>{event.contentLevels.medium}</p>
                </div>
                <div className={styles.levelContent}>
                  <h3 className={styles.levelTitle}>低等级内容</h3>
                  <p className={styles.levelText}>{event.contentLevels.low}</p>
                </div>
              </>
            )}
          </div>

          <div className={styles.eventDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>组织者:</span>
              <span className={styles.detailValue}>{event.organizer}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>地点:</span>
              <span className={styles.detailValue}>{event.location}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>时间:</span>
              <span className={styles.detailValue}>
                {formatDate(event.startTime)} - {formatDate(event.endTime)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>参与人数:</span>
              <span className={styles.detailValue}>{event.participants} / {event.maxParticipants}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>活动类型:</span>
              <span className={styles.detailValue}>
                {event.eventType === "public" ? "公开活动" : event.eventType === "private" ? "私密活动" : "仅限邀请"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>标签:</span>
              <span className={styles.detailValue}>
                {event.tags.map((tag: string, index: number) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            {event.status === "upcoming" && (
              <button className={styles.primaryButton}>立即参加</button>
            )}
            <button className={styles.secondaryButton}>分享活动</button>
          </div>
        </div>

        <div className={styles.navigationButtons}>
          <Link href="/my-events" className={styles.backButton}>
            ← 返回我的活动
          </Link>
          <Link href="/" className={styles.homeButton}>
            🏠 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
