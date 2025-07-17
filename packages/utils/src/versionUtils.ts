import axios from "axios";
import urlJoin from "url-join";

const getNpmRegistryUrl = ()=>{
  // return 'https://registry.npmmirror.com';
  return 'https://registry.npmjs.org';  // 因为 发布的时候是 npm 源地址，所以安装也要使用这个
}

const getNpmInfo = async (packageName:string)=>{
  const registryUrl = getNpmRegistryUrl();
  const packageUrl = urlJoin(registryUrl,packageName);
  try {
    const response = await axios.get(packageUrl);
    if(response.status === 200){
      return response.data
    }
    return {}
  } catch (error) {
    return Promise.reject(error)
  }
}

const getLatestVersion = async (packageName:string)=>{
  const npmInfo = await getNpmInfo(packageName)
  return npmInfo['dist-tags'].latest;
}

const getVersions = async (packageName:string)=>{
  const data = await getNpmInfo(packageName)
  return Object.keys(data.versions);
}


export {
  getNpmRegistryUrl,
  getNpmInfo,
  getLatestVersion,
  getVersions
}