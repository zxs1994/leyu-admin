#!/usr/bin/env python3
import subprocess
import sys
from datetime import datetime
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_git_commits(start_date, end_date, author=None):
    """获取指定时间范围内的 Git 提交，可按作者过滤"""
    cmd = [
        "git", "log",
        f"--since={start_date} 00:00:00",
        f"--until={end_date} 23:59:59",
        "--pretty=format:- %s %ad",
        "--date=short"
    ]
    if author:
        cmd.append(f'--author={author}')
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=SCRIPT_DIR
    )
    return result.stdout.strip()

def get_git_user():
    """获取当前 Git 用户名"""
    result = subprocess.run(
        ["git", "config", "user.name"],
        capture_output=True,
        text=True,
        cwd=SCRIPT_DIR
    )
    return result.stdout.strip()

def generate_weekly_report(start_date, end_date, output_file=None):
    """生成 Markdown 周报"""
    # 可以传入作者名，例如 author="你的名字"
    author_name = get_git_user()
    commits = get_git_commits(start_date, end_date, author=author_name)

    if output_file is None:
        output_file = os.path.join(SCRIPT_DIR, "weekly_report.md")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(f"## 本周工作总结 ({start_date} ~ {end_date})\n\n")
        f.write("### 本周完成的工作\n")
        if commits:
            import re
            filtered_commits = []
            lines = commits.splitlines()
            lines.reverse()  # 倒序：最新在上
            for line in lines:
                commit_msg = line.lstrip('- ').strip()
                if not re.match(r'^(v?\d+\.\d+\.\d+|clear)', commit_msg, re.IGNORECASE):
                    filtered_commits.append(line)
            if filtered_commits:
                f.write("\n".join(filtered_commits) + "\n")
            else:
                f.write("- 无提交记录\n")
        else:
            f.write("- 无提交记录\n")

    print(f"周报已生成: {output_file}")

if __name__ == "__main__":
    today = datetime.today().date()

    if len(sys.argv) == 3:
        start_date = sys.argv[1]
        end_date = sys.argv[2]
    elif len(sys.argv) == 2:
        start_date = sys.argv[1]
        end_date = str(today)
    else:
        # 默认取本周一到今天
        weekday = today.weekday()
        monday = today if weekday == 0 else today.replace(day=today.day - weekday)
        start_date = str(monday)
        end_date = str(today)

        print(start_date, end_date)

    generate_weekly_report(start_date, end_date)