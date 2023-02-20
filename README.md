关键字： vue3 vite ts node express mongon

因为是前后端均为`typescript`编写同时又是个人项目，就使用 monorepo 架构，通过配置将后端的接口类型直接交给前端，为项目维护提供巨大方便

# 运行

通过`pnpm i`装好依赖并配置环境文件后运行`pnpm use`选择`start`即可

# 功能

现在有基本的博客发送和回复评论功能，一些小工具的页面，预计有更多功能加入

# 配置

参考`env/.env.example`中的提示配置`.env`文件加载环境变量

服务器如果没有开启`https`，手动删除`packages/client/config/plugins/pwa`及其被引用的地方

`nginx`参考下面的配置

```nginx
# mime.types
types {
    application/manifest+json       webmanifes; # pwa的mainfest文件类型 需要https
}

# nginx.conf
server{
    # 其它https的配置不列出了

    # 配置根目录
    location / {
        root   xxx; # 前端打包结果dist所在目录 .env中的PUBLIC_DIST_PATH
        index  index.html;
        proxy_pass http://localhost:PORT; # 后端运行的位置 端口号是.env中的PORT
        try_files $uri $uri/ /index.html;
    }

    # 配置ajax代理
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:PORT; # 后端运行的位置
        add_header X-Slave $upstream_addr;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real_Ip $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 配置静态资源代理
    location /static/ { # 静态资源访问前缀 .env中的PUBLIC_STATIC_PREFIX
        root /xxx; # 静态资源路径 .env中的PUBLIC_STATIC_PATH
        autoindex on;
        try_files $uri /xxx/dist/index.html; # 前端页面
    }
}
```
