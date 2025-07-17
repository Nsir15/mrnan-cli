import path from 'node:path'
import os from 'node:os'
import ora from 'ora';
import fse from 'fs-extra';
import {input,select,confirm}  from '@inquirer/prompts'
import {NpmPackage} from '@mrnan-cli/utils';

const create = async ()=>{
  console.log('create执行中....');
  
  let projectName = ''
  while (!projectName) {
    projectName = await input({message:'请输入项目名称'})    
  }
  
  console.log('projectName:',projectName);

  const template = await select({
    message:'请选择项目模板',
    choices:[
      {name:'vue项目',value:'@mrnan-cli/template-vue'},
      {name:'react项目',value:'@mrnan-cli/template-react'}
    ]
  })
  console.log('template:',template);

  // 下载模板到本地的指定临时目录下
  const pkg = new NpmPackage({
    name:template,
    targetPath: path.join(os.homedir(),'.mrnan-cli-template-temp')  // 创建一个临时目录
  })

  if(!await pkg.exist()){
    const spinner = ora('下载模板中...').start();
    await pkg.install();
    spinner.succeed('下载模版成功');
  }else if(await pkg.existAndOldVersion()){
    const spinner = ora('更新模板中...').start();
    await pkg.update();
    spinner.succeed('更新模板成功');
  }else{
    ora('模板已经最新').succeed();
  }
  
  // 拷贝模板，创建项目
  const projectPath = path.resolve(process.cwd(),projectName)
  const templatePath = path.resolve(pkg.npmFilePath,'template')

  if(fse.existsSync(projectPath)){
    const needEmpty = await confirm({message:'当前项目文件夹已存在，是否需要清空重新创建?'})
    if(needEmpty){
      fse.emptyDirSync(projectPath)
    }else{
      return 
    }
  }

  const spinner = ora('创建项目中...').start()

  fse.copySync(templatePath,projectPath)
  spinner.succeed('项目创建成功')

}

export default create;