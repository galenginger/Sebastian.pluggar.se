import os
import re
from pathlib import Path

# Mapping av gamla till nya sökvägar
mappings = {
    # Del 1 -> Grunderna
    'lektioner/del1/01-introduktion.md': 'grunderna/introduktion.md',
    'lektioner/del1/02-klasser-objekt.md': 'grunderna/klasser-objekt.md',
    'lektioner/del1/03-properties.md': 'grunderna/properties.md',
    'lektioner/del1/04-metoder.md': 'grunderna/metoder.md',
    'lektioner/del1/05-konstruktorer.md': 'grunderna/konstruktorer.md',
    'lektioner/del1/06-inkapsling.md': 'grunderna/inkapsling.md',
    'lektioner/del1/07-arv.md': 'grunderna/arv.md',
    'lektioner/del1/08-polymorfism.md': 'grunderna/polymorfism.md',
    'lektioner/del1/09-abstraktion.md': 'grunderna/abstraktion.md',
    'lektioner/del1/10-interface.md': 'grunderna/interface.md',
    
    # Del 2 -> Koncept
    'lektioner/del2/11-static.md': 'koncept/static-vs-instance.md',
    'lektioner/del2/12-collections.md': 'koncept/collections.md',
    'lektioner/del2/13-enums.md': 'koncept/enums.md',
    'lektioner/del2/14-exceptions.md': 'koncept/exceptions.md',
    'lektioner/del2/15-delegates.md': 'koncept/delegates.md',
    'lektioner/del2/16-namespace.md': 'koncept/namespace.md',
    
    # Del 3 -> Avancerat
    'lektioner/del3/17-modern-features.md': 'avancerat/moderna-features.md',
    'lektioner/del3/18-primary-constructors.md': 'avancerat/primary-constructors.md',
    'lektioner/del3/19-collection-expressions.md': 'avancerat/collection-expressions.md',
    'lektioner/del3/20-records.md': 'avancerat/records.md',
    'lektioner/del3/21-pattern-matching.md': 'avancerat/pattern-matching.md',
    'lektioner/del3/22-nullable.md': 'avancerat/nullable.md',
    
    # Del 4 -> Praktik
    'lektioner/del4/23-solid.md': 'praktik/solid.md',
    'lektioner/del4/24-design-patterns.md': 'praktik/design-patterns.md',
    'lektioner/del4/25-testing.md': 'praktik/testing.md',
    'lektioner/del4/26-uml.md': 'praktik/uml.md',
    'lektioner/del4/27-common-mistakes.md': 'praktik/misstag.md',
    'lektioner/del4/28-projects.md': 'praktik/projekt.md',
}

# Relativnamn mappningar för enklare länkar
simple_mappings = {
    '01-introduktion.md': 'introduktion.md',
    '02-klasser-objekt.md': 'klasser-objekt.md',
    '03-properties.md': 'properties.md',
    '04-metoder.md': 'metoder.md',
    '05-konstruktorer.md': 'konstruktorer.md',
    '06-inkapsling.md': 'inkapsling.md',
    '07-arv.md': 'arv.md',
    '08-polymorfism.md': 'polymorfism.md',
    '09-abstraktion.md': 'abstraktion.md',
    '10-interface.md': 'interface.md',
    '11-static.md': 'static-vs-instance.md',
    '12-collections.md': 'collections.md',
    '13-enums.md': 'enums.md',
    '14-exceptions.md': 'exceptions.md',
    '15-delegates.md': 'delegates.md',
    '16-namespace.md': 'namespace.md',
    '17-modern-features.md': 'moderna-features.md',
    '18-primary-constructors.md': 'primary-constructors.md',
    '19-collection-expressions.md': 'collection-expressions.md',
    '20-records.md': 'records.md',
    '21-pattern-matching.md': 'pattern-matching.md',
    '22-nullable.md': 'nullable.md',
    '23-solid.md': 'solid.md',
    '24-design-patterns.md': 'design-patterns.md',
    '25-testing.md': 'testing.md',
    '26-uml.md': 'uml.md',
    '27-common-mistakes.md': 'misstag.md',
    '28-projects.md': 'projekt.md',
}

def update_links_in_file(filepath):
    """Uppdatera alla länkar i en fil"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Uppdatera fullständiga sökvägar
    for old_path, new_path in mappings.items():
        # Regex för markdown-länkar: [text](path)
        pattern = r'\[([^\]]+)\]\(' + re.escape(old_path) + r'\)'
        replacement = r'[\1](' + new_path + ')'
        content = re.sub(pattern, replacement, content)
    
    # Uppdatera relativa länkar (samma mapp)
    for old_name, new_name in simple_mappings.items():
        pattern = r'\[([^\]]+)\]\(' + re.escape(old_name) + r'\)'
        replacement = r'[\1](' + new_name + ')'
        content = re.sub(pattern, replacement, content)
    
    # Fixa länkar mellan mappar
    # Från grunderna till koncept
    if 'grunderna' in str(filepath):
        content = content.replace('](11-static.md)', '](../koncept/static-vs-instance.md)')
        content = content.replace('](static-vs-instance.md)', '](../koncept/static-vs-instance.md)')
    
    # Från koncept till avancerat
    if 'koncept' in str(filepath):
        content = content.replace('](17-modern-features.md)', '](../avancerat/moderna-features.md)')
        content = content.replace('](moderna-features.md)', '](../avancerat/moderna-features.md)')
    
    # Från avancerat till praktik
    if 'avancerat' in str(filepath):
        content = content.replace('](23-solid.md)', '](../praktik/solid.md)')
        content = content.replace('](solid.md)', '](../praktik/solid.md)')
    
    # Skriv bara om innehållet ändrades
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Uppdaterade {filepath}")
        return True
    return False

# Hitta och uppdatera alla markdown-filer
docs_path = Path('docs')
folders = ['grunderna', 'koncept', 'avancerat', 'praktik']

updated_count = 0
for folder in folders:
    folder_path = docs_path / folder
    if folder_path.exists():
        for md_file in folder_path.glob('*.md'):
            if update_links_in_file(md_file):
                updated_count += 1

# Uppdatera index.md och kursoversikt.md
for file in ['docs/index.md', 'docs/kursoversikt.md']:
    if Path(file).exists():
        if update_links_in_file(Path(file)):
            updated_count += 1

print(f"\n✅ Klart! Uppdaterade {updated_count} filer")
