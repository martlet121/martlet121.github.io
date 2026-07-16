# -*- coding: utf-8 -*-
"""SEO / GEO 站点元信息生成器（一次性，可重复运行）。

作用：
1. 为每个 docs/*.md 注入独立的 meta description（修复全站共用同一描述的问题）。
2. 生成 docs/robots.txt（指向 sitemap）。
3. 生成 docs/llms.txt 与 docs/llms-full.txt（面向 AI 搜索引擎的 GEO 摘要）。

生成的 robots.txt / llms*.txt 放在 docs/ 下，MkDocs 构建时会原样拷贝到 site/ 根目录。
"""
import os
import re
import glob
from urllib.parse import quote

DOCS = "docs"
SITE_URL = "https://martlet121.github.io/"
SKIP = {"index.md", "llms.txt", "llms-full.txt", "robots.txt"}
SITE_TITLE = "V2Ray 帮助文档"
SITE_DESC = "V2Ray 代理软件完整中文帮助文档与配置教程，涵盖安装、传输协议、路由、TLS、WebSocket、透明代理等。"


def clean(text):
    text = text.strip()
    text = re.sub(r"^#+\s*", "", text)                      # 标题符号
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)        # 图片
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)    # 链接 -> 文本
    text = re.sub(r"`([^`]*)`", r"\1", text)                # 行内代码
    text = re.sub(r"[*_]{1,3}([^*_]+)[*_]{1,3}", r"\1", text)  # 粗体/斜体
    text = re.sub(r"<[^>]+>", "", text)                    # HTML 标签
    text = re.sub(r"\s+", " ", text).strip()
    return text


def truncate(text, max_len=100):
    if len(text) <= max_len:
        return text
    return text[:max_len].rstrip("，。、,.;；:：") + "…"


def first_desc(mdpath):
    with open(mdpath, encoding="utf-8") as f:
        lines = f.read().splitlines()
    start = 0
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                start = i + 1
                break
    for line in lines[start:]:
        s = line.strip()
        if not s:
            continue
        if s.startswith("```") or s.startswith("|") or s.startswith("!["):
            continue
        if re.match(r"^https?://\S+$", s):
            continue
        t = clean(s)
        if t and len(t) > 4:
            return truncate(t)
    return None


def yq(s):
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return '"' + s + '"'


def inject_description(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    if content.lstrip().startswith("---"):
        if re.search(r"^description\s*:", content, re.M):
            return None  # 已有 description，跳过
    desc = first_desc(path)
    if not desc:
        return None
    new = "---\ndescription: %s\n---\n\n%s" % (yq(desc), content)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new)
    return desc


def main():
    descs = {}
    for fp in sorted(glob.glob(os.path.join(DOCS, "*.md"))):
        name = os.path.basename(fp)
        if name in SKIP:
            continue
        d = inject_description(fp)
        if d:
            descs[name] = d
            print("+ description: %s" % name)
        else:
            # 已有则读取
            descs[name] = first_desc(fp) or ""

    # robots.txt
    robots = (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "Sitemap: %ssitemap.xml\n" % SITE_URL
    )
    with open(os.path.join(DOCS, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(robots)
    print("+ docs/robots.txt")

    # llms.txt / llms-full.txt
    entries = []
    full_parts = []
    for fp in sorted(glob.glob(os.path.join(DOCS, "*.md"))):
        name = os.path.basename(fp)
        if name in SKIP:
            continue
        title = name[:-3]
        url = SITE_URL + quote(title + ".html", safe=".")
        desc = descs.get(name, "")
        entries.append("- [%s](%s): %s" % (title, url, desc))
        with open(fp, encoding="utf-8") as f:
            body = f.read()
        full_parts.append("# %s\n\n%s" % (title, body))

    llms = (
        "# %s\n\n"
        "> %s\n"
        "> 本文件供 AI 搜索引擎（GEO / Generative Engine Optimization）检索使用，\n"
        "> 汇总全站文档链接与摘要。\n\n"
        "## 文档\n\n"
        "%s\n"
    ) % (SITE_TITLE, SITE_DESC, "\n".join(entries))

    llms_full = (
        "# %s\n\n> %s\n\n%s\n"
    ) % (SITE_TITLE, SITE_DESC, "\n\n".join(full_parts))

    with open(os.path.join(DOCS, "llms.txt"), "w", encoding="utf-8") as f:
        f.write(llms)
    with open(os.path.join(DOCS, "llms-full.txt"), "w", encoding="utf-8") as f:
        f.write(llms_full)
    print("+ docs/llms.txt / docs/llms-full.txt")
    print("完成：共处理 %d 个文档。" % len(descs))


if __name__ == "__main__":
    main()
