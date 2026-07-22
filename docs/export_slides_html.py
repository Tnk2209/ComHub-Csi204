import re

with open('docs/SLIDE_PRESENTATION_OUTLINE.md', 'r', encoding='utf-8') as f:
    content = f.read()

html_content = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Slide Presentation Outline - ComHub CSI204</title>
    <style>
        body {
            font-family: 'Sarabun', 'Segoe UI', Tahoma, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #0f172a;
            color: #f8fafc;
        }
        .slide-card {
            background-color: #1e293b;
            border-left: 6px solid #38bdf8;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        }
        h1 {
            color: #38bdf8;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #f1f5f9;
            border-bottom: 1px solid #334155;
            padding-bottom: 8px;
            margin-top: 0;
        }
        ul {
            line-height: 1.8;
            font-size: 16px;
        }
        li {
            margin-bottom: 8px;
        }
        strong {
            color: #38bdf8;
        }
        @media print {
            body { background-color: #fff; color: #000; padding: 0; }
            .slide-card { background-color: #fff; color: #000; border: 1px solid #ccc; page-break-after: always; }
            strong { color: #0284c7; }
        }
    </style>
</head>
<body>
    <h1>📊 เนื้อหาสไลด์การนำเสนอ Final Project (ComHub - CSI204)</h1>
"""

slides = content.split('## 🖼️ ')
for slide in slides[1:]:
    lines = slide.strip().split('\n')
    title = lines[0]
    body_lines = lines[1:]
    
    html_content += f'<div class="slide-card">\n<h2>🖼️ {title}</h2>\n'
    
    in_list = False
    for line in body_lines:
        line = line.strip()
        if not line:
            continue
        line_formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
        line_formatted = re.sub(r'`(.*?)`', r'<code>\1</code>', line_formatted)
        
        if line_formatted.startswith('* ') or line_formatted.startswith('- '):
            if not in_list:
                html_content += '<ul>\n'
                in_list = True
            html_content += f'  <li>{line_formatted[2:]}</li>\n'
        else:
            if in_list:
                html_content += '</ul>\n'
                in_list = False
            html_content += f'<p>{line_formatted}</p>\n'
            
    if in_list:
        html_content += '</ul>\n'
    html_content += '</div>\n'

html_content += """
</body>
</html>
"""

with open('docs/Slide_Presentation_Outline.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Exported Slide_Presentation_Outline.html successfully!")
