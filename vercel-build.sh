#!/bin/bash
set -e

echo "[vercel-build] 开始构建 uni-app H5..."
echo "[vercel-build] Node: $(node -v) | pnpm: $(pnpm -v)"

# 执行 uni-app H5 构建（terser 已在 devDependencies 中，无需额外安装）
pnpm run build:h5

# 检查构建产物是否存在
if [ ! -d "dist/build/h5" ]; then
  echo "[vercel-build] 错误: 未找到构建产物目录 dist/build/h5"
  exit 1
fi

# 将构建产物移动到 Vercel 预期的根目录 dist 文件夹（简化 vercel.json 配置）
# 注意：uni-app 默认会把产物放到 dist/build/h5，我们把它移动到 dist 根目录
mkdir -p .temp_dist
cp -r dist/build/h5/* .temp_dist/
rm -rf dist
mv .temp_dist dist

echo "[vercel-build] 构建完成！产物目录内容:"
ls -F dist/
echo "[vercel-build] 总文件数: $(find dist -type f | wc -l)"
