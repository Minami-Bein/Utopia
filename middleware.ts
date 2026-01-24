import { NextRequest, NextResponse } from 'next/server';

interface IPRecord {
  count: number;
  lastAccess: number;
  blacklisted: boolean;
  blacklistExpiry?: number;
}

interface BlacklistData {
  blacklisted_ips: string[];
  last_updated: string;
}

interface WhitelistData {
  whitelisted_ips: string[];
  last_updated: string;
}

const IP_ACCESS_MAP = new Map<string, IPRecord>();
// 手动维护的黑名单和白名单
const MANUAL_BLACKLIST = new Set<string>();
const MANUAL_WHITELIST = new Set<string>();
const RATE_LIMIT_THRESHOLD = 100; // 短时间内的最大访问次数
const RATE_LIMIT_WINDOW = 60000; // 1分钟窗口（毫秒）
const BLACKLIST_DURATION = 86400000; // 1天（毫秒）

// 初始化手动黑名单和白名单
// 从blacklist.json和whitelist.json文件中读取IP地址
// 注意：由于Next.js中间件在沙箱环境中运行，无法直接访问文件系统
// 因此这里手动解析这些文件的内容

// 手动解析blacklist.json文件
const blacklistData: BlacklistData = {
  "blacklisted_ips": ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
  "last_updated": "2026-01-24T16:21:45.741Z"
};

// 手动解析whitelist.json文件
const whitelistData: WhitelistData = {
  "whitelisted_ips": ["192.168.1.90", "127.0.0.1"],
  "last_updated": "2026-01-24T16:21:45.742Z"
};

// 将IP地址添加到手动黑名单和白名单中
blacklistData.blacklisted_ips.forEach(ip => MANUAL_BLACKLIST.add(ip));
whitelistData.whitelisted_ips.forEach(ip => MANUAL_WHITELIST.add(ip));

// 添加默认白名单地址
MANUAL_WHITELIST.add('127.0.0.1'); // 本地地址
// MANUAL_WHITELIST.add('192.168.1.1'); // 本地网络地址

// 示例：手动添加IP到黑名单
// MANUAL_BLACKLIST.add('192.168.1.100');
// MANUAL_BLACKLIST.add('192.168.1.101');

// 示例：手动添加IP到白名单
// MANUAL_WHITELIST.add('192.168.1.1'); // 本地网络地址

// 尝试从环境变量中获取黑名单和白名单
// 格式：BLACKLIST=192.168.1.100,192.168.1.101
// 格式：WHITELIST=127.0.0.1,192.168.1.1
if (process.env.BLACKLIST) {
  process.env.BLACKLIST.split(',').forEach(ip => MANUAL_BLACKLIST.add(ip.trim()));
}

if (process.env.WHITELIST) {
  process.env.WHITELIST.split(',').forEach(ip => MANUAL_WHITELIST.add(ip.trim()));
}

console.log(`Initialized with ${MANUAL_BLACKLIST.size} blacklisted IPs and ${MANUAL_WHITELIST.size} whitelisted IPs`);

// 清理过期的IP记录
function cleanupIPRecords() {
  const now = Date.now();
  for (const [ip, record] of IP_ACCESS_MAP.entries()) {
    // 清理黑名单过期的记录
    if (record.blacklisted && record.blacklistExpiry && now > record.blacklistExpiry) {
      IP_ACCESS_MAP.delete(ip);
    }
    // 清理长时间未访问的记录
    else if (!record.blacklisted && now - record.lastAccess > RATE_LIMIT_WINDOW * 2) {
      IP_ACCESS_MAP.delete(ip);
    }
  }
}

// 定期清理过期记录
setInterval(cleanupIPRecords, 300000); // 每5分钟清理一次

export function middleware(request: NextRequest) {
  // 获取客户端IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // 检查IP是否在白名单中
  if (MANUAL_WHITELIST.has(ip)) {
    console.log(`Whitelisted IP ${ip} allowed`);
    return NextResponse.next();
  }

  // 检查IP是否在手动维护的黑名单中
  if (MANUAL_BLACKLIST.has(ip)) {
    console.log(`Manually blacklisted IP ${ip} blocked`);
    // 拒绝访问，模拟tomcat内存溢出错误
    return new NextResponse(
      `<html><head><title>500 Internal Server Error</title></head><body><h1>HTTP Status 500 - java.lang.OutOfMemoryError: Java heap space</h1><HR size="1" noshade="noshade"><p><b>type</b> Exception report</p><p><b>message</b> java.lang.OutOfMemoryError: Java heap space</p><p><b>description</b> The server encountered an internal error that prevented it from fulfilling this request.</p><p><b>exception</b></p><pre>java.lang.OutOfMemoryError: Java heap space
\tat java.base/java.util.Arrays.copyOf(Arrays.java:3745)
\tat java.base/java.util.ArrayList.grow(ArrayList.java:237)
\tat java.base/java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:213)
\tat java.base/java.util.ArrayList.ensureCapacityInternal(ArrayList.java:205)
\tat java.base/java.util.ArrayList.add(ArrayList.java:485)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1510)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1388)
\tat org.apache.catalina.session.StandardSessionFacade.setAttribute(StandardSessionFacade.java:154)
\tat javax.servlet.http.HttpSessionWrapper.setAttribute(HttpSessionWrapper.java:240)
\tat com.example.Application.processRequest(Application.java:45)
\tat com.example.Application.doGet(Application.java:60)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:655)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)
\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)
\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)
\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)
\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
\tat org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:687)
\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)
\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)
\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)
\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)
\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:890)
\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1789)
\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
\tat java.base/java.lang.Thread.run(Thread.java:834)
</pre><p><b>note</b> The full stack trace of the root cause is available in the server logs.</p><HR size="1" noshade="noshade"><h3>Apache Tomcat/10.1.16</h3></body></html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );
  }

  // 检查IP是否在自动黑名单中
  const existingRecord = IP_ACCESS_MAP.get(ip);
  if (existingRecord?.blacklisted) {
    if (existingRecord.blacklistExpiry && now > existingRecord.blacklistExpiry) {
      // 黑名单过期，移除
      IP_ACCESS_MAP.delete(ip);
    } else {
      // 拒绝访问，模拟tomcat内存溢出错误
      return new NextResponse(
        `<html><head><title>500 Internal Server Error</title></head><body><h1>HTTP Status 500 - java.lang.OutOfMemoryError: Java heap space</h1><HR size="1" noshade="noshade"><p><b>type</b> Exception report</p><p><b>message</b> java.lang.OutOfMemoryError: Java heap space</p><p><b>description</b> The server encountered an internal error that prevented it from fulfilling this request.</p><p><b>exception</b></p><pre>java.lang.OutOfMemoryError: Java heap space
\tat java.base/java.util.Arrays.copyOf(Arrays.java:3745)
\tat java.base/java.util.ArrayList.grow(ArrayList.java:237)
\tat java.base/java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:213)
\tat java.base/java.util.ArrayList.ensureCapacityInternal(ArrayList.java:205)
\tat java.base/java.util.ArrayList.add(ArrayList.java:485)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1510)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1388)
\tat org.apache.catalina.session.StandardSessionFacade.setAttribute(StandardSessionFacade.java:154)
\tat javax.servlet.http.HttpSessionWrapper.setAttribute(HttpSessionWrapper.java:240)
\tat com.example.Application.processRequest(Application.java:45)
\tat com.example.Application.doGet(Application.java:60)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:655)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)
\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)
\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)
\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)
\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
\tat org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:687)
\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)
\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)
\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)
\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)
\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:890)
\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1789)
\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
\tat java.base/java.lang.Thread.run(Thread.java:834)
</pre><p><b>note</b> The full stack trace of the root cause is available in the server logs.</p><HR size="1" noshade="noshade"><h3>Apache Tomcat/10.1.16</h3></body></html>`,
        {
          status: 500,
          headers: {
            'Content-Type': 'text/html'
          }
        }
      );
    }
  }

  // 更新或创建IP访问记录
  if (existingRecord) {
    // 检查是否在时间窗口内
    if (now - existingRecord.lastAccess < RATE_LIMIT_WINDOW) {
      // 增加访问计数
      existingRecord.count++;
      existingRecord.lastAccess = now;

      // 检查是否超过阈值
      if (existingRecord.count > RATE_LIMIT_THRESHOLD) {
        // 加入黑名单
        existingRecord.blacklisted = true;
        existingRecord.blacklistExpiry = now + BLACKLIST_DURATION;
        IP_ACCESS_MAP.set(ip, existingRecord);

        // 加入黑名单，模拟tomcat内存溢出错误
        return new NextResponse(
          `<html><head><title>500 Internal Server Error</title></head><body><h1>HTTP Status 500 - java.lang.OutOfMemoryError: Java heap space</h1><HR size="1" noshade="noshade"><p><b>type</b> Exception report</p><p><b>message</b> java.lang.OutOfMemoryError: Java heap space</p><p><b>description</b> The server encountered an internal error that prevented it from fulfilling this request.</p><p><b>exception</b></p><pre>java.lang.OutOfMemoryError: Java heap space
\tat java.base/java.util.Arrays.copyOf(Arrays.java:3745)
\tat java.base/java.util.ArrayList.grow(ArrayList.java:237)
\tat java.base/java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:213)
\tat java.base/java.util.ArrayList.ensureCapacityInternal(ArrayList.java:205)
\tat java.base/java.util.ArrayList.add(ArrayList.java:485)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1510)
\tat org.apache.catalina.session.StandardSession.setAttribute(StandardSession.java:1388)
\tat org.apache.catalina.session.StandardSessionFacade.setAttribute(StandardSessionFacade.java:154)
\tat javax.servlet.http.HttpSessionWrapper.setAttribute(HttpSessionWrapper.java:240)
\tat com.example.Application.processRequest(Application.java:45)
\tat com.example.Application.doGet(Application.java:60)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:655)
\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)
\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)
\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)
\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)
\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)
\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
\tat org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:687)
\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)
\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)
\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)
\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)
\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:890)
\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1789)
\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
\tat java.base/java.lang.Thread.run(Thread.java:834)
</pre><p><b>note</b> The full stack trace of the root cause is available in the server logs.</p><HR size="1" noshade="noshade"><h3>Apache Tomcat/10.1.16</h3></body></html>`,
          {
            status: 500,
            headers: {
              'Content-Type': 'text/html'
            }
          }
        );
      }
    } else {
      // 时间窗口外，重置计数
      existingRecord.count = 1;
      existingRecord.lastAccess = now;
    }
    IP_ACCESS_MAP.set(ip, existingRecord);
  } else {
    // 新IP，创建记录
    IP_ACCESS_MAP.set(ip, {
      count: 1,
      lastAccess: now,
      blacklisted: false,
    });
  }

  // 继续处理请求
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
