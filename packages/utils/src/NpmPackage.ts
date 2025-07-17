import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'
// @ts-ignore
import npminstall from 'npminstall'
import {getNpmRegistryUrl,getLatestVersion, getNpmInfo} from './versionUtils.js'

export interface INpmPackageOption{
  name: string
  targetPath: string
}

class NpmPackage{

  targetPath = ''
  name = ''
  version = ''
  storePath = ''
  constructor(options:INpmPackageOption){
    const {name,targetPath} = options
    this.targetPath = targetPath;
    this.name = name;
    this.storePath = path.join(this.targetPath,'/node_modules');
  }

  get npmFilePath(){
    return path.resolve(this.storePath,`.store/${this.name.replace('/','+')}@${this.version}/node_modules/${this.name}`);
  }
  async prepare(){
    if(!fs.existsSync(this.targetPath)){
      // 原生 fs.mkdirSync 仅支持创建单级目录。如果目标路径中包含不存在的父级目录（例如要创建 a/b/c，但 a 或 a/b 不存在），会直接抛出错误
      // fs.mkdirSync(this.targetPath)
      fse.mkdirpSync(this.targetPath)
    }
    this.version = await getLatestVersion(this.name);
  }

  async getPackageJson(){
    if(await this.exist()){
      const packageJsonPath = path.join(this.npmFilePath,'./package.json')
      const data = fse.readJSONSync(packageJsonPath)
      return data
    }
    return null
  }
  async exist(){
    await this.prepare()
    return fs.existsSync(this.npmFilePath)
  }

  
  /**
   * 检查 npm 包是否已存在，并且当前版本是否为旧版本。
   * 如果包存在且当前版本与最新版本不一致，则认为是旧版本。
   * @returns {Promise<boolean>} 若包存在且为旧版本返回 true，否则返回 false。
   */
  async existAndOldVersion(){
    if(await this.exist()){
      const latestVersion = await this.getLatestVersion()
      const pkgJson = await this.getPackageJson();
      return latestVersion !== pkgJson.version;
    }
    return false
  }

  async install(){
    await this.prepare()
    npminstall({
      root: this.targetPath,
      registry: getNpmRegistryUrl(),
      pkgs:[
        {
          name: this.name,
          version: this.version
        }
      ]
    })
  }

  async getLatestVersion(){
    return getLatestVersion(this.name)
  }

  async update(){
    const latestVersion = await this.getLatestVersion()
    npminstall({
      root: this.targetPath,
      registry: getNpmRegistryUrl(),
      pkgs:[
        {
          name: this.name,
          version: latestVersion
        }
      ]
    })
  }
}

export default NpmPackage;