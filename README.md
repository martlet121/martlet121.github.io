# V2Ray 帮助文档站点

基于 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建的 **V2Ray 中文帮助文档**静态站点。

- 目标：**每个 Markdown 文件 → 一个网页，内容一比一忠实还原**（标题、表格、代码块、提示框、任务列表、换行等原样呈现）。
- 部署地址：<https://martlet121.github.io/>（GitHub Pages）。
- 已完成全站 **SEO / GEO 优化**（canonical、sitemap、每页独立描述、Open Graph / 结构化数据、`robots.txt`、`llms.txt`）。

## 目录结构

```
.
├── mkdocs.yml              # 站点配置（主题、扩展、导航、SEO 元信息）
├── docs/                   # Markdown 源文件目录
│   ├── index.md            # 首页
│   ├── 1 介绍V2Ray.md ...   # 各章节文档（文件名 = 页面标题）
│   ├── files/              # 正文引用的图片 / 附件
│   ├── javascripts/
│   │   └── extra.js        # 自定义脚本 + SEO/GEO 客户端注入（OG/Twitter/JSON-LD）
│   ├── stylesheets/
│   │   └── extra.css       # 自定义样式
│   ├── robots.txt          # 爬虫规则（指向 sitemap）——构建时拷贝到 site/ 根
│   ├── llms.txt            # 面向 AI 搜索引擎的站点摘要（GEO）
│   └── llms-full.txt       # 全站原始 Markdown 全文（GEO）
├── hardbreak.py            # 自定义 Markdown 扩展：一比一还原换行
├── seo_gen.py              # SEO/GEO 生成器：注入每页描述、生成 robots/llms（幂等）
├── pyproject.toml          # 把 hardbreak 扩展以可编辑方式装进虚拟环境
├── site/                   # 构建产物（自动生成，勿手改）
├── .venv/                  # Python 虚拟环境（自动生成）
└── README.md               # 本说明
```

## 一、准备环境

PowerShell 中执行（每次新开终端都要先激活）：

```powershell
.\.venv\Scripts\Activate.ps1
```

> 若提示“无法加载脚本”因执行策略受限，先执行：`Set-ExecutionPolicy -Scope Process RemoteSigned`

首次或重建虚拟环境后，需安装自定义换行扩展（只需一次）：

```powershell
pip install -e .
```

## 二、编辑文档

1. 把 `.md` 文件放到 `docs/` 目录；图片、附件放在 `docs/files/`，正文用相对路径 `./files/xxx.png` 引用。
2. `mkdocs.yml` 的 `nav:` 已登记所有页面，**目录名直接使用 Markdown 文件名**（如 `1 介绍V2Ray.md`）。
   新增 `.md` 时，在 `nav:` 追加一行（保证“文件名 ↔ 页面”一一对应）：

   ```yaml
   nav:
     - "新文档": "新文档.md"
   ```

> 不登记 `nav` 也能构建，但左侧导航不会显示该页。

## 三、本地预览

```powershell
mkdocs serve
```

浏览器打开终端提示的地址（默认 <http://127.0.0.1:8000/>），修改 Markdown 会自动热更新。

## 四、生成静态站点

```powershell
mkdocs build
```

产物输出到 `site/` 目录，**直接双击 `site/index.html` 即可离线浏览**（图片、附件均可正常查看/下载）。

> `mkdocs.yml` 已设 `use_directory_urls: false`，使每个 `.md` 生成同名 `.html`，
> 从而正文中 `./files/xxx.png` 的相对引用在 `file://` 下也能正确解析。**请勿改回 `true`**，否则页面落入子目录导致图片路径失效。
>
> 离线双击时：顶部搜索框在 `file://` 下不可用（浏览器禁止本地 fetch）；界面字体走 CDN，离线时自动回退系统字体，不影响阅读。

## 五、部署到 GitHub Pages

站点已配置为部署至 <https://martlet121.github.io/>（`mkdocs.yml` 的 `site_url`）。

1. 本地 `mkdocs build` 生成 `site/`，或用 GitHub Action 执行构建。
2. 在仓库 **Settings → Pages** 中选择发布 `site/` 目录（或用 `mkdocs gh-deploy` 推到 `gh-pages` 分支）。
3. 首次上线后，把 `https://martlet121.github.io/sitemap.xml` 提交到 **Google Search Console / Bing Webmaster**。

## 六、SEO / GEO 优化

全站已做搜索引擎（SEO）与 AI 搜索引擎（GEO）优化：

**静态信号（构建时落地）**
- `site_url` → 每页自动生成 `<link rel="canonical">`，并填充 `sitemap.xml`（含 `lastmod`）。
- 每篇文档在 front matter 注入**独立 `description`**，避免全站重复描述。
- `robots.txt` 指向 sitemap；`llms.txt` / `llms-full.txt` 供 AI 引擎（ChatGPT / Perplexity / Claude 等）检索。

**动态信号（`docs/javascripts/extra.js` 客户端注入）**
- 站点级 + 每页级 **Open Graph / Twitter Card**。
- **结构化数据 JSON-LD**：`WebSite` + 每页 `Article`。
- 渲染后 `lang="zh-CN"`。

> 说明：当前 Material 9.7.6 的 `base.html` 不会自动渲染 `config.extra_head`，故上述动态标签统一由 `extra.js` 注入。

**刷新 SEO 元信息**：新增或改写 `.md` 后，可重跑生成器（幂等，已有 `description` 会跳过）：

```powershell
python seo_gen.py
mkdocs build
```

## 七、一比一还原换行（自定义扩展）

- `hardbreak.py`：把“同一段落内的软回车”转成单个 `<br />`（不双换行），并把“多处连续空行”按比例还原成对应数量的空行间距。
- 通过 `pip install -e .`（见第一节）以可编辑方式装入环境后，`mkdocs build` 自动加载。

**请勿删除** `hardbreak.py`、`pyproject.toml`、`seo_gen.py` 以及 `docs/` 下的 `robots.txt` / `llms*.txt` / `javascripts/extra.js` / `stylesheets/extra.css`。

## 关于“一比一还原”的说明

- 已开启 GitHub 风格 Markdown 扩展（表格、任务列表、提示框、代码高亮、emoji 等），确保语法原样渲染。
- 正文里的每一个标题、段落、列表、表格、代码块都与源 Markdown 一一对应，不会丢失或改写内容。
