# Rongyuan compiled build unpacker

import json
from pathlib import Path
from typing import Dict

current_dir = Path(__file__).parent

index_maps = [current_dir / "index.js.map", current_dir / "dist" / "index.js.map"]
index_map: Path = None
for map in index_maps:
    if map.exists():
        index_map = map
        break

if index_map is None:
    print("index.js.map not found")
    exit(1)

print("✨ Loading index.js.map")
with open(index_map, "r") as fp:
    index_map_data = json.load(fp)

if "sourcesContent" not in index_map_data:
    print("⚠️ Unable to find sourcesContent in map file!")
    exit(1)

target_extraction = current_dir / "src"
if target_extraction.exists():
    print("✨ Target extraction directory already exists, skipping")
    exit(0)

print("🤖 Creating file mapping...")
file_mapping: Dict[str, str] = {}
for idx, fn_name in enumerate(index_map_data["sources"]):
    file_mapping[fn_name] = index_map_data["sourcesContent"][idx]

print(f"📎 Creating {len(list(file_mapping.keys()))} files...")
for fn_name, fn_content in file_mapping.items():
    fn_path = target_extraction / fn_name
    fn_path.parent.mkdir(parents=True, exist_ok=True)
    with open(fn_path, "w", encoding="utf-8") as fp:
        fp.write(fn_content.replace("\r\n", "\n"))

print("🔓 Source map extraction successful!")
