import re

with open('docs/SDLC_FULL_REPORT.md', 'r', encoding='utf-8') as f:
    content = f.read()

html_content = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>รายงานโครงงานวิศวกรรมซอฟต์แวร์ SDLC 7 ขั้นตอน - ComHub</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
        body {
            font-family: 'Sarabun', 'Segoe UI', Tahoma, sans-serif;
            line-height: 1.8;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            padding: 50px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        h1 {
            color: #0f172a;
            font-size: 26px;
            text-align: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        h2 {
            color: #0369a1;
            font-size: 20px;
            border-bottom: 2px solid #bae6fd;
            padding-bottom: 8px;
            margin-top: 35px;
            page-break-before: always;
        }
        h3 {
            color: #0f172a;
            font-size: 16px;
            margin-top: 20px;
        }
        p, li {
            font-size: 15px;
            color: #334155;
        }
        ul, ol {
            padding-left: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            text-align: left;
            font-size: 14px;
        }
        th {
            background-color: #0284c7;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f1f5f9;
        }
        code {
            background-color: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
        }
        a {
            color: #0284c7;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        @media print {
            body { background-color: #fff; padding: 0; }
            .container { box-shadow: none; padding: 20px; max-width: 100%; }
            h2 { page-break-before: always; }
        }
    </style>
</head>
<body>
    <div class="container">
"""

# Simple Markdown to HTML conversion
lines = content.split('\n')
in_list = False

for line in lines:
    line_str = line.strip()
    if not line_str:
        if in_list:
            html_content += "</ul>\n"
            in_list = False
        continue
    
    # Format inline markup
    formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line_str)
    formatted = re.sub(r'`(.*?)`', r'<code>\1</code>', formatted)
    formatted = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" target="_blank">\1</a>', formatted)

    if formatted.startswith('# '):
        html_content += f"<h1>{formatted[2:]}</h1>\n"
    elif formatted.startswith('## '):
        html_content += f"<h2>{formatted[3:]}</h2>\n"
    elif formatted.startswith('### '):
        html_content += f"<h3>{formatted[4:]}</h3>\n"
    elif formatted.startswith('- ') or formatted.startswith('* '):
        if not in_list:
            html_content += "<ul>\n"
            in_list = True
        html_content += f"  <li>{formatted[2:]}</li>\n"
    elif formatted.startswith('---'):
        html_content += "<hr/>\n"
    else:
        if in_list:
            html_content += "</ul>\n"
            in_list = False
        html_content += f"<p>{formatted}</p>\n"

if in_list:
    html_content += "</ul>\n"

html_content += """
    </div>
</body>
</html>
"""

with open('docs/SDLC_FULL_REPORT.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Exported docs/SDLC_FULL_REPORT.html successfully!")
