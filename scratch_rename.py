import os
import re

directories_to_ignore = {'node_modules', '.venv', 'venv', 'coverage', '.git', '__pycache__'}
files_to_ignore = {'package-lock.json', '.package-lock.json', 'legalease.db', 'coverage-final.json'}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
    
    # Do not replace legalease in DB names or package names inside package.json
    if "package.json" in filepath:
        content = content.replace('"name": "legalease-app"', '"name": "kanoon-sathi-app"')
        # other occurrences
        content = content.replace('Kanoon Sathi', 'Kanoon Sathi')
    else:
        # replace Kanoon Sathi -> Kanoon Sathi
        content = content.replace('Kanoon Sathi', 'Kanoon Sathi')
        # replace kanoonsathi.com -> kanoonsathi.com
        content = content.replace('kanoonsathi.com', 'kanoonsathi.com')
        # replace legalease -> kanoon-sathi (mostly in urls or emails, but let's be careful)
        # It's better to just stick to Kanoon Sathi unless we find specific ones.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root = r'd:\kanoon-Sathi'
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in directories_to_ignore]
        for filename in filenames:
            if filename in files_to_ignore:
                continue
            if not (filename.endswith('.md') or filename.endswith('.json') or 
                    filename.endswith('.ts') or filename.endswith('.tsx') or 
                    filename.endswith('.py') or filename.endswith('.html') or 
                    filename.endswith('.css') or filename == '.env' or filename == '.env.example'):
                continue
            filepath = os.path.join(dirpath, filename)
            replace_in_file(filepath)

if __name__ == '__main__':
    main()
