#!/usr/bin/env node
// 被 bin 指向的脚本（如 dist/index.js）必须满足一个前提：首行必须添加 #!/usr/bin/env node（称为 "shebang" 声明），用于告诉系统用 Node.js 环境执行该脚本。
import create from "@mrnan-cli/create";
import {Command} from 'commander'
import fs from 'fs-extra'
import path from "node:path";

const program = new Command();

const pkgJsonPath = path.join(import.meta.dirname,'../package.json');
const pkgJson = fs.readJsonSync(pkgJsonPath);

program.name('mrnan-cli')
.description('项目脚手架')
.version(pkgJson.version)


program.command('create')
.description('创建项目')
.action((projectName)=>{
  create()
})

program.parse();