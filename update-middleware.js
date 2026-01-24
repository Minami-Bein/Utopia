const fs = require('fs');
const path = require('path');

// 读取blacklist.json文件
function readBlacklist() {
  const blacklistPath = path.join(__dirname, 'blacklist.json');
  try {
    const blacklistContent = fs.readFileSync(blacklistPath, 'utf8');
    const blacklistData = JSON.parse(blacklistContent);
    return blacklistData.blacklisted_ips || [];
  } catch (error) {
    console.error('Failed to read blacklist.json:', error);
    return [];
  }
}

// 读取whitelist.json文件
function readWhitelist() {
  const whitelistPath = path.join(__dirname, 'whitelist.json');
  try {
    const whitelistContent = fs.readFileSync(whitelistPath, 'utf8');
    const whitelistData = JSON.parse(whitelistContent);
    return whitelistData.whitelisted_ips || [];
  } catch (error) {
    console.error('Failed to read whitelist.json:', error);
    return [];
  }
}

// 更新middleware.ts文件
function updateMiddleware() {
  const middlewarePath = path.join(__dirname, 'middleware.ts');
  const blacklistedIPs = readBlacklist();
  const whitelistedIPs = readWhitelist();
  
  try {
    // 读取middleware.ts文件内容
    let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    
    // 更新blacklistData对象
    const blacklistRegex = /const blacklistData: BlacklistData = \{[\s\S]*?\};\n/;
    const blacklistReplacement = `const blacklistData: BlacklistData = {\n  "blacklisted_ips": [${blacklistedIPs.map(ip => `"${ip}"`).join(', ')}],\n  "last_updated": "${new Date().toISOString()}"\n};\n`;
    middlewareContent = middlewareContent.replace(blacklistRegex, blacklistReplacement);
    
    // 更新whitelistData对象
    const whitelistRegex = /const whitelistData: WhitelistData = \{[\s\S]*?\};\n/;
    const whitelistReplacement = `const whitelistData: WhitelistData = {\n  "whitelisted_ips": [${whitelistedIPs.map(ip => `"${ip}"`).join(', ')}],\n  "last_updated": "${new Date().toISOString()}"\n};\n`;
    middlewareContent = middlewareContent.replace(whitelistRegex, whitelistReplacement);
    
    // 写入更新后的内容
    fs.writeFileSync(middlewarePath, middlewareContent);
    console.log('Successfully updated middleware.ts with IP addresses from blacklist.json and whitelist.json');
    console.log(`Added ${blacklistedIPs.length} IPs to blacklist`);
    console.log(`Added ${whitelistedIPs.length} IPs to whitelist`);
  } catch (error) {
    console.error('Failed to update middleware.ts:', error);
  }
}

// 执行更新
updateMiddleware();
