import path from "path";
import NpmPackage from "./NpmPackage.js";

function main(){
  // const pkg = new NpmPackage({
  //   name:'chalk',
  //   targetPath: path.join(import.meta.dirname,'../test')
  // })

  const pkg = new NpmPackage({
    name:'@mrnan-cli/template-vue',
    targetPath: path.join(import.meta.dirname,'../test')
  })

  pkg.install()
}

main()