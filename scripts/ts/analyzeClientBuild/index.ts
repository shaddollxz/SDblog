import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
const distPath = process.argv.splice(2)[0];

if (distPath) {
    await main();
}

async function main() {
    const { sizes, gzipSizes } = await allFileSize(distPath);

    let normalSize = 0,
        gzipSize = 0;
    for (let key in sizes) {
        normalSize += sizes[key];
        gzipSize += gzipSizes[key] ? gzipSizes[key] : sizes[key];
    }

    console.log(chalk.blue("gzip前包总大小 " + (normalSize / 1024).toFixed(2) + "kb"));
    console.log(chalk.green("gzip后包总大小 " + (gzipSize / 1024).toFixed(2) + "kb"));
}

async function allFileSize(
    src: string,
    sizes: object = {},
    gzipSizes: object = {}
): Promise<{ sizes: object; gzipSizes: object }> {
    const files = await fs.readdir(src);
    for (const file of files) {
        const filePath = path.resolve(src, `./${file}`);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            const { sizes: _s, gzipSizes: _g } = await allFileSize(filePath, sizes, gzipSizes);
            sizes = _s;
            gzipSizes = _g;
        } else {
            if (file.endsWith(".gz")) {
                gzipSizes[file.replace(".gz", "")] = stat.size;
            } else {
                sizes[file] = stat.size;
            }
        }
    }
    return { sizes, gzipSizes };
}
