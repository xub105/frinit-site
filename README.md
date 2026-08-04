# FRINIT — Static Corporate Site (方案 B)

纯静态企业官网，**零服务器**：HTML 由 `data/content.json` 经 `build.js` 生成到 `dist/`，托管到 Netlify / Cloudflare Pages / GitHub Pages 即可。后台用 **Decap CMS**（编辑 `content.json` 并自动提交 Git，平台重建部署）。

## 本地预览
```bash
node build.js                 # 生成 dist/
python -m http.server 8080 --directory dist   # 或 npx serve dist
# 打开 http://localhost:8080/
```

## 改内容（两种方式）
1. **直接改数据**：编辑 `data/content.json` → 重新 `node build.js` → 提交 Git。
2. **后台可视化编辑**：部署后访问 `/admin`（Decap CMS），登录即可改文案、传图片。

## 部署（以 Netlify / Cloudflare Pages 为例）
1. 把整个 `frinit-site/` 推到 GitHub 仓库。
2. 在 Netlify / Cloudflare Pages 连接该仓库：
   - **Build command**: `node build.js`
   - **Publish directory**: `dist`
3. 修改 `admin/config.yml` 里的 `repo: your-username/frinit-site` 为你的仓库。
4. 部署后访问 `你的域名/admin` 即可登录后台（用 GitHub 账号授权）。

## 域名 & 多域名
- 在托管平台添加自定义 domain，按提示加 DNS（CNAME / A 记录）并开启 HTTPS（自动签发）。
- 多域名（如 .cn 中文 / .com 英文）需按域名分流，属进阶配置，单独处理。

## 结构
```
data/content.json    源数据（Decap 编辑的就是它）
views.js             页面模板（被 build.js 调用）
build.js             构建脚本 -> 输出 dist/
public/              css/js/uploads（静态资源，原样拷到 dist）
admin/               Decap CMS 的 index.html + config.yml
dist/                构建产物（部署目录）
```
