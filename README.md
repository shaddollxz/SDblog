新版博客源码
相比原来的它使用 ts 写前后端
使用技术栈有 vue3 vite ts node express mongon
因为是个人项目，前后端直接使用 monorepo 架构，后端的数据类型直接交给前端，维护数据库时会变得很方便

# 运行

依次运行下面的命令

```
pnpm install
pnpm font // 生成字体文件
pnpm dev:client
pnpm build:client
pnpm build:server
pnpm pm2
```
