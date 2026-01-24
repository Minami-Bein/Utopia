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

// 活动数据 - 包含来自排行榜和我的活动的所有活动
const mockEvents = [
  // 排行榜活动
  {
    id: "1",
    title: "Web3 黑客松",
    description: "构建下一代去中心化应用",
    location: "线上",
    startTime: "2024-02-15T00:00:00",
    endTime: "2024-02-15T23:59:59",
    status: "upcoming",
    organizer: "Web3 Foundation",
    participants: 1250,
    maxParticipants: 2000,
    eventType: "public",
    tags: ["Web3", "黑客松", "技术"],
    contentLevels: {
      high: "这是高等级内容，包含详细的技术演讲安排和嘉宾信息，只有注册用户才能查看。",
      medium: "这是中等级内容，包含基本的活动流程和演讲主题，登录后可以查看。",
      low: "这是低等级内容，包含活动的基本信息和时间地点，任何人都可以查看。"
    }
  },
  {
    id: "2",
    title: "加密艺术展览",
    description: "探索NFT艺术的未来",
    location: "线上",
    startTime: "2024-02-20T00:00:00",
    endTime: "2024-02-20T23:59:59",
    status: "upcoming",
    organizer: "NFT Art Gallery",
    participants: 890,
    maxParticipants: 1500,
    eventType: "public",
    tags: ["NFT", "艺术", "展览"],
    contentLevels: {
      high: "这是高等级内容，包含详细的艺术作品介绍和艺术家信息，只有注册用户才能查看。",
      medium: "这是中等级内容，包含基本的展览信息和作品列表，登录后可以查看。",
      low: "这是低等级内容，包含展览的基本信息和时间地点，任何人都可以查看。"
    }
  },
  {
    id: "3",
    title: "DeFi 研讨会",
    description: "深入了解去中心化金融",
    location: "线上",
    startTime: "2024-02-10T00:00:00",
    endTime: "2024-02-10T23:59:59",
    status: "upcoming",
    organizer: "DeFi Alliance",
    participants: 567,
    maxParticipants: 1000,
    eventType: "public",
    tags: ["DeFi", "金融", "研讨会"],
    contentLevels: {
      high: "这是高等级内容，包含详细的DeFi项目分析和投资策略，只有注册用户才能查看。",
      medium: "这是中等级内容，包含基本的DeFi概念和项目介绍，登录后可以查看。",
      low: "这是低等级内容，包含研讨会的基本信息和时间地点，任何人都可以查看。"
    }
  },
  {
    id: "4",
    title: "DAO 治理峰会",
    description: "讨论社区治理最佳实践",
    location: "线上",
    startTime: "2024-03-01T00:00:00",
    endTime: "2024-03-01T23:59:59",
    status: "upcoming",
    organizer: "DAO Foundation",
    participants: 2100,
    maxParticipants: 3000,
    eventType: "public",
    tags: ["DAO", "治理", "峰会"],
    contentLevels: {
      high: "这是高等级内容，包含详细的治理案例分析和专家演讲，只有注册用户才能查看。",
      medium: "这是中等级内容，包含基本的峰会信息和议程安排，登录后可以查看。",
      low: "这是低等级内容，包含峰会的基本信息和时间地点，任何人都可以查看。"
    }
  },
  {
    id: "5",
    title: "区块链游戏嘉年华",
    description: "体验最新的链游项目",
    location: "线上",
    startTime: "2024-02-25T00:00:00",
    endTime: "2024-02-25T23:59:59",
    status: "upcoming",
    organizer: "Blockchain Game Alliance",
    participants: 3400,
    maxParticipants: 5000,
    eventType: "public",
    tags: ["区块链", "游戏", "嘉年华"],
    contentLevels: {
      high: "这是高等级内容，包含详细的游戏项目介绍和开发者访谈，只有注册用户才能查看。",
      medium: "这是中等级内容，包含基本的嘉年华信息和游戏列表，登录后可以查看。",
      low: "这是低等级内容，包含嘉年华的基本信息和时间地点，任何人都可以查看。"
    }
  },
  // 我的活动
  {
    id: "6",
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
    id: "7",
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
    id: "8",
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

// 活动详情组件
export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 获取活动数据
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log('Fetching event with id:', id);
        console.log('Source:', source);
        
        // 直接从mockEvents数组中查找
        const foundEvent = mockEvents.find(e => e.id === id);
        console.log('Found event:', foundEvent);
        
        setEvent(foundEvent);
      } catch (error) {
        console.error('Failed to fetch event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, source]);

  // 加载状态
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>加载中...</h1>
        </div>
      </div>
    );
  }

  // 错误状态
  if (!event) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>活动不存在</h1>
          <Link href={source === 'my-events' ? '/my-events' : source === 'rankings' ? '/rankings' : '/'} className={styles.backButton}>
            ← {source === 'my-events' ? '返回我的活动' : source === 'rankings' ? '返回排行榜' : '返回首页'}
          </Link>
        </div>
      </div>
    );
  }

  // 确定返回链接
  const getBackLink = () => {
    if (source === 'rankings') return '/rankings';
    if (source === 'my-events') return '/my-events';
    return '/';
  };

  // 确定返回按钮文本
  const getBackButtonText = () => {
    if (source === 'rankings') return '返回排行榜';
    if (source === 'my-events') return '返回我的活动';
    return '返回首页';
  };

  // 确定显示的内容
  const getDisplayContent = () => {
    if (source === 'rankings') {
      return event.contentLevels.low;
    }
    return event.description;
  };

  // 确定页面标题
  const getPageTitle = () => {
    if (source === 'my-events') return '我的活动详情';
    return '活动详情';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{getPageTitle()}</h1>

        <div className={styles.eventsList}>
          <div className={styles.eventCard}>
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <p className={styles.eventDescription}>{getDisplayContent()}</p>
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
        </div>

        <div className={styles.navigationButtons}>
          <Link href={getBackLink()} className={styles.backButton}>
            ← {getBackButtonText()}
          </Link>
          <Link href="/" className={styles.homeButton}>
            🏠 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}