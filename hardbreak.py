"""自定义 Markdown 扩展：最大化还原原始 Markdown 的换行。

包含两部分：

1. 内置扩展 `markdown.extensions.nl2br` 先把“同一段落内的软回车”变成 `<br />\n`；
   本文件的后处理器再把 `<br>` 后紧跟的换行符去掉，避免与 CSS
   `white-space: pre-wrap` 叠加产生“双换行”（空一行）。
   —— 换行由单个 <br /> 负责，空格/前导空格仍由 pre-wrap 负责。

2. 前处理器：原始文件中“多处连续空行”（多个回车）会被 Markdown 默认
   折叠成 1 个段落间距。这里把 >=2 个连续空行整体替换成一个占位符
   `BLKLINE_K`（K 为空行数），再保留 1 个空行作为段落分隔，从而按数量
   还原空行。

   重要：MkDocs Material 使用 pymdownx.superfences，它会先把代码块提取成
   形如 `wzxhzdk:N` 的暂存占位符，最后才还原为 HTML。本前处理器把这些
   占位符与真正的围栏（``` / ~~~）一视同仁，统称为“标记行”，其周围
   （相邻行、相邻空行区间）一律原样保留真实空行、绝不附加 BLKLINE 占位符。
   否则占位符一旦被改动，pymdownx 无法还原，表现为后续代码块被包进 <p>、
   甚至多个代码块融合为一个。因此“多处空行还原”只在远离标记行的正文中生效。
"""
import re
from markdown import Extension
from markdown.preprocessors import Preprocessor
from markdown.postprocessors import Postprocessor


_FENCE_RE = re.compile(r"^\s*(```|~~~)")
_TOKEN_RE = re.compile(r"BLKLINE_(\d+)")
# pymdownx 把提取出的代码块等以占位符（如 wzxhzdk:0）暂存，
# 这些占位符在最终阶段才会被还原为 HTML。预处理时必须原样透传，
# 否则一旦被附加 BLKLINE 占位符，pymdownx 就无法匹配还原，
# 表现为后续代码块被包进 <p> 甚至多个代码块融合。
_STASH_RE = re.compile(r"wzxhzdk:\d+")


def _is_marker(line):
    """围栏（``` / ~~~）或 pymdownx 暂存占位符（wzxhzdk:N）都算“标记行”。

    pymdownx.superfences 会先把代码块提取成 wzxhzdk:N 占位符，
    之后才还原为 HTML。这些占位符与真正的围栏一样，周围的空行绝不能
    被附加 BLKLINE 占位符、也不能被增删行，否则 pymdownx 无法还原，
    表现为后续代码块被包进 <p> 或多个代码块融合。
    """
    return bool(_FENCE_RE.match(line) or _STASH_RE.search(line))


class BlankLinePreprocessor(Preprocessor):
    def run(self, lines):
        result = []
        in_fence = False
        fence = None
        i = 0
        n = len(lines)
        while i < n:
            line = lines[i]
            stripped = line.strip()
            if not in_fence:
                m = _FENCE_RE.match(line)
                if m:
                    in_fence = True
                    fence = m.group(1)
            else:
                if stripped.startswith(fence):
                    in_fence = False

            # 围栏行 / pymdownx 占位符：原样透传，绝不改动。
            # （in_fence 分支同时覆盖“代码块内部”的行。）
            if in_fence or _is_marker(line):
                result.append(line)
                i += 1
                continue

            # 统计紧随其后的连续空行数量
            j = i + 1
            blanks = 0
            while j < n and lines[j].strip() == "":
                blanks += 1
                j += 1

            # 当前行是否与“标记行”（围栏/占位符）相邻：
            # 前一行是标记、后一行是标记、或空行区间之后紧跟标记。
            near_marker = (
                (i > 0 and _is_marker(lines[i - 1]))
                or (i + 1 < n and _is_marker(lines[i + 1]))
                or (j < n and _is_marker(lines[j]))
            )

            if near_marker:
                # 与标记相邻：原样保留真实空行，绝不附加 BLKLINE 占位符。
                # 仅当“非空白内容行紧贴标记”时补一个空行保证分隔。
                result.append(line)
                if line.strip() != "" and blanks == 0:
                    result.append("")
                for _ in range(blanks):
                    result.append("")
                i = j
            elif blanks == 0:
                # 下一行直接是内容：同一段落内的软回车，交给 nl2br 处理
                result.append(line)
                i = i + 1
            elif blanks == 1:
                # 单个空行：保留为段落分隔（1 个空行间距）
                result.append(line)
                result.append("")
                i = j
            else:
                # 多个连续空行（K 个）且不与标记相邻：用行内占位符表达 K-1 个
                # 额外空行，再保留 1 个空行作为段落分隔，整体还原 K 个空行。
                result.append(line + "BLKLINE_%d" % (blanks - 1))
                result.append("")
                i = j
        return result


class HardBreakPostprocessor(Postprocessor):
    _double_re = re.compile(r"<br\s*/?>\r?\n")
    _token_re = _TOKEN_RE

    def run(self, text):
        # 去掉 nl2br 产生的 <br /> 后的换行，避免双换行
        text = self._double_re.sub("<br />", text)
        # 把占位符转成对应数量的 <br />
        def _replace(m):
            k = int(m.group(1))
            return "<br />" * k

        return self._token_re.sub(_replace, text)


class HardBreakExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(BlankLinePreprocessor(md), "blanklines", 10)
        md.postprocessors.register(HardBreakPostprocessor(md), "hardbreak", 5)


def makeExtension(*args, **kwargs):
    return HardBreakExtension(*args, **kwargs)
